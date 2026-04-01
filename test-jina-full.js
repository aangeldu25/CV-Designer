const url = "https://kimberlyclark.wd1.myworkdayjobs.com/es/GLOBAL/job/Colombia--Bogota/Lder-de-Ejecucin-Retail_883672?source=linkedin";
fetch(`https://r.jina.ai/${encodeURIComponent(url)}`)
  .then(res => res.text())
  .then(text => {
    console.log("Length:", text.length);
    let finalJobDescription = text;
    
    const start1 = Date.now();
    finalJobDescription = finalJobDescription.replace(/!\[.*?\]\([^)]*\)/g, '');
    console.log("Time 1:", Date.now() - start1);
    
    const start2 = Date.now();
    finalJobDescription = finalJobDescription.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
    console.log("Time 2:", Date.now() - start2);
    
    const start3 = Date.now();
    finalJobDescription = finalJobDescription.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
    console.log("Time 3:", Date.now() - start3);
    
    const start4 = Date.now();
    finalJobDescription = finalJobDescription.replace(/\[\]/g, '');
    console.log("Time 4:", Date.now() - start4);
    
    const start5 = Date.now();
    finalJobDescription = finalJobDescription.replace(/\n{3,}/g, '\n\n').trim();
    console.log("Time 5:", Date.now() - start5);
  })
  .catch(err => console.error(err));
