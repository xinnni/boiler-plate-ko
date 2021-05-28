const mongoose = require('mongoose');

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

const User = mongoose.model('user', userSchema)

module.exports = { User }