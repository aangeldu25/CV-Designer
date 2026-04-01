import fs from 'fs';

async function test() {
  const url = 'https://kimberlyclark.wd1.myworkdayjobs.com/es/GLOBAL/job/Colombia--Bogota/Lder-de-Ejecucin-Retail_883672?source=linkedin';
  const res = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`);
  const scrapedText = await res.text();
  
  const data = {
    descriptionStartSnippet: "No eres la persona que se conformará",
    descriptionEndSnippet: "Tiempo completo"
  };

  let finalJobDescription = scrapedText;
  
  console.log('Starting regexes...');
  const startTime = Date.now();

  const buildRegex = (snippet) => {
    const words = snippet.replace(/[*#_[\]()>-]/g, '').trim().split(/\s+/).filter((w) => w.length > 0);
    if (words.length === 0) return null;
    const regexStr = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\s*#_\\[\\]()>-]+');
    return new RegExp(regexStr, 'i');
  };

  if (data.descriptionStartSnippet) {
    const startRegex = buildRegex(data.descriptionStartSnippet);
    if (startRegex) {
      const startMatch = finalJobDescription.match(startRegex);
      if (startMatch && startMatch.index !== undefined) {
        finalJobDescription = finalJobDescription.substring(startMatch.index);
      }
    }
  }

  if (data.descriptionEndSnippet) {
    const endRegex = buildRegex(data.descriptionEndSnippet);
    if (endRegex) {
      const endMatch = finalJobDescription.match(endRegex);
      if (endMatch && endMatch.index !== undefined) {
        finalJobDescription = finalJobDescription.substring(0, endMatch.index + endMatch[0].length);
      }
    }
  }

  console.log('Regexes finished in', Date.now() - startTime, 'ms');
  
  console.log('Starting markdown cleanup...');
  const mdStartTime = Date.now();
  
  finalJobDescription = finalJobDescription.replace(/!\[.*?\]\([^)]*\)/g, '');
  finalJobDescription = finalJobDescription.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  finalJobDescription = finalJobDescription.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  finalJobDescription = finalJobDescription.replace(/\[\]/g, '');
  
  console.log('Markdown cleanup finished in', Date.now() - mdStartTime, 'ms');
}

test();
