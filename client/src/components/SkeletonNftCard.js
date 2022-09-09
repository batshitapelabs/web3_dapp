import * as React from "react";

import { Skeleton } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";

export default function SkeletonNftCard() {

  return (
    <div>
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
        <Skeleton animation="wave" variant="rectangular" width={240} height={240} /> 
        <CardContent
          sx={{
            bgcolor: "#F5F5F5",
            marginTop: "-4px",
            paddingBottom: "0px",
          }}
        >
          <Skeleton animation="wave" variant="text" width={160} height={23} /> 
          <Skeleton animation="wave" variant="text" width={200} height={23} /> 
        </CardContent>
      </Card>
    </div>
  );
}