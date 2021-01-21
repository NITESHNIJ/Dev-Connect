const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/Dev_Connect',{ useNewUrlParser: true ,useUnifiedTopology: true });

const db=mongoose.connection;

db.on('error',console.error.bind('Error Connecting to MongoDb'));

db.once('open',()=>{
    console.log('Connected to database');
});

module.exports=db;