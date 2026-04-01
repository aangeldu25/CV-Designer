import fs from 'fs';

async function test() {
  const url = 'https://kimberlyclark.wd1.myworkdayjobs.com/es/GLOBAL/job/Colombia--Bogota/Lder-de-Ejecucin-Retail_883672?source=linkedin';
  const res = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`);
  const scrapedText = await res.text();
  
  let finalJobDescription = scrapedText;
  
  const startSnippet = "This string does not exist in the text at all and has many words";
  const endSnippet = "Another string that does not exist in the text at all and has many words";
  
  const buildRegex = (snippet) => {
    const words = snippet.replace(/[*#_[\]()>-]/g, '').trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return null;
    const regexStr = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\s*#_\\[\\]()>-]+');
    console.log('Regex:', regexStr);
    return new RegExp(regexStr, 'i');
  };

  const startRegex = buildRegex(startSnippet);
  console.log('Start match time...');
  const t1 = Date.now();
  const startMatch = finalJobDescription.match(startRegex);
  console.log('Start match done in', Date.now() - t1, 'ms');
  
  if (startMatch && startMatch.index !== undefined) {
    finalJobDescription = finalJobDescription.substring(startMatch.index);
  }
  
  const endRegex = buildRegex(endSnippet);
  console.log('End match time...');
  const t2 = Date.now();
  const endMatch = finalJobDescription.match(endRegex);
  console.log('End match done in', Date.now() - t2, 'ms');
  
  if (endMatch && endMatch.index !== undefined) {
    finalJobDescription = finalJobDescription.substring(0, endMatch.index + endMatch[0].length);
  }
  
  console.log('Cleanup time...');
  const t3 = Date.now();
  finalJobDescription = finalJobDescription.replace(/!\[.*?\]\([^)]*\)/g, '');
  finalJobDescription = finalJobDescription.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  finalJobDescription = finalJobDescription.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  finalJobDescription = finalJobDescription.replace(/\[\]/g, '');
  console.log('Cleanup done in', Date.now() - t3, 'ms');
}

test();
