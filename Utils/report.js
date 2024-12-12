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

module.exports = { sendTelegramNotification }
