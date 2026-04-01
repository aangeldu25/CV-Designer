import fs from 'fs';

async function test() {
  const url = 'https://kimberlyclark.wd1.myworkdayjobs.com/es/GLOBAL/job/Colombia--Bogota/Lder-de-Ejecucin-Retail_883672?source=linkedin';
  const res = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`);
  const text = await res.text();
  console.log('Length:', text.length);
  console.log('First 500 chars:', text.substring(0, 500));
  console.log('Last 500 chars:', text.substring(text.length - 500));
}

test();
