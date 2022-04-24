const express = require('express')
const router = express.Router()

const axios = require('axios').default

router.get('/', async (req, res, next ) => {

    const getURL = (guildId) => `https://discord.com/api/v8/applications/${process.env.DISCORD_APP_ID}/guilds/${guildId}/commands`

    let guildId = req.body.guildId

    if ( guildId == undefined )
    {
        res.status(400).json({
            status: 400,
            message: `Bad request`
        })
        return
    }

    let { data } = await axios.get( getURL( guildId ), {
        headers: {
            Authorization: `Bot ${process.env.BOT_TOKEN}`
        }
    })


    res.json({
        status: 200,
        result: data
    })

})

router.post('/register', async (req, res, next ) => {

    let guildId = req.body.guildId

    if ( guildId == undefined )
    {
        res.status(400).json({
            status: 400,
            message: `Bad request`
        })
        return
    }

    await require('./register').registerCommands( guildId )

    res.json({
        status: 200
    })

})


module.exports = router