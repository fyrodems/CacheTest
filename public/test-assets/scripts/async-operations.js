// Operacje asynchroniczne
async function runAsyncOps() {
  let completed = 0;
  for (let i = 0; i < 5; i++) {
    await new Promise((res) => setTimeout(res, 10));
    completed++;
  }
  console.log(`Completed ${completed} async operations`);
}
runAsyncOps();
// Padding to ~30KB
let pad = "";
for (let i = 0; i < 30000; i++) {
  pad += "x";
}
