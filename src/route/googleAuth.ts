import express, { Request,Response,NextFunction } from 'express';
import session from 'express-session';
import passport from 'passport';
import { googleLog } from '../controller/UserLogin';

const router = express.Router()

router.get('/auth', (req: Request, res: Response)=>{
      console.log("Hello")
      res.send('<a href="/google">Sign in with google</a>')
    })


router.get('/',passport.authenticate('google', {
    scope:['email', 'profile']
}
));

router.get(
    '/callback',
    passport.authenticate('google', {
      failureRedirect: '/google/failed',
      successRedirect: 'https://elegance-art-gallery.vercel.app/dashboard'
    })
  );

router.get("/failed", (req:Request, res:Response) => {
    res.send("Failed")
});


router.get("/success", googleLog)

export default router