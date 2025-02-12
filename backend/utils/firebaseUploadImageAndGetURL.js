const path = require("path");
const { storage } = require("../firebase");

const uploadImageAndGetURL = async (filePath) => {
  try {
    //TODO: for this time destination path add static after this removed `InstagramPost/Reels/`
    const destination = `InstagramPost/Reels/${path.basename(filePath)}`;

    // Delete the existing file if it exists
    const file = storage.file(destination);
    const [exists] = await file.exists();
    if (exists) {
      await file.delete();
    }

    // Upload the new image
    await storage.upload(filePath, {
      destination: destination,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0],
    });

    // Add a cache-busting parameter to the URL
    const cacheBustingUrl = `${url}&v=${new Date().getTime()}`;

    return cacheBustingUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

module.exports = uploadImageAndGetURL;
