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
function generateTelegramMessage(
    viewUrl,
    children,
    parentName,
    dateRange,
    tutorName
) {
    let childrenText

    if (!children || children.length === 0) {
        childrenText = "child's"
    } else if (children.length === 1) {
        childrenText = `${children[0]}'s`
    } else if (children.length === 2) {
        childrenText = `${children[0]} and ${children[1]}’s`
    } else {
        const lastChild = children.pop() // Get the last child
        childrenText = `${children.join(', ')}, and ${lastChild}’s`
    }

    return `
👨‍🏫 *Dear ${parentName},*  

${childrenText} progress report for the ${dateRange} GC, prepared by Tutor ${tutorName}, is now available. 📖✨  

Please click the link below to review the report:  
[View Report](${viewUrl})  

We encourage you to look over this information to see how your ${
        children.length > 1 ? 'children are' : 'child is'
    }  doing.  

Thank you for investing in your ${
        children.length > 1 ? 'children’s' : 'child’s'
    } future through our tutoring services.  

Best regards,  
The Tutoring Team  
`
}

module.exports = { sendTelegramNotification, generateTelegramMessage }
