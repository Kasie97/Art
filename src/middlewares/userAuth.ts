import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import { UserInstance } from '../model/userModel';

const jwtsecret = process.env.JWT_SECRET as string

export async function userAuth(req:Request | any, res:Response, next: NextFunction){

    // const authorization = req.headers.authorization

    // if (!authorization){
    //     return res.render('Login',{error: 'Kindly login or sign up'})
    // }

    // const token = authorization.slice(7, authorization.length);

    const {token} = req.cookies

    if(!token){
        return res.redirect('/login');
    }

    let verified = jwt.verify(token, jwtsecret)

    if (!verified){
        return res.status(401).json({error: 'Invalid token. You cannot access this route'})
    }

    const {id} = verified as {[key : string]: string}

    //Check if the user exist

    const user = await UserInstance.findOne({where: {id}})

    if(!user){
        return res.status(401).json({error: 'Kindly sign-up as a user'})
    }

    console.log(req.user)

    req.user = verified
    next()
}