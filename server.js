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

app.post('/merge', upload.array('pdfs', 2), async (req, res, next) => {
    console.log(req.files);
    let d = await mergePdfs(
    path.join(__dirname, req.files[0].path),
    path.join(__dirname, req.files[1].path)
    );
    res.redirect(`http://localhost:3000/static/${d}.pdf`)
})

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`)
})