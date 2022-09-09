import TwitterIcon from "@mui/icons-material/Twitter";
import Stack from "@mui/material/Stack";

export default function AppFooter() {
  return (
    <footer
      id="footer"
      style={{ height: "80px", width: "100%", position: "fixed", bottom: "0" }}
    >
      <Stack
        id="stack_footer"
        direction="row"
        spacing={2}
        justifyContent="right"
        marginRight="40px"
        display="flex"
        alignItems="center"
        height="100%"
      >
        <a className="icon_a" href="https://twitter.com/batshitapelabs">
          <TwitterIcon
            id="twitter_icon"
          />
        </a>
        <div className="organization_div">© 2022 Batshitape Labs</div>
      </Stack>
    </footer>
  );
}
