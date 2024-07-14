const axios = require('axios');
const webhookUrl = 'https://hooks.slack.com/services/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'; // Replace with your webhook URL
function sendStockNews(news) {
    const {fullname, title, content, link} = news
    let text = ''
    if (fullname) {
        text += `*${fullname}*  `
    }
    if (title && link) {
        text += `*<${link}|${title || ''} >*`
    } else {
        text += `*${title || ''}*`
    }
    if (content) {
        text += ` \n\n${content || ''}`
    }
    const message = {
        text
    };
    axios.post(webhookUrl, message)
        .then(response => {
            console.log('Message posted successfully');
        })
        .catch(error => {
            console.error('Error posting message:', error);
        });
}

module.exports = sendStockNews;
