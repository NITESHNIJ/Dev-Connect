const Kue=require('kue');

const queue=Kue.createQueue();

module.exports=queue;