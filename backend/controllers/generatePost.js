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
const dotenv = require('dotenv');

const getfirebaseDatabase = async () => {
    console.log("enter getfirebaseDatabase");
    return new Promise((resolve, reject) => {
        const ref = database.ref("/facebook/pageDeatail");
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
const postCaptionsGenerate = async (data) => {
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
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
    });
    const result = await chat.sendMessage(
        `${data.prompt} ${process.env.TEXT_PROMPT}`
    );
    const response = result.response;
    return response.text();
};
const postImageGenerate = async (data) => {
    console.log("enter postImageGenerate");

    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });
    const output = await replicate.run(process.env.REPLICATE_MODEL_NAME, {
        input: {
            width: 1024,
            height: 1024,
            prompt: data.prompt,
            scheduler: "K_EULER",
            num_outputs: 1,
            guidance_scale: 0,
            negative_prompt: "worst quality, low quality",
            num_inference_steps: 4,
        },
    });
    return output[0];
};
const postImageFacebook = async (data) => {
    try {
        console.log("enter postImageFacebook");
        const formData = new FormData();
        formData.append("message", data.caption);
        formData.append("access_token", data.access_token);
        formData.append("url", data.img);

        const response = await axios.post(
            `${process.env.FACEBOOK_ENDPOINT}${data.PageID}/photos`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("error", error);
        throw error;
    }
};
const postImageInstagram = async (data) => {
    try {
        console.log("enter postImageInstagram");

        const instagramBusinessAccountID = await axios.get(
            `${process.env.FACEBOOK_ENDPOINT}${data.PageID}?fields=instagram_business_account&access_token=${data.access_token}`
        );

        const responeseCreationID = await axios.post(
            `${process.env.FACEBOOK_ENDPOINT}${instagramBusinessAccountID.data.instagram_business_account.id}/media?`,
            {
                image_url: data.img,
                caption: data.caption,
                access_token: data.access_token,
            }
        );

        const Result = await axios.post(
            `${process.env.FACEBOOK_ENDPOINT}${instagramBusinessAccountID.data.instagram_business_account.id}/media_publish?`,
            {
                creation_id: responeseCreationID.data.id,
                access_token: data.access_token,
            }
        );

        return Result.data;
    } catch (error) {
        console.error("error", error);
        throw error;
    }
};
const postImageTwitter = async (data) => {
    const uri = data.img;
    const filename = "image.png";
    console.log("enter postImageTwitter");
    downloadImage(uri, filename, async () => {
        try {
            const mediaId = await twitterClient.v1.uploadMedia("./image.png");
            const mediaPublish = await twitterClient.v2.tweet({
                text: data.caption,
                media: {
                    media_ids: [mediaId],
                },
            });
            deletePhoto("./image.png");
            return mediaPublish.data;
        } catch (error) {
            console.error("Error uploading media to Twitter:", error);
            throw error;
        }
    });
};
const downloadImage = async (imageUrl, localFilePath, callback) => {
    const response = await axios({
        url: imageUrl,
        method: "GET",
        responseType: "stream",
    });
    await response.data
        .pipe(fs.createWriteStream(localFilePath))
        .on("close", callback);
};
const deletePhoto = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error("Error deleting photo:", err);
            return;
        }
    });
};
const syncTwiiterToken = async () => {
    return new Promise((resolve, reject) => {
        const envConfig = dotenv.parse(fs.readFileSync('.env'));
        const ref = database.ref("/twitter/accountDeatail");
        ref.once(
            "value",
            (snapshot) => {
                envConfig['ACCESS_TOKEN'] = snapshot.val().accessToken;
                envConfig['ACCESS_SECRET'] = snapshot.val().tokenSecret;

                const updatedEnvConfig = Object.keys(envConfig)
                    .map(key => `${key}=${JSON.stringify(envConfig[key])}`)
                    .join('\n');

                fs.writeFileSync('.env', updatedEnvConfig);
                resolve(snapshot.val());
            },
            (error) => {
                reject(error);
            }
        );
    })

}
module.exports = {
    postImageInstagram,
    postCaptionsGenerate,
    getfirebaseDatabase,
    postImageFacebook,
    postImageGenerate,
    postImageTwitter,
    syncTwiiterToken,
};
