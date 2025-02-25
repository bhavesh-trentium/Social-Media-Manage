const fs = require("fs");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

// Ensure the font is installed on the system
const fontFamily = "Great Vibes"; // Must be installed on the system

const addTextToImage = async (imagePath, text, outputPath) => {
  try {
    const image = await loadImage(imagePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");

    // Draw the original image without quality loss
    ctx.drawImage(image, 0, 0, image.width, image.height);

    // Apply a semi-transparent black overlay over the entire image
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // 50% transparency
    ctx.fillRect(0, 0, image.width, image.height);

    // Define max character limit
    const maxChars = 150;
    if (text.length > maxChars) {
      text = text.substring(0, maxChars) + "...";
    }

    // Set text properties
    let fontSize = 70;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${fontSize}px "${fontFamily}"`;

    // Define max width and height constraints for text
    const maxWidth = image.width * 0.8;
    const maxHeight = image.height * 0.4;
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

    // Adjust font size dynamically
    let lines;
    while (true) {
      ctx.font = `${fontSize}px "${fontFamily}"`;

      lineHeight = fontSize * 1.2;
      lines = wrapText(ctx, text, maxWidth);

      if (lines.length * lineHeight <= maxHeight || fontSize < 20) {
        break;
      }
      fontSize -= 2;
    }

    // Draw the wrapped text on the blurred background
    const startY = image.height * 0.5; // Adjust text position
    lines.forEach((line, index) => {
      ctx.fillText(line, image.width / 2, startY + index * lineHeight);
    });

    // Save the image
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outputPath, buffer);

    console.log("Image saved ✅");
  } catch (err) {
    console.error("Error adding text to image:", err);
  }
};

module.exports = addTextToImage;
