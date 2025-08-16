const express = require('express')
const path = require('path')
const app = express()
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const { mergePdfs } = require('./merge')
const port = 3000

app.use('/static', express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/index.html'))
})

app.post('/merge', upload.array('pdfs'), async (req, res, next) => {
    if(!req.files || req.files.length < 2){
        return res.status(400).send("Please upload at least 2 PDF's.")
    }
    let d = await mergePdfs(req.files.map(
        file => path.join(__dirname, file.path))
    );
    res.json({ file: `/static/${d}.pdf` });

})

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`)
})