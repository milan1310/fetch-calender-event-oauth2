const router = require('express').Router();
require('dotenv').config();
const request = require('request');

// calling credentials from env file
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const SCOPE = process.env.SCOPE;
const REDIRECT_URI = "https://localhost:3000/api/auth";

router.get('/api/getevents',(req,res)=>{
if (!req.session.credentials) {
        return res.redirect('/api/auth');
    }
    const credentials = JSON.parse(req.session.credentials);
    if (credentials.expires_in <= 0) {
        return res.redirect('/api/auth');
    }
    request.get({
        url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events/',
        headers: {
            Authorization: `Bearer ${credentials.access_token}`,
        },
    }, (error, response, body) => {
        if (error) {
            return res.send(`An error occurred: ${error}`);
        }
        res.send(JSON.parse(body));
    });
});

router.get('/api/auth',(req,res)=>{
    if (!req.query.code) {
        const authUri = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;
        return res.redirect(authUri);
    }
    const authCode = req.query.code;
    request.post({
        url: 'https://oauth2.googleapis.com/token',
        form: {
            code: authCode,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
        },
    }, (error, response, body) => {
        if (error) {
            return res.send(`An error occurred: ${error}`);
        }
        req.session.credentials = body;
        console.log("Response" + response);
        console.log("Body"+body);
        res.redirect('/api/getevents');
    });
})
module.exports = router;