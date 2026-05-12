const { Jimp, rgbaToInt, intToRGBA } = require('jimp');

async function splitLogo() {
  try {
    const imagePath = "C:\\Users\\prajw\\.gemini\\antigravity\\brain\\69996d64-965e-40d1-9add-67199a3ffd7e\\media__1778577790085.png";
    const image = await Jimp.read(imagePath);
    image.autocrop();

    const width = image.bitmap.width;
    const height = image.bitmap.height;

    // Find empty rows (white or transparent or very dark if it's on a dark background)
    // The new logo has a dark background `#1b1e23` or similar. Let's find the background color
    const bgColor = intToRGBA(image.getPixelColor(10, 10)); // Top left
    console.log("Background color:", bgColor);

    let emptyRows = [];
    for (let y = 0; y < height; y++) {
      let isEmpty = true;
      for (let x = 0; x < width; x++) {
        const color = intToRGBA(image.getPixelColor(x, y));
        // Check if pixel is roughly the background color
        if (Math.abs(color.r - bgColor.r) > 20 || Math.abs(color.g - bgColor.g) > 20 || Math.abs(color.b - bgColor.b) > 20) {
          if (color.a > 10) {
            isEmpty = false;
            break;
          }
        }
      }
      if (isEmpty) {
        emptyRows.push(y);
      }
    }

    let bestSplitY = -1;
    let maxGap = 0;
    let currentGap = 0;
    let currentGapStart = -1;

    for (let i = 0; i < emptyRows.length; i++) {
      if (i === 0 || emptyRows[i] === emptyRows[i - 1] + 1) {
        if (currentGapStart === -1) currentGapStart = emptyRows[i];
        currentGap++;
      } else {
        if (currentGap > maxGap) {
          maxGap = currentGap;
          bestSplitY = currentGapStart + Math.floor(currentGap / 2);
        }
        currentGapStart = emptyRows[i];
        currentGap = 1;
      }
    }
    if (currentGap > maxGap) {
      bestSplitY = currentGapStart + Math.floor(currentGap / 2);
    }

    console.log("Best split Y:", bestSplitY);

    if (bestSplitY > 0) {
      const topImage = image.clone().crop({ x: 0, y: 0, w: width, h: bestSplitY });
      const bottomImage = image.clone().crop({ x: 0, y: bestSplitY, w: width, h: height - bestSplitY });
      
      topImage.autocrop();
      bottomImage.autocrop();

      // Make background color transparent
      const makeTransparent = (img) => {
        for (let y = 0; y < img.bitmap.height; y++) {
          for (let x = 0; x < img.bitmap.width; x++) {
            const color = intToRGBA(img.getPixelColor(x, y));
            if (Math.abs(color.r - bgColor.r) < 30 && Math.abs(color.g - bgColor.g) < 30 && Math.abs(color.b - bgColor.b) < 30) {
              img.setPixelColor(rgbaToInt(0, 0, 0, 0), x, y);
            }
          }
        }
        return img;
      };

      await makeTransparent(topImage).write("src/assets/logo.png");
      
      // Let's also check if bottomImage has an inner dark square we need to remove
      let bottomTransparent = makeTransparent(bottomImage);
      
      // Additional pass: check if the center pixel is dark grey.
      const w = bottomTransparent.bitmap.width;
      const h = bottomTransparent.bitmap.height;
      const innerBgColor = intToRGBA(bottomTransparent.getPixelColor(Math.floor(w/2), Math.floor(h/4)));
      if (innerBgColor.r < 100 && innerBgColor.a > 200 && innerBgColor.r !== bgColor.r) {
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const c = intToRGBA(bottomTransparent.getPixelColor(x, y));
            if (Math.abs(c.r - innerBgColor.r) < 40 && Math.abs(c.g - innerBgColor.g) < 40 && Math.abs(c.b - innerBgColor.b) < 40) {
              bottomTransparent.setPixelColor(rgbaToInt(0, 0, 0, 0), x, y);
            }
          }
        }
      }
      
      await bottomTransparent.write("public/favicon.png");
      console.log("Successfully split into src/assets/logo.png and public/favicon.png");
    } else {
      console.log("Could not find a clear split. Saving as is.");
      await image.write("src/assets/logo.png");
    }

  } catch (err) {
    console.error(err);
  }
}

splitLogo();
