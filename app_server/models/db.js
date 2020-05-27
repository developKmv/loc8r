var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI = 'mongodb://172.17.0.2/loc8r';
mongoose.connect(dbURI);

mongoose.connection.on('connected',function(){
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',(err)=>{
    console.log('Connection error ' + err);
});

mongoose.connection.on('disconnected',()=>{
    console.log('Mongoose disconnected')
});

gracefulShutdown = (msg,callback)=>{
    mongoose.connection.close(()=>{
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

process.once('SIGUSR2',()=>{
    gracefulShutdown('nodemon restart',()=>{
        process.kill(process.pid,'SIGUSR2');
    });
});

process.on('SIGINT',()=>{
    gracefulShutdown('app termination',()=>{
        process.exit(0);
    });
});

process.on('SIGTERM',()=>{
    gracefulShutdown('Heroku app shutdown',()=>{
        process.exit(0);
    });
});

require('./locations');