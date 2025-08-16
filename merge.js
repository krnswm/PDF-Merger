const PDFMerger = require('pdf-merger-js').default; 
const path = require('path');

async function mergePdfs(pdfPaths) {
  const merger = new PDFMerger();

  for(let p of pdfPaths) {
    await merger.add(p);
  }

  let d = Date.now();
  await merger.save(`public/${d}.pdf`);

  return d;
}

module.exports = { mergePdfs };
