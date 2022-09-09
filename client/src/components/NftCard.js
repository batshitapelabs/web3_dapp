import * as React from "react";
import useColorThief from "use-color-thief";

import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

export default function NftCard({ data, onClick }) {
  const { color } = useColorThief(data.url, {
    format: "hex",
    colorCount: 10,
    quality: 10,
  });

  const isVideo = (contentType) => {
    return contentType === "video/mp4";
  };

  const contentBackgroundColor = "#F5F5F5";
  const tokenNameColor = "grey";
  const nameColor = "black";

  return (
    <div onClick={() => onClick(data)}>
      <Card
        className="card"
        sx={{
          width: "240px",
          height: "auto",
          boxShadow: 0,
          borderRadius: 3,
          border: "solid",
          borderColor: "#E0E0E0",
        }}
      >
        <Box sx={{ bgcolor: color }}>
          {isVideo(data.contentType) ? (
            <video width="240" height="240" controls autoPlay loop>
              <source
                id="preview_video"
                src={data.url}
                type="video/mp4"
                background-color={color}
              />
            </video>
          ) : (
            <img
              id="preview_image"
              src={data.url}
              alt={data.url}
              background-color={color}
            />
          )}
        </Box>
        <CardContent
          sx={{
            bgcolor: contentBackgroundColor,
            marginTop: "-4px",
            paddingBottom: "0px",
          }}
        >
          <div id="nft_token_name" style={{ color: tokenNameColor }}>
            {data.tokenName === "undefined" || data.tokenName === ""
              ? data.name
              : data.tokenName}
          </div>

          <div id="nft_name" style={{ color: nameColor }}>
            {data.name === "undefined" ? data.tokenID : data.name}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}