const axios = require("axios");
require("dotenv").config();
const Replicate = require("replicate");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { database } = require("../firebase");
const fs = require("fs");
const { twitterClient } = require("../twitterClient");
const dotenv = require("dotenv");
const FormData = require("form-data");
const uploadImageAndGetURL = require("../utils/firebaseUploadImageAndGetURL");
const path = require("path");
const getfirebaseDatabase = async () => {
  console.log("enter getfirebaseDatabase");
  return new Promise((resolve, reject) => {
    const ref = database.ref("/");
    ref.once(
      "value",
      (snapshot) => {
        resolve(snapshot.val());
      },
      (error) => {
        reject(error);
      }
    );
  });
};
const postCaptionsGenerate = async (prompt) => {
  console.log("enter postCaptionsGenerate");
  const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI);
  const model = genAI.getGenerativeModel({ model: process.env.MODEL_NAME });
  const generationConfig = {
    temperature: 1,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_HIGH_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_HIGH_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_HIGH_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_HIGH_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });
  const result = await chat.sendMessage(
    `${prompt} ${process.env.TEXT_PROMPT}`
  );
  const response = result.response;
  return response.text();
};

const postImageFacebook = async (data) => {
  try {
    console.log("enter postImageFacebook");
    if (!data.img || !fs.existsSync(data.img)) {
      throw new Error(`The image file does not exist: ${data.img}`);
    }

    // 🔹 Helper function to upload a photo
    const uploadPhoto = async (published) => {
      const formData = new FormData();
      formData.append("caption", data.caption);
      formData.append("access_token", data.access_token);
      formData.append("published", published);
      formData.append("source", fs.createReadStream(data.img));

      const { data: response } = await axios.post(
        `${process.env.FACEBOOK_ENDPOINT}${data.PageID}/photos`,
        formData,
        { headers: formData.getHeaders() }
      );

      if (!response.id) throw new Error("Error: No photo ID returned from Facebook.");
      return response.id;
    };

    // 🔹 Upload photo as a published post
    const postId = await uploadPhoto("true");

    // 🔹 Upload photo as an unpublished story
    const storyPhotoId = await uploadPhoto("false");

    // 🔹 Convert the unpublished photo into a story post
    const storyFormData = new FormData();
    storyFormData.append("photo_id", storyPhotoId);
    storyFormData.append("access_token", data.access_token);

    const { data: storyResponse } = await axios.post(
      `${process.env.FACEBOOK_ENDPOINT}${data.PageID}/photo_stories`,
      storyFormData,
      { headers: storyFormData.getHeaders() }
    );

    return { postId, story: storyResponse };
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
};

const postImageInstagram = async (data) => {
  try {
    console.log("enter postImageInstagram");

    // ✅ Upload Image & Get URL
    const image_url = await uploadImageAndGetURL(data.img);

    // ✅ Get Instagram Business Account ID
    const { data: igAccountData } = await axios.get(
      `${process.env.FACEBOOK_ENDPOINT}${data.PageID}?fields=instagram_business_account&access_token=${data.access_token}`
    );

    const instagramBusinessAccountID =
      igAccountData.instagram_business_account?.id;
    if (!instagramBusinessAccountID)
      throw new Error("No Instagram Business Account linked to this page.");

    // ✅ Function to Create & Publish Media (Story or Feed)
    const publishMedia = async (mediaType) => {
      const { data: mediaCreation } = await axios.post(
        `${process.env.FACEBOOK_ENDPOINT}${instagramBusinessAccountID}/media`,
        {
          image_url,
          caption: data.caption,
          access_token: data.access_token,
          ...(mediaType === "STORIES" && { media_type: "STORIES" }),
        }
      );

      const { data: mediaPublish } = await axios.post(
        `${process.env.FACEBOOK_ENDPOINT}${instagramBusinessAccountID}/media_publish`,
        {
          creation_id: mediaCreation.id,
          access_token: data.access_token,
        }
      );

      return mediaPublish;
    };

    // ✅ Post as both Story and Feed
    const story = await publishMedia("STORIES");
    const post = await publishMedia("FEED");

    return { story, post };
  } catch (error) {
    console.error("error", error.response?.data || error.message);
    throw error;
  }
};

const postImageTwitter = async (data) => {
  console.log("enter postImageTwitter");
  try {
    const mediaId = await twitterClient.v1.uploadMedia(data.img);
    const mediaPublish = await twitterClient.v2.tweet({
      text: data.caption,
      media: {
        media_ids: [mediaId],
      },
    });
    return mediaPublish.data;
  } catch (error) {
    console.error("Error uploading media to Twitter:", error);
    throw error;
  }
};
const syncTwiiterToken = async () => {
  return new Promise((resolve, reject) => {
    const envConfig = dotenv.parse(fs.readFileSync(".env"));
    const ref = database.ref("/twitter/accountDeatail");
    ref.once(
      "value",
      (snapshot) => {
        if (snapshot.val()) {
          envConfig["ACCESS_TOKEN"] = snapshot.val().accessToken;
          envConfig["ACCESS_SECRET"] = snapshot.val().tokenSecret;

          const updatedEnvConfig = Object.keys(envConfig)
            .map((key) => `${key}=${envConfig[key]}`)
            .join("\n");
          fs.writeFileSync(".env", updatedEnvConfig);
          resolve(snapshot.val());
        } else {
          resolve();
        }
      },
      (error) => {
        console.error("Error fetching Twitter account details: ", error);
        reject(error);
      }
    );
  });
};
const fetchRandomImage = async (category) => {
  try {
    // Fetch image from Unsplash API
    const seed = Math.floor(Math.random() * 1000000); // Generate a random seed
    const response = await axios.get(
      `${process.env.API_STABLEDIFFFUSION_ENDPOINT}${category}?width=1024&height=1024&seed=${seed}`
    );
    if (response.status === 200) {

      // Extract the image URL
      const imageUrl = response.config.url;

      // ✅ Define correct path for `images/` directory (outside `controllers/`)
      const imagesDir = path.resolve(__dirname, "../images"); // Move up one level
      const outputPath = path.join(imagesDir, "random.png");

      // ✅ Ensure the directory exists
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }

      // Fetch the image stream
      const writer = fs.createWriteStream(outputPath);
      const imageStream = await axios.get(imageUrl, { responseType: "stream" });

      // Pipe the stream to the file
      imageStream.data.pipe(writer);
      console.log('done',imageUrl)
      return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    }
  } catch (error) {
    console.error(
      "Error fetching random image:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const getFestivalCollection = (festivals) => {
  const currentDate = new Date().toISOString().split('T')[0];
  return festivals.find(festival => festival.festivalid === currentDate) || null;
};
module.exports = {
  postImageInstagram,
  postCaptionsGenerate,
  getfirebaseDatabase,
  postImageFacebook,
  postImageTwitter,
  syncTwiiterToken,
  fetchRandomImage,
  getFestivalCollection
};
