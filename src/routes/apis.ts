// For simplicity, I am putting all apis here.
// Which should have been put in controllers

import express from "express";
import { LocalStragegy } from "passport-local";
import { User } from "../database/entities/user.entity";
import * as userService from "../services/user.service";

const apisRouter = express.Router();

apisRouter.get('/health', function (req, res, next) {
    res.status(200).send('ok');
});

apisRouter.get('/error', function(req, res, next) {
    throw new Error('always throw');
});

apisRouter.post('/signup/local', async function (req, res, next) {
    const {
        email,
        password,
        confirmPassword
    } = req.body;

    // check for existing users
    const existingUser = await User.findOne({
        where: { email }
    });
    if (existingUser) {
        throw new Error('user already registered');
    };

    // validation
    const isValid = userService.validateSignup(email, password, confirmPassword);
    const user = new User();

});

apisRouter.post('/signup/facebook');

apisRouter.post('/signup/google', function (req, res, next) {

});

export default apisRouter;