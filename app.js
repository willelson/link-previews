const express = require("express");
const linkPreviewJs = require("link-preview-js");
const app = express();
const port = process.env.PORT || 3001;

const server = app.listen(port);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

app.get("/preview", async (req, res, next) => {
  try {
    const data = await linkPreviewJs.getLinkPreview(req.query.url);
    res.json(data);
  } catch (err) {
    res.json(err);
    res.status(500);
  }
});
