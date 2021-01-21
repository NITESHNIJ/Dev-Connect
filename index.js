const express=require('express');
const path=require('path');
//used for session cookie
const session=require('express-session');
const passport=require('passport');
const cookieparser=require('cookie-parser');
const passportLocal=require('./config/passport-local-strategy');
const expressLayouts=require('express-ejs-layouts');
const MongoStore=require('connect-mongo')(session);
const db=require('./config/mongoose');
const flash=require('connect-flash');
const { setflash } = require('./config/middleware');



const port=8000;

const app=express();

const chatServer=require('http').Server(app);
const chatSockets=require('./config/chat_sockets').chatSockets(chatServer);

chatServer.listen(5000);



app.use(express.urlencoded());

app.use(cookieparser());

app.set('view engine','ejs');

app.set('views',path.join(__dirname,'Views'));

app.use(express.static('./assets'));
//makes upload path avaulable to browser
app.use('/uploads',express.static(__dirname+'/uploads'));

app.use(expressLayouts);
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


app.use(session({
    name:'dev-connect',
    secret:'bjahsa',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store:new MongoStore({
        mongooseConnection:db,
        autoRemove:'disabled'
    },(err)=>console.log(err || 'connect-mongodb setup ok'))
    
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(setflash);

app.use(passport.setAuthenticatedUser);

app.use('/',require('./routes/index'));



app.listen(port,(err)=>{
    if(err)
    {
        console.log('Error in running the server');
    }
    console.log('Express server is up and running on port 8000');
})