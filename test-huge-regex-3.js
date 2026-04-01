const words = Array(99).fill('word').concat(['fail']).join(' ');
const buildRegex = (snippet) => {
  const w = snippet.replace(/[*#_[\]()>-]/g, '').trim().split(/\s+/).filter((w) => w.length > 0);
  if (w.length === 0) return null;
  const regexStr = w.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\s*#_\\[\\]()>-]+');
  return new RegExp(regexStr, 'i');
};

const regex = buildRegex(words);
const text = 'word '.repeat(10000);
const start = Date.now();
text.match(regex);
console.log("Time:", Date.now() - start);
