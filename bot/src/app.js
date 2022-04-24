const process = require('process')

const morgan    = require('morgan')
const express   = require('express')
const app       = express()

const PORT = process.env.APP_PORT || 80





app.use( morgan('dev') )

/**
 * rawBodyParser() -> Used to extract raw body from discord interactions for the purpose
 * of verification.
 * SRC:
 * https://stackoverflow.com/questions/18710225/node-js-get-raw-request-body-using-express#answer-35651853
 */
const rawBodyParser = (req, res, buf, encoding) => {
    if (buf && buf.length)
        req.rawBody = buf.toString(encoding || 'utf8')
}

app.use( express.json( {
    verify: rawBodyParser
}))


app.use('/api/interactions', require('./api/interactions'))
app.use('/api/commands', require('./api/commands'))

app.get("/api/interactions", ( req, res, next ) => res.json({ message: `Hello from Bot` }))


app.listen( PORT, () => {
    console.log(`App Listening on PORT ${PORT}`)
})