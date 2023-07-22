const express = require("express");
const linkPreviewJs = require("link-preview-js");
var cors = require("cors");
const app = express();
app.use(cors());
const port = process.env.PORT || 3001;

const server = app.listen(port);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

app.get("/preview", async (req, res, next) => {
  try {
    const options = {
      headers: { 'user-agent': 'googlebot', 'Accept-Language': 'en-GB' },
    };
    const data = await linkPreviewJs.getLinkPreview(req.query.url, options);
    res.json(data);
  } catch (err) {
    res.json(err);
    res.status(500);
  }
});
