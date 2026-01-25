/**
 * Error Notification Service
 * Sends critical errors to Discord/Slack webhooks
 */

/**
 * Send error notification to configured webhook
 * @param {Error} error - The error object
 * @param {Object} context - Additional context (req, user, etc)
 */
async function notifyError(error, context = {}) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn('No webhook URL configured for error notifications');
        return;
    }

    const isDiscord = webhookUrl.includes('discord.com');
    const isSlack = webhookUrl.includes('slack.com');

    const payload = isDiscord
        ? buildDiscordPayload(error, context)
        : buildSlackPayload(error, context);

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error('Failed to send error notification:', response.status);
        }
    } catch (fetchError) {
        console.error('Error notification failed:', fetchError.message);
    }
}

function buildDiscordPayload(error, context) {
    return {
        embeds: [{
            title: '🚨 FoodTrend API Error',
            color: 0xEB1700, // Brand red
            fields: [
                {
                    name: 'Error',
                    value: `\`\`\`${error.message}\`\`\``,
                    inline: false
                },
                {
                    name: 'Stack',
                    value: `\`\`\`${(error.stack || 'No stack trace').slice(0, 500)}\`\`\``,
                    inline: false
                },
                {
                    name: 'Endpoint',
                    value: context.endpoint || 'Unknown',
                    inline: true
                },
                {
                    name: 'Method',
                    value: context.method || 'Unknown',
                    inline: true
                },
                {
                    name: 'IP',
                    value: context.ip || 'Unknown',
                    inline: true
                }
            ],
            timestamp: new Date().toISOString()
        }]
    };
}

function buildSlackPayload(error, context) {
    return {
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: '🚨 FoodTrend API Error'
                }
            },
            {
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*Error:*\n\`${error.message}\``
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Endpoint:*\n${context.endpoint || 'Unknown'}`
                    }
                ]
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `\`\`\`${(error.stack || 'No stack trace').slice(0, 500)}\`\`\``
                }
            }
        ]
    };
}

module.exports = { notifyError };
