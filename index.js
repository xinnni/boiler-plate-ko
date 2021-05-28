const express = require('express');
const app = express();
const port = 5500;
const { User } = require('./models/User');
const config = require('./config/key')
// const bodyParser = require('body-parser')
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('success!'))
  .catch(error => console.log(error))
app.use(express.urlencoded({extended: true}));
app.use(express.json());

  // app.get('/', (req, res) => {
  //   res.send('하이룽삼')
  // })


app.post('/register', (req, res) => {
  // 클라이언트에서 보내 주는 이름과 이메일, 패스워드, 회원가입 때 필요한 정보들을 
  // 데이터 베이스에 넣어 준다.
  const user = new User(req.body)
  // json 형식으로 들어옴
  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })
  // 몽고에서 주는 메서드: 정보들이 유저 모델에 저장이 된다.
})




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}!`)
})