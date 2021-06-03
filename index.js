const express = require('express');
const app = express();
const port = 5500;
const { User } = require('./models/User');
const { auth } = require('./middleware/auth')
const config = require('./config/key')
// const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('success!'))
  .catch(error => console.log(error))
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

  // app.get('/', (req, res) => {
  //   res.send('하이룽삼')
  // })


app.post('/api/users/register', (req, res) => {
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
app.post('/login', (req, res) => {

  // 요청된 이메일을 데이터 베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
  user.comparePassword(req.body.password, (err, isMatch) => {
    if(!isMatch)
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

   user.generateToken((err, user) => {
      if(err) return res.status(400).send(err);

      // 토큰을 저장한다. 어디에?? 쿠키, 로컬 스토리지, 등등 
      res.cookie("x_auth", user.token)
      .status(200)
      .json({ loginSuccess: true, userId: user._Id })
   })
  })
  })
})

// 요청한 이메일이 있다면 비밀번호가 같은지 확인해야 한다.

// 비밀번호가 맞다면 토큰(??)을 생성해야 한다. 

// 토큰이란..? 
app.get('/api/users/auth', auth, (req, res) => {
  // 미들웨어란 콜백 하기 전에 중간 역할을 해 주는 것인데..

  // 미들웨어 통과 => 
  res.status(200).json({
    _id: req.user._Id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })

})

app.get('/api/users/logout', auth, (req, res) => {

  User.findOneAndUpdate({ _id: req.user._id }, 
  { token: "" },
  (err, user) => {
    if(err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}!`)
})