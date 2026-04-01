import fs from 'fs';

async function test() {
  const url = 'https://kimberlyclark.wd1.myworkdayjobs.com/es/GLOBAL/job/Colombia--Bogota/Lder-de-Ejecucin-Retail_883672?source=linkedin';
  const t1 = Date.now();
  console.log('Fetching Jina...');
  const res = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`);
  const text = await res.text();
  console.log('Jina took:', Date.now() - t1, 'ms');
  console.log('Length:', text.length);
}

test();
