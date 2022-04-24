const express = require('express')
const router = express.Router()

const axios = require('axios').default

/**
 * Authenticate request before proceeding further.
 */
router.use( require('./auth') )

const HEADERS = {
    "Content-Type": `application/json`
}

const handleInteractions = {

    putwhitelist: async ( optionsMap ) => {

        let steamUID    = optionsMap["steamid64"].value
        let comment     = optionsMap["comment"].value
        let expiryIn    = optionsMap["expiry"]?.value


        try {
            let result = await axios.post(`http://cftools/api/cftools/whitelist`, {
                steamUID,
                expiryIn,
                comment
            })
            if (result.status == 200 ) return `Added ${steamUID} to whitelist`
        
        } catch (error) {

            return error.response.data.message
        }

    },
    deletewhitelist: async (optionsMap ) => {

        let steamUID    = optionsMap["steamid64"].value
        try {
            let result = await axios.delete(`http://cftools/api/cftools/whitelist`, {
                headers: HEADERS,
                data: { 
                    steamUID
                }
            })

            if (result.status == 200 ) return `Removed ${steamUID} from whitelist`
        
        } catch (error) {

            return error.response.data.message
        }
    },
    putban: async ( optionsMap ) => {
        let steamUID    = optionsMap["steamid64"].value
        let reason     = optionsMap["reason"].value
        let expiryIn    = optionsMap["expiry"]?.value


        try {
            let result = await axios.post(`http://cftools/api/cftools/ban`, {
                steamUID,
                expiryIn,
                reason
            })
            if (result.status == 200 ) return `Banned ${steamUID}`
        
        } catch (error) {

            return error.response.data.message
        }
    },
    deleteban: async ( optionsMap ) => {
        let steamUID    = optionsMap["steamid64"].value

        try {
            let result = await axios.delete(`http://cftools/api/cftools/ban`, {
                headers: HEADERS,
                data: { 
                    steamUID
                }
            })
            if (result.status == 200 ) return `Removed ${steamUID} from whitelist`
        
        } catch (error) {

            return error.response.data.message
        }
    }

}

router.post('/', async ( req, res, next) => {

    let requestType = req.body.type

    
    /**
     * PING ACK
     */
    if ( requestType == 1 )
    {
        res.json({
            type: 1
        })

        return
    }

    let { data } = req.body;
    let interactionName = data.name


    if ( !interactionName in Object.keys( handleInteractions ) )
    {
        res.status(400).json({
            status: 400
        })
        return
    }

    let { options } = data
    let optionsMap = {}

    options.forEach( option => {
        optionsMap[ option.name ] = option
    });
    
    let result = await handleInteractions[ interactionName ]( optionsMap )

    res.json( {
        type: 4,
        data: {
            content: result
        }
    } )

})

module.exports = router