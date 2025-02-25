var cron = require("node-cron");
const {
  postImageFacebook,
  getfirebaseDatabase,
  postCaptionsGenerate,
  postImageInstagram,
  postImageTwitter,
  syncTwiiterToken,
} = require("./controllers/generatePost");
const path = require("path");
const addTextToImage = require("./utils/addTextToImage");

// List of available images
const images = [
  "img-1.png",
  "img-2.png",
  "img-3.png",
  "img-4.png",
  "img-5.png",
  "img-6.png",
  "img-7.png",
  "img-8.png",
  "img-9.png",
  "img-10.png",
];
const outputPath = path.resolve(__dirname, "./images/output.png");
let i = 1;
cron.schedule("* * * * *", async () => {
  console.log("running a task count", i++);
  await mainFunction();
});

const mainFunction = async () => {
  try {
    await syncTwiiterToken();
    const pageData = await getfirebaseDatabase();
    const responseCaption = await postCaptionsGenerate(pageData);
    const originalCaption = responseCaption.replace(/[^\w\s]/gi, "");
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const imagePath = path.resolve(
      __dirname,
      "images/templateImg",
      randomImage
    );
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
//    0 7,11,15,19 * * *    => 7am, 11pm, 3pm, 7pm
//   * * * * *  => every minutes
//   */5 * * * * *  => 5 sec
