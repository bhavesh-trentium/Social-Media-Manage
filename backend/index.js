var cron = require("node-cron");
const path = require("path");

const {
  postImageFacebook,
  getfirebaseDatabase,
  postCaptionsGenerate,
  postImageInstagram,
  postImageTwitter,
  syncTwiiterToken,
  fetchRandomImage,
  getFestivalCollection,
} = require("./controllers/generatePost");
const addTextToImage = require("./utils/addTextToImage");

const outputPath = path.resolve(__dirname, "./images/output.png");
let i = 1;
let pageData = {}; // Store page data globally

const initializePageData = async () => {
  try {
    pageData = await getfirebaseDatabase();
  } catch (error) {
    console.error("Error fetching pageData:", error);
  }
};

// Refresh pageData periodically (e.g., every 1 hour)
cron.schedule("0 * * * *", async () => {
  console.log("Refreshing pageData...");
  await initializePageData();
});

// Run initialization on startup
initializePageData();

// Regular scheduled posts
cron.schedule("0 7,11,15,19 * * *", async () => {
  console.log("Running a task count", i++);
  await mainFunction();
});

// Festival scheduled posts
cron.schedule("0 0 * * *", async () => {
  console.log("Checking for festival posts...");
  const festivalData = getFestivalCollection(JSON.parse(pageData?.festivalsData));
  if (festivalData) {
    console.log(`Festival found: ${festivalData.festivalname}, posting...`);
    await festivalPostFunction(festivalData);
  }
});

const mainFunction = async () => {
  try {
    await syncTwiiterToken();
    const responseCaption = await postCaptionsGenerate(pageData?.prompt);
    await fetchRandomImage(pageData?.category);
    const originalCaption = responseCaption.replace(/[^\w\s]/gi, "");
    // const randomImage = images[Math.floor(Math.random() * images.length)];
    // const imagePath = path.resolve(
    //   __dirname,
    //   "images/templateImg",
    //   randomImage
    // );
    const imagePath = path.resolve(__dirname, "./images/random.png");
    await addTextToImage(imagePath, originalCaption, outputPath);
    const data = { ...pageData, caption: originalCaption, img: outputPath };
    await postImageFacebook(data);
    await postImageInstagram(data);
    await postImageTwitter(data);
    console.log("Done ✅");
  } catch (error) {
    console.log(error);
  }
};

const festivalPostFunction = async (festivalData) => {
  try {
    await syncTwiiterToken();
    const festivalCaption = `Happy ${festivalData.name} 🌟`;
    console.log("festivalCaption", festivalCaption);
    await fetchRandomImage(festivalData.query);
    const responseCaption = await postCaptionsGenerate(festivalCaption);
    const imagePath = path.resolve(__dirname, "./images/random.png");
    await addTextToImage(imagePath, festivalCaption, outputPath);
    const data = {
      ...pageData?.facebook?.pageDeatail,
      caption: responseCaption,
      img: outputPath,
    };
    await postImageFacebook(data);
    await postImageInstagram(data);
    await postImageTwitter(data);
    console.log("Festival post done ✅");
  } catch (error) {
    console.log(error);
  }
};

//    0 7,11,15,19 * * *    => 7am, 11pm, 3pm, 7pm
//   * * * * *  => every minute
//   */5 * * * * *  => every 5 seconds
// 0 0 * * * every night 00:00
// 0 * * * * every 1 hour