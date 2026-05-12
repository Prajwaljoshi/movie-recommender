const { Jimp, rgbaToInt, intToRGBA } = require('jimp');

async function splitLogo() {
  try {
    const imagePath = "C:\\Users\\prajw\\.gemini\\antigravity\\brain\\69996d64-965e-40d1-9add-67199a3ffd7e\\media__1778576284485.png";
    const image = await Jimp.read(imagePath);
    image.autocrop();

    const width = image.bitmap.width;
    const height = image.bitmap.height;

    // Find empty rows (white or transparent)
    let emptyRows = [];
    for (let y = 0; y < height; y++) {
      let isEmpty = true;
      for (let x = 0; x < width; x++) {
        const color = intToRGBA(image.getPixelColor(x, y));
        // Check if not white and not transparent
        if (color.a > 10 && !(color.r > 240 && color.g > 240 && color.b > 240)) {
          isEmpty = false;
          break;
        }
      }
      if (isEmpty) {
        emptyRows.push(y);
      }
    }

    // Find the largest contiguous block of empty rows near the middle
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

      // Make white pixels transparent
      const makeTransparent = (img) => {
        for (let y = 0; y < img.bitmap.height; y++) {
          for (let x = 0; x < img.bitmap.width; x++) {
            const color = intToRGBA(img.getPixelColor(x, y));
            if (color.r > 240 && color.g > 240 && color.b > 240) {
              img.setPixelColor(rgbaToInt(255, 255, 255, 0), x, y);
            }
          }
        }
        return img;
      };

      await makeTransparent(topImage).write("public/logo.png");
      await makeTransparent(bottomImage).write("public/favicon.png");
      console.log("Successfully split into public/logo.png and public/favicon.png");
    } else {
      console.log("Could not find a clear split. Saving as is.");
      await image.write("public/logo.png");
      await image.write("public/favicon.png");
    }

  } catch (err) {
    console.error(err);
  }
}

splitLogo();
