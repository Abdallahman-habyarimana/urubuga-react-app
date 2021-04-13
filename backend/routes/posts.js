const express = require("express");
const bcrypt = require('bcrypt')
const router = express.Router();
const Post = require('../models/Post')

module.exports = router