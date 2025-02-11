const fs = require("fs");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

const addTextToImage = async (imagePath, text, outputPath) => {
  try {
    const image = await loadImage(imagePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");

    // Draw the image on the canvas
    ctx.drawImage(image, 0, 0);

    // Define maximum character limit
    const maxChars = 150; // Change this value if needed
    if (text.length > maxChars) {
      text = text.substring(0, maxChars) + "..."; // Truncate and add ellipsis
    }

    // Define font properties
    let fontSize = 50; // Start with a large font size
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Define max width and height constraints for text
    const maxWidth = image.width * 0.8; // 80% of the image width
    const maxHeight = image.height * 0.4; // 40% of the image height
    let lineHeight = fontSize * 1.2;

    // Function to wrap text into multiple lines
    function wrapText(context, text, maxWidth) {
      let words = text.split(" ");
      let lines = [];
      let line = "";

      for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + " ";
        let testWidth = context.measureText(testLine).width;

        if (testWidth > maxWidth && i > 0) {
          lines.push(line);
          line = words[i] + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      return lines;
    }

    // Adjust font size dynamically if text exceeds max height
    let lines;
    while (true) {
      ctx.font = `${fontSize}px Arial`;
      lineHeight = fontSize * 1.2;
      lines = wrapText(ctx, text, maxWidth);

      if (lines.length * lineHeight <= maxHeight || fontSize < 20) {
        break;
      }
      fontSize -= 2; // Reduce font size step by step if needed
    }

    // Draw the wrapped text on the image
    const startY = image.height / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
      ctx.fillText(line, image.width / 2, startY + index * lineHeight);
    });

    // Save the image
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outputPath, buffer);

    console.log("Image saved with wrapped and resized text overlay.");
  } catch (err) {
    console.error("Error adding text to image:", err);
  }
};

module.exports= addTextToImage;
