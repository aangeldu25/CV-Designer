const text = "![" + "a".repeat(50000) + "](url)";
const start = Date.now();
let res = text.replace(/!\[.*?\]\([^)]*\)/g, '');
console.log("Time 1:", Date.now() - start);

const text2 = "![" + "a".repeat(50000) + " no closing bracket";
const start2 = Date.now();
let res2 = text2.replace(/!\[.*?\]\([^)]*\)/g, '');
console.log("Time 2:", Date.now() - start2);
