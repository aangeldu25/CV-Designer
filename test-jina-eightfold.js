const url = "https://mercadolibre.eightfold.ai/careers?query=114571&start=0&pid=40473759&sort_by=relevance";
const start = Date.now();
fetch(`https://r.jina.ai/${encodeURIComponent(url)}`)
  .then(res => {
    console.log("Status:", res.status);
    return res.text();
  })
  .then(text => {
    console.log("Time:", Date.now() - start);
    console.log("Length:", text.length);
    console.log("Preview:", text.substring(0, 1000));
  })
  .catch(err => console.error(err));
