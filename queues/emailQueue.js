const Queue = require('bull');
const mailQueue = new Queue('mailQueue', 'redis://127.0.0.1:6379');  // Adjust Redis URL if needed

const addEmailToQueue = (email, subject, htmlTemplate) => {
    mailQueue.add({
        to: email,
        subject: subject,
        html: htmlTemplate,
    });
};

module.exports = addEmailToQueue