const nodemailer=require('../config/nodemailer');


exports.newComment=(comment)=>{
console.log('inside comment mailer');
let htmlString=nodemailer.renderTemplate({comment:comment},'/comment.ejs');
nodemailer.transporter.sendMail({
    from:'ruchirnakra28@gmail.com',
    to:comment.user.email,
    subject:'New Comment Pubished',
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