var cron = require('node-cron');
const sendPdf = require('./services/sendPdf');

cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
    sendPdf();
});