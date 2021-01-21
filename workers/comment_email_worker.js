const queue=require('../config/Kue');
const comment_mailer=require('../mailers/comment_mailer');

queue.process('emails',(job,done)=>{
console.log('email worker is preocessing a job',job.data);

comment_mailer.newComment(job.data);

done();

})