import express from 'express'
import bodyParser from 'body-parser'
import router from './routes/handler.js'
import path from 'path'
import { fileURLToPath } from 'url';
// const path = require("path");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`__dirname - ${__dirname}`)

const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(router);
//This will create a middleware.
//When you navigate to the root page, it would use the built react-app
app.use(express.static(path.resolve(__dirname, "./client/build")));

// backend routing port
const PORT = 4000;

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});