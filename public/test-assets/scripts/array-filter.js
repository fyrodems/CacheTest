// Filtrowanie tablicy
let arr = [];
for (let i = 1; i <= 10000; i++) {
  arr.push(i);
}
let even = arr.filter((x) => x % 2 === 0 && x <= 10);
console.log(JSON.stringify(even)); // [2,4,6,8,10]
// Padding to ~15KB
