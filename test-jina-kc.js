const url = "https://kimberlyclark.wd1.myworkdayjobs.com/es/GLOBAL/job/Colombia--Bogota/Lder-de-Ejecucin-Retail_883672?source=linkedin";
const start = Date.now();
fetch(`https://r.jina.ai/${encodeURIComponent(url)}`)
  .then(res => res.text())
  .then(text => {
    console.log("Time:", Date.now() - start);
    console.log("Length:", text.length);
    console.log("Preview:", text.substring(0, 500));
  })
  .catch(err => console.error(err));
