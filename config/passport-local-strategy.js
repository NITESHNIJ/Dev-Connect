const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;


const User=require('../models/user');

//usernamefiled in schema is email
passport.use(new LocalStrategy({
    usernameField:'email',
},(email,password,done)=>{
    User.findOne({email:email},(err,user)=>{
        if(err)
        {
            console.log('error in finding user=>passport');
            return done(err);
        }
        if(!user || user.password!==password)
        {
            console.log('Invalid Pass');
            return done(null,false);
        }
        //this will return to serializeUser fn 
        return done(null,user);
    })
}));
//serializing the user to decide which key is kept in cookie
passport.serializeUser((user,done)=>{
done(null,user.id);
});

//getting the user from keys in cookie
//used by passport.authenticate fn to set up user in request
passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        if(err)
        {
            console.log('error in finding user=>passport');
            return done(err);
        }
        return done(null,user);
    });
})

//check if user is authenticated
passport.checkAuthentication=(req,res,next)=>{
    //this method is put by passport
    if(req.isAuthenticated())
    {
        next();
        return;
    }
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser=(req,res,next)=>{
    if(req.isAuthenticated())
    {
        //req.user is set up by passport.authenticate

        //res.locals An object that contains response local variables scoped to the request, 
        //and therefore available only to the view(s) rendered during that request / response cycle (if any).
        res.locals.user=req.user;
    }
    next();
}

module.exports=passport;