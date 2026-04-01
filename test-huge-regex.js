const words = Array(10000).fill('word').join(' ');
const buildRegex = (snippet) => {
  const w = snippet.replace(/[*#_[\]()>-]/g, '').trim().split(/\s+/).filter((w) => w.length > 0);
  if (w.length === 0) return null;
  const regexStr = w.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\s*#_\\[\\]()>-]+');
  return new RegExp(regexStr, 'i');
};

console.time('buildRegex');
try {
  const regex = buildRegex(words);
  console.timeEnd('buildRegex');
  
  console.time('match');
  'word '.repeat(10000).match(regex);
  console.timeEnd('match');
} catch (e) {
  console.error(e);
}
