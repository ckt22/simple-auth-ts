// For simplicity, I am putting all apis here.

import express from "express";
import { LocalStragegy } from "passport-local";
import { User } from "../database/entities/user.entity";

const apisRouter = express.Router();

apisRouter.get('/health', function (req, res, next) {
    res.status(200).send('ok');
});

apisRouter.post('/signup/local', async function (req, res, next) {
    const {
        email,
        password,
        confirmPassword
    } = req.body;

    // validation
    const user = new User();

});

apisRouter.post('/signup/facebook');

apisRouter.post('/signup/google', function (req, res, next) {

})

export default apisRouter;