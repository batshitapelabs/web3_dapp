import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import React, {useEffect, useState} from "react";
import useColorThief from 'use-color-thief';

export default function UpdateProfilePicDrawer({ data }) {

  const [externalPopup, setExternalPopup] = useState(null);

  const { color } = useColorThief(data.url, {format: 'hex', colorCount: 10, quality: 10});
  
  const isVideo = (contentType) => {
    return contentType === "video/mp4";
  };

  useEffect(() => {
    if (!externalPopup) {
      return;
    }

    const timer = setInterval( async () => {
      if (!externalPopup) {
        timer && clearInterval(timer);
        return;
      }

      const currentUrl = externalPopup.location.href;
      if (!currentUrl) {
        return;
      }

      const searchParams = new URL(currentUrl).searchParams;

      let oauth_token = searchParams.get('oauth_token');
      let oauth_verifier = searchParams.get('oauth_verifier');

      if(oauth_token && oauth_verifier){
        externalPopup.close();

        const response = await fetch(`/access_credentials?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`);
        const json = await response.json()
        console.dir(json)  

        setExternalPopup(null);
        timer && clearInterval(timer);
      }
    }, 500)
  },
  [externalPopup]
)  

  const saveToDiscord = async () => {
    alert("Update Discord PFP functionality is coming soon!");
  }

  const saveToTwitter = async () => {
    alert("Update Twitter PFP functionality is coming soon!");


    // const response = await fetch('/authorize_url');
    // const json = await response.json()
    // console.dir(json)
    // const oauthUrl = json["url"]
    // console.log(`in UpdateProfilePicDrawer | oauthUrl - ${oauthUrl}`)

    // var width = 500;
    // var height = 400;
    // const left = window.screenX + (window.outerWidth - width) / 2;
    // const top = window.screenY + (window.outerHeight - height) / 2.5;
    // const title = `WINDOW TITLE`;
    // const url = oauthUrl;
    // const popup = window.open(url, title, `width=${width},height=${height},left=${left},top=${top}`);
    // setExternalPopup(popup);
  };

  // const onCode = (code, params) => {
  //   console.log("onCode())");
  //   console.dir(code)
  //   console.dir(params)

  //   // var token_url = 'https://app.pagerduty.com/oauth/token?grant_type=authorization_code&client_id='+
  //   // CLIENT_ID+'&redirect_uri='+REDIRECT_URL+'&code='+code+'&code_verifier='+sessionStorage.getItem('code_verifier');

  //   // try {
  //   //   const tokenData = await (await fetch(token_url, {method: 'POST'})).json();
  //   //   const valid = await isOauthTokenValid(tokenData.access_token);
  //   //   if (valid) {
  //   //     localStorage.setItem("pager-duty-token", tokenData.access_token);
  //   //     window.location.href = '/stats';
  //   //   } else {
  //   //     this.setState({ oauth_problem: true });
  //   //   }
  //   // } catch(e) {
  //   //   this.setState({ oauth_problem: true });
  //   // }
  // }

  // var fs = require('fs');
  // var Twit = require('twit'); // npm install twit
  //
  // var T = new Twit({
  //     consumer_key:         '*',
  //     consumer_secret:      '*',
  //     access_token:         '*',
  //     access_token_secret:  '*'
  // });
  //
  // var image64str = fs.readFileSync('kitten.jpg', {encoding: 'base64'});
  //
  // T.post('account/update_profile_image', { image: image64str }, function(err) {
  //     if(err) {console.error(err); return;}
  //     console.log('done');
  // });

 

  return (
    <Box sx={{ width: 600 }}>
      <Box
        sx={{ width: "100%", position: "relative" }}
      >
        <Box>
          <Stack
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: "translateY(50%)",
          }}
          >
          <Box sx={{backgroundColor: `${color}`}}>
            {isVideo(data.contentType) ? (
              <video width="360" height="360" controls autoPlay loop>
                <source id="drawer_video" src={data.url} type="video/mp4" />
              </video>
            ) : (
              <img
                id="drawer_image"
                width="360"
                height="360"
                src={data.url}
                alt={data.url}
              />
            )}
          </Box>
          <button
            variant="contained"
            className="save_button"
            id="twitter_button"
            onClick={() => saveToTwitter()}
          >
            Save to Twitter
          </button>
          <button
            variant="contained"
            className="save_button"
            id="discord_button"
            onClick={() => saveToDiscord()}
          >
            Save to Discord
          </button>
        </Stack>
        </Box>
      </Box>
    </Box>
  );
}
