const nodemailer=require('../config/nodemailer');


exports.resetPassMail=(resetPassToken)=>{
console.log('inside comment mailer');
let htmlString=nodemailer.renderTemplate({resetPassToken},'/resetpass.ejs');
nodemailer.transporter.sendMail({
    from:'ruchirnakra28@gmail.com',
    to:resetPassToken.user.email,
    subject:'Request for PassWord Reset',
    html:htmlString
},(err,info)=>{
    if(err)
    {
        console.log('error in sending mail',err);
    }
    console.log('MAIL DELIVERED',info);
    return;
})


}