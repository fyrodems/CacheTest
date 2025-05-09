// Mock image processing
let pixels = Array(10000)
  .fill(0)
  .map((_, i) => i % 256);
let processed = pixels.map((p) => 255 - p);
console.log("Processed image with " + processed.length + " pixels");

// Przetwarzanie obrazu (symulacja)
function fakeImageProcessing() {
  let pixels = new Array(15000)
    .fill(0)
    .map(() => Math.floor(Math.random() * 256));
  let processed = pixels.map((p) => (p > 128 ? 255 : 0));
  let sum = processed.reduce((a, b) => a + b, 0);
  window.console.log(`Processed image, sum: ${sum}`);
}
fakeImageProcessing();
// Padding to ~60KB
for (let i = 0; i < 60000; i++) {
  /* padding */
}
