const nodemailer=require('nodemailer');
const ejs=require('ejs');
const path=require('path');

let transporter=nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:'587',
    secure:false,
    auth:{
        user:'email',
        pass:"123456"
    }
})

let renderTemplate=(data,relativepath)=>{
    let mailHTML;
    ejs.renderFile(path.join(__dirname,'../Views/mailers',relativepath),
    data,
    (err,template)=>{
        if(err){console.log('error in rendering tewmplate -nodemailer.js');return;}
        mailHTML=template;
    }
    );
    return mailHTML;
}

module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
}
