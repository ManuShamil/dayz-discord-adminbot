const express = require('express')
const morgan = require('morgan')
const app = express()

const PORT = process.env.APP_PORT || 80

const { 
    CFToolsClientBuilder, 
    SteamId64,
    Banlist
} = require('cftools-sdk')

const cftools = new CFToolsClientBuilder()
    .withServerApiId( process.env.CFTOOLS_SERVERID )
    .withCredentials( process.env.CFTOOLS_APP_ID, process.env.CFTOOLS_SECRET )
    .build();

app.use( morgan('dev') )
app.use( express.json() )

const getDateFromNow = ( minutes ) => {
    if ( minutes == undefined ) return 'Permanent'

    let timeNow = (new Date()).getTime()
    let newExpiryTime = new Date( timeNow + ( 60 * minutes * 1000 ) ) 

    return newExpiryTime
}

app.post('/api/cftools/whitelist', async ( req, res, next ) => {

    try {
        let steamUID        = req.body.steamUID;
        let comment         = req.body.comment;
        let expiryIn        = req.body.expiryIn; //! Minutes

        if ( steamUID == undefined || comment == undefined )
            throw new Error(`BODY PARSE ERROR`)
        
        await cftools.putWhitelist({
            id: SteamId64.of( steamUID ),
            expires: getDateFromNow( expiryIn ),
            comment: comment
        })

        res.json({
            status: 200,
            message: `success`
        })



    } catch (error) {
        console.log(`POST: /api/cftools/whitelist [BODY PARSE ERROR]`)

        res.status(400).json( {
            status: 400,
            message: `error`
        })
    }


})

app.delete('/api/cftools/whitelist', async ( req, res, next ) => {

    try {
        let steamUID        = req.body.steamUID;

        if ( steamUID == undefined )
            throw new Error(`BODY PARSE ERROR`)

        await cftools.deleteWhitelist( SteamId64.of( steamUID ) )

        res.json({
            status: 200,
            message: `success`
        })

    } catch (error) {
        console.log(`DELETE: /api/cftools/whitelist [BODY PARSE ERROR]`)


        res.status(400).json( {
            status: 400,
            message: `could not parse body`
        })
    }


})

app.post('/api/cftools/ban', async ( req, res, next ) => {


    if ( process.env.CFTOOLS_BANLIST_ID == undefined || process.env.CFTOOLS_BANLIST_ID == "undefined")
    {
        res.status( 400 ).json(
            {
                status: 400,
                message: `CFTOOLS_BANLIST_ID undefined`
            }
        )

        return
    }


    try {
        let steamUID        = req.body.steamUID;
        let reason          = req.body.reason;
        let expiryIn        = req.body.expiryIn; //! Minutes

        if ( steamUID == undefined || reason == undefined )
            throw new Error(`BODY PARSE ERROR`)


        await cftools.putBan({
            playerId: SteamId64.of( steamUID ),
            list: Banlist.of(process.env.CFTOOLS_BANLIST_ID || ''),
            expiration: getDateFromNow( expiryIn ),
            reason: reason
        })

        res.json({
            status: 200,
            message: `success`
        })



    } catch (error) {
        console.log(`POST: /api/cftools/ban [BODY PARSE ERROR]`)

        res.status(400).json( {
            status: 400,
            message: `error`
        })
    }


})

app.delete('/api/cftools/ban', async ( req, res, next ) => {


    if ( process.env.CFTOOLS_BANLIST_ID == undefined || process.env.CFTOOLS_BANLIST_ID == "undefined")
    {
        res.status( 400 ).json(
            {
                status: 400,
                message: `CFTOOLS_BANLIST_ID undefined`
            }
        )

        return
    }


    try {
        let steamUID        = req.body.steamUID;

        if ( steamUID == undefined )
            throw new Error(`BODY PARSE ERROR`)


        await cftools.deleteBan({
            playerId: SteamId64.of( steamUID ),
            list: Banlist.of(process.env.CFTOOLS_BANLIST_ID || '')
        })

        res.json({
            status: 200,
            message: `success`
        })



    } catch (error) {
        console.log(`DELETE: /api/cftools/ban [BODY PARSE ERROR]`)

        res.status(400).json( {
            status: 400,
            message: `error`
        })
    }


})





app.get(`/api/cftools`, ( req, res, next ) => {
    
    res.json({
        message: `CFtools Interface API`
    })

})


app.listen( PORT, () => console.log(`CFTools Interface server listening on PORT ${ PORT }`))