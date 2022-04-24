const PERMISSIONS_OVERRIDE = {
    permissions: [
        {
            "id": process.env.DISCORD_MODERATOR_ROLE || '',
            "type": 1,
            "permission": true
        }
    ]
}

const COMMANDS_FORMAT = {
    putwhitelist: {
        name: "putwhitelist",
        type: 1,
        description: "Add a player to CFTools Whitelist",
        default_permission: false,
        options: [
            {
                "name": "steamid64",
                "description": "SteamID64 of the player",
                "type": 3,
                "required": true
            },
            {
                "name": "comment",
                "description": "Note for player in the whitelist entry",
                "type": 3,
                "required": true
            },
            {
                "name": "expiry",
                "description": "Amount of time in minutes to whitelist the player for.",
                "type": 3,
                "required": false
            }
        ]
    },
    deletewhitelist: {      
        name: "deletewhitelist",
        type: 1,
        description: "Delete a player from CFTools Whitelist",
        default_permission: false,
        options: [
            {
                "name": "steamid64",
                "description": "SteamID64 of the player",
                "type": 3,
                "required": true
            }
        ]
    },
    putban: {
        name: "putban",
        type: 1,
        description: "Ban a player",
        default_permission: false,
        options: [
            {
                "name": "steamid64",
                "description": "SteamID64 of the player",
                "type": 3,
                "required": true
            },
            {
                "name": "reason",
                "description": "Reason for ban",
                "type": 3,
                "required": true
            },
            {
                "name": "expiry",
                "description": "Amount of time in minutes to ban the player for.",
                "type": 3,
                "required": false
            }
        ]
    },
    deleteban: {
        name: "deleteban",
        type: 1,
        description: "Unban player",
        default_permission: false,
        options: [
            {
                "name": "steamid64",
                "description": "SteamID64 of the player",
                "type": 3,
                "required": true
            }
        ]
    }
}

const HEADERS = {
    "Content-Type": `application/json`,
    "Authorization": `Bot ${process.env.BOT_TOKEN}`
}

const axios = require('axios').default

module.exports = {
    registerCommands: async (guildId) => {

        const POST_URL = `https://discord.com/api/v8/applications/${process.env.DISCORD_APP_ID}/guilds/${guildId}/commands`
        const getPatchURL = (commandId) => `https://discord.com/api/v8/applications/${process.env.DISCORD_APP_ID}/guilds/${guildId}/commands/${commandId}/permissions`


        for ( let [ commandName, commandFormat ] of Object.entries( COMMANDS_FORMAT )) {
            
            console.log(`REGISTERING COMMAND => "${commandName}"`)
            
            let { data } = await axios.post( POST_URL, commandFormat, {
                headers: HEADERS
            })

            let commandId = data.id

            await axios.put( getPatchURL(commandId), PERMISSIONS_OVERRIDE, {
                headers: HEADERS
            })

        }



    }
}