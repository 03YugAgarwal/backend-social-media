require('dotenv').config()

var mongoose = require('mongoose')
var User = requier('../models/User.js')
var express = require('express');
var router = express.Router();
var { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var JWT_SECRET = process.env.JWT_SECRET