const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
// const token = jwt.sign({ foo: 'bar' }, 'shhhhh');



// 모델은 무엇인가
// 스키마를 감싸 주는 역할을 한다.

// 스키마란?
// 어떤 상품에 관련된 글을 작성한다고 치자.
// 글을 작성한 사람이 누구인지를 써야 한다.
// 작성하 때 포스트의 이름이 무엇인지, 상품에 관한 평, 타입은 무엇인지,
// 하나하나 지정해 주는 것이 스키마를 통해 가능하다.
// 스키마는 하나하나의 정보들을 지정해 줄 수 있는 것.


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 스페이스 없애 주는 역할
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function( next ) {

    let user = this;
     // 비밀번호를 암호화 시킨다. 
    // 암호화 시키기 위해 ..

    if(user.isModified('password')) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err) return next(err)
    
            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err) return next(err)
                user.password = hash;
                next();
            })
        })
    } else {
        next()
    }
})
// 유저 모델에 유저 정보를 저장하기 전에, 무엇을 한다는 뜻.

userSchema.methods.comparePassword = function(plainPassword, callback) {
    // 비밀번호를 비교할 때 플레인 패스워드가 있다면 데이터 베이스에 있는 암호화된 비밀번호가 같은지 체크를 해야 하는데,
    // 들어오는 비밀번호도 암호화를 해야 한다;; 
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return callback(err),
        callback(null, isMatch)
    })
}

 userSchema.methods.generateToken = function(callback) {
     // 웹토큰을 이용해서 토큰을 생성해야 한다.
     let user = this;
     let token = jwt.sign(user._id.toString(), 'secretToken')

    // user._id + 'secretToken' = token

    user.token = token
    user.save(function(err, user) {
        if(err) return callback(err)
        callback(null, user)
    })
 }

const User = mongoose.model('User', userSchema)

module.exports = { User }