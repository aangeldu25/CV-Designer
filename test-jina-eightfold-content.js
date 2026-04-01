const url = "https://mercadolibre.eightfold.ai/careers?query=114571&start=0&pid=40473759&sort_by=relevance";
fetch(`https://r.jina.ai/${encodeURIComponent(url)}`)
  .then(res => res.text())
  .then(text => {
    console.log("Length:", text.length);
    console.log("First 15000 chars:\n", text.substring(0, 15000));
  })
  .catch(err => console.error(err));
