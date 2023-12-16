export function generateRandomLorem() {
  const loremWords = [
    "Lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
    // Add more words as needed
  ];

  const getRandomWord = () =>
    loremWords[Math.floor(Math.random() * loremWords.length)];

  const randomTextLength = Math.floor(Math.random() * 20);
  let randomText = "";

  while (randomText.length < randomTextLength) {
    const word = getRandomWord();
    randomText += ` ${word}`;
  }

  // Trim to the desired length (50-100 characters)
  randomText = randomText.trim().slice(0, randomTextLength);

  return randomText;
}

export function getRandomColor() {
  const randomHue = Math.floor(Math.random() * 360);
  const randomSaturation = Math.floor(Math.random() * 50) + 50; // Ensure a minimum saturation for readability
  const randomLightness = Math.floor(Math.random() * 30) + 35; // Ensure a minimum lightness for readability

  // Convert HSL to hex
  const rgbColor = hslToRgb(
    randomHue / 360,
    randomSaturation / 100,
    randomLightness / 100
  );
  const hexColor = rgbToHex(rgbColor[0], rgbColor[1], rgbColor[2]);

  return hexColor;
}

function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

// Example usage:
const randomColor = getRandomColor();
