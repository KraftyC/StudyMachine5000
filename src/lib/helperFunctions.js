export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function sortChapters(a, b) {
  const numA = parseInt(a.split(" - ")[0]);
  const numB = parseInt(b.split(" - ")[0]);
  return numA - numB;
}