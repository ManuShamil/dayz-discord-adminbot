const nacl = require('tweetnacl')

module.exports = (req, res, next) => {

    let signature = req.get('X-Signature-Ed25519');
    let timestamp = req.get('X-Signature-Timestamp');

    let body = req.rawBody;

    let isVerified = nacl.sign.detached.verify(
        Buffer.from(timestamp + body),
        Buffer.from(signature, 'hex'),
        Buffer.from(process.env.APP_KEY, 'hex')
    );
      
    
    if (!isVerified)
        return res.status(401).end('invalid request signature');
    else
        next()
}