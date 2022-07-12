var mongoose = require('mongoose')
var mongoURL = 'mongodb://localhost:27017/socialMedia'

const mongoConnect = ()=>{
    mongoose.connect(mongoURL,()=>{
        console.log('Connected to database');
    });
}

module.exports = mongoConnect;