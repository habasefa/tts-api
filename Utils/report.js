// Send message to the parent using Telegram Bot API
async function sendTelegramNotification(parentTelegramId, message) {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`

    const data = {
        chat_id: parentTelegramId,
        text: message,
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })

        const result = await response.json()

        if (result.ok) {
            console.log('Notification sent:', result)
        } else {
            console.error('Failed to send notification:', result.description)
        }
    } catch (error) {
        console.error('Error sending notification:', error)
    }
}
function generateTelegramMessage(viewUrl) {
    return `
👨‍🏫 *Dear Parent,*  
Your child's latest progress report from their tutor is now available. 📖✨  

Click the link below to view the report:  
[View Report](${viewUrl})  

We encourage you to review the report to see how your child is doing and identify areas for growth.  

Thank you for your continued support in your child’s educational journey!  

Best regards,  
The Tutoring Team  
`
}

module.exports = { sendTelegramNotification, generateTelegramMessage }
