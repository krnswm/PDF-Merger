const PDFMerger = require('pdf-merger-js').default; 
const path = require('path');
const fs = require('fs')

async function mergePdfs(pdfPaths) {
  const merger = new PDFMerger();

  for(let p of pdfPaths) {
    await merger.add(p);
  }

  let d = Date.now();
  await merger.save(`public/${d}.pdf`);

  for (let p of pdfPaths) {
    fs.unlink(p, (err) => {
      if(err){
        console.log(`Error deleting File ${p}: `, err);
      } else {
        console.log(`Deleted uploaded File: ${p}`);
      }
    })
  }

  return d;
}

module.exports = { mergePdfs };
