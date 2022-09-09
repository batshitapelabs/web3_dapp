import dotenv from 'dotenv'
dotenv.config()

import {
    TwitterApi
} from 'twitter-api-v2';
import express from 'express';
import request from 'request';
import fetchNFTs from "../moralis.js"

const apiKey = process.env.apiKey
const apiKeySecret = process.env.apiKeySecret
const accessToken = process.env.accessToken
const accessTokenSecret = process.env.accessTokenSecret

let oauth_token = ""
let oauth_token_secret = ""

// oauth_consumer_key == apiKey
// oauth_consumer_secret == apiKeySecret
// oauth_token == accessToken
// oauth_token_secret == accessTokenSecret

// const TWITTER_BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAGaUdgEAAAAAS1obySsAmIFTmYeOj8k3CZ13JO0%3DX98M0n0smRZF1NbAoOumG4yoGB7CZUStEBxDwIJDv6r0QPKMGy'

const CALLBACK_URL = 'http://localhost:3000/auth'

const router = express.Router();

router.get('/access_credentials', async (req, res) => {
    const {
        oauth_token,
        oauth_verifier
    } = req.query;

    console.log(`get access token | oauth_verifier - ${oauth_verifier} | oauth_token - ${oauth_token}`);
    // console.log("logging req")
    // console.dir(req); 

    //     // Get the saved oauth_token_secret from session
    //     const { oauth_token_secret } = req.session;
    //     return;

    if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
        return res.status(400).send('You denied the app or your session expired!');
    }

    // Obtain the persistent tokens
    // Create a client from temporary tokens
    const client = new TwitterApi({
        appKey: apiKey,
        appSecret: apiKeySecret,
        accessToken: oauth_token,
        accessSecret: oauth_token_secret,
    });

    client.login(oauth_verifier)
        .then(({
            client: loggedClient,
            accessToken,
            accessSecret
        }) => {
            // loggedClient is an authenticated client in behalf of some user
            // Store accessToken & accessSecret somewhere
            console.log(`loggedClient - ${loggedClient} | accessToken - ${accessToken} | accessSecret - ${accessSecret}`)

            console.log(`printing loggedClient`)
            console.dir(loggedClient)

            const response = {
                "loggedClient": `${loggedClient}`,
                "accessToken": `${accessToken}`,
                "accessSecret": `${accessSecret}`
            };

            // let currentUser = client.currentUser()
            // console.log(`printing current user`)
            // console.dir(currentUser)

            let url = 'https://0xstudio.mypinata.cloud/ipfs/QmeXZ2ruhkQ3WRG8em3LWBYbZfGTvtUY8HDzBGdCfRqbFR/8217.png';
            request({
                url,
                encoding: null
            }, (err, resp, buffer) => {
                // Use the buffer
                // buffer contains the image data
                // typeof buffer === 'object'
                // console.dir(buffer)

                // console.log("printing err")
                // console.dir(err)
                // console.log("printing resp")
                // console.dir(resp)
                // console.log("printing buffer")
                // console.dir(buffer)

                const updateProfileImageResponse = loggedClient.v1.updateAccountProfileImage(buffer);
                console.dir(updateProfileImageResponse)
            });

            res.send(JSON.stringify(response))
        })
        .catch(() => res.status(403).send('Invalid verifier or access tokens!'));
})

router.get('/authorize_url', async (req, res) => {
    const client = new TwitterApi({
        appKey: apiKey,
        appSecret: apiKeySecret
    });
    const authLink = await client.generateAuthLink(CALLBACK_URL);
    console.dir(authLink);

    // 'https://api.twitter.com/oauth/request_token'

    oauth_token = authLink.oauth_token
    oauth_token_secret = authLink.oauth_token_secret

    const authorizeUrl = `https://api.twitter.com/oauth/authorize?oauth_token=${oauth_token}&oauth_token_secret=${oauth_token_secret}&oauth_callback_confirmed=true`
    const response = {
        "url": `${authorizeUrl}`
    };
    res.send(JSON.stringify(response))
})

router.get('/nfts', async (req, res) => {
    const {
        address
    } = req.query;
    const response = await fetchNFTs(address);
    res.send(JSON.stringify(response))
})

// router.post('/addTweet', (req, res) => {
//     res.end('NA');
// });

export default router;