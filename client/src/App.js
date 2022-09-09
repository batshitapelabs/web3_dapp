import "./App.css";
import React, { useEffect, useState } from "react";

// import { fetchNFTsFromEtherscan } from './etherscan/etherscan.js';

// import lottieJson from "./assets/loading.json";
// import Lottie from "react-lottie-player";

import appIcon from "./assets/app_icon.png";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
// import Alert from "@mui/material/Alert";
// import Container from "@mui/material/Container";

import NftCard from "./components/NftCard.js";
import AppFooter from "./components/AppFooter.js";
import SkeletonNftCard from "./components/SkeletonNftCard.js"
import UpdateProfilePicDrawer from "./components/UpdateProfilePicDrawer.js";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [metadata, setMetadata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMetadata, setSelectedMetadata] = useState({});

  const { ethereum } = window;
  let skeletonMetadata = [
    { "" : "", },
    { "" : "", },
    { "" : "", },
    { "" : "", },
    { "" : "", },
    { "" : "", },
    { "" : "", },
    { "" : "", },
    { "" : "", },
    { "" : "", },
    { "" : "", }
  ]

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        console.log("Make sure to install the MetaMask browser extension!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        setLoading(true);

        const response = await fetch(`/nfts?address=${account}`);
        const metadata = await response.json()
        
        setLoading(false);
        setMetadata(metadata);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert("Make sure to install the MetaMask browser extension!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const abbreviateAddress = (walletAddress) => {
    let firstPart = walletAddress.substring(0, 6);
    let lastPart = walletAddress.substring(walletAddress.length - 4);
    return `${firstPart}....${lastPart}`;
  };

  // const fetchNFTsFromOpensea = (ownerAddress) => {
  //   const options = {method: "GET", headers: { Accept: 'application/json', 'X-API-KEY': 'some-api-key' }};
  
  //   fetch(`https://api.opensea.io/api/v1/assets?owner=${ownerAddress}&order_direction=desc&offset=0&limit=500&include_orders=false`, options)
  //     // .then(response => response.json())
  //     .then(response => console.log(response.data.result))
  //     .catch(err => console.error(err));
  // }

  if(ethereum) {
    ethereum.on("accountsChanged", function (accounts) {
      setMetadata([]);

      checkIfWalletIsConnected();
    });
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardClicked = (data) => {
    setSelectedMetadata(data);
    setDrawerOpen(true);
  };

  // if (!ethereum) {
  //   return (
  //     <Container maxWidth="sm">
  //       <Alert severity="warning">Make sure you have Metamask installed!</Alert>
  //     </Container>
  //   );
  // }

  return (
    <Box className="App">
      <AppBar>
        <Toolbar id="toolbar">
          <img
            id="app_icon"
            alt=""
            style={{
              width: "56px",
              height: "56px",
              marginLeft: "0px",
              marginRight: "32px",
              borderRadius: "50%",
            }}
            src={appIcon}
          />
          <Box sx={{ flexGrow: 1 }}>
            <p id="app_name">PFP Updater</p>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {currentAccount ? (
              <button
                variant="contained"
                className="wallet_button"
                id="connected"
              >
                {abbreviateAddress(currentAccount)}
              </button>
            ) : (
              <button
                variant="contained"
                className="wallet_button"
                id="disconnected"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box id="content">

        {loading
          ? 
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
            >
            {skeletonMetadata.map((data, id) => (
              <Grid item key={id}>
                <SkeletonNftCard /> 
              </Grid>
            ))}  
            
          </Grid>    
          : metadata.length === 0
            ? <Box id="empty_container">No items to display</Box>
            : <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
            >
              {metadata.map((data, id) => (
                <Grid item key={id}>
                  <NftCard
                    data={data}
                    onClick={(_data) => handleCardClicked(data)}
                  />
                </Grid>
              ))}
            </Grid>
        }

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <UpdateProfilePicDrawer data={selectedMetadata} />
        </Drawer>
      </Box>
      <AppFooter />
    </Box>
  );
}

export default App;

/*{ <Box
id="lottie_container"
sx={{
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}}
>
<Lottie id="loader" loop animationData={lottieJson} play />
</Box> }*/

// <CircularProgress color="inherit" />

// <img src={loader} alt="loading..." />

// function App() {
//
// }
//
// const App = () => {
//
// }

// const options = {method: "GET", headers: { 'Access-Control-Allow-Origin': '*' }, mode: 'no-cors'};
// const options = {method: "GET", mode: 'no-cors'};

// 'Access-Control-Allow-Origin': '*',
// 'Access-Control-Allow-Credentials': 'true',
// 'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',

// const options = {headers: {
//
//   'Access-Control-Allow-Headers': 'Authorization'
// }};
