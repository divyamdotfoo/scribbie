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

  const randomTextLength = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
  let randomText = "";

  while (randomText.length < randomTextLength) {
    const word = getRandomWord();
    randomText += ` ${word}`;
  }

  // Trim to the desired length (50-100 characters)
  randomText = randomText.trim().slice(0, randomTextLength);

  return randomText;
}
