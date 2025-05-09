// Transformacja danych
let data = [];
for (let i = 0; i < 100; i++) {
  data.push({ id: i, value: Math.random() });
}
let transformed = data.map((item) => ({ ...item, value: item.value * 2 }));
window.console.log(`Transformed ${transformed.length} items`);
// Padding to ~40KB
for (let i = 0; i < 40000; i++) {
  /* padding */
}
