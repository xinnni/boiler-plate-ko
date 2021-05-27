const express = require('express')
const app = express()
const port = 5500
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://xinnni:xhavpfxms0105@boilerplate.qzgbs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('success!'))
  .catch(error => console.log(error))


app.get('/', (req, res) => {
  res.send('하이룽삼')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}!`)
})