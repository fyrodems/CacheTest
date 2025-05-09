// Manipulacja DOM
for (let i = 0; i < 10; i++) {
  const el = document.createElement("div");
  el.textContent = `Element ${i}`;
  document.body.appendChild(el);
  el.textContent = "";
  document.body.appendChild(el);
}
console.log("Created 10 elements");
// Padding to ~25KB
let pad = "";
for (let i = 0; i < 25000; i++) {
  pad += "x";
}
