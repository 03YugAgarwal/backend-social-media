const bodyParser = require('body-parser');
var express = require('express')
var mongoConnect = require('./db')

mongoConnect();

var app = express()
var port = 9000
app.use(bodyParser.json())

app.use('/api/auth',require('./routes/auth'))

app.listen(port,()=>{
    console.log(`backend server has started at http://localhost:${port}`);
})