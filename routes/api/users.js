const express = require('express');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const User = require('../../models/User');
const keys = require('../../config/keys');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');