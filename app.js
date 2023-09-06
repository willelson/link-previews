const express = require('express');
const linkPreviewJs = require('link-preview-js');
require('dotenv').config();
var cors = require('cors');
const app = express();
app.use(cors());
const port = process.env.PORT || 3001;

const server = app.listen(port);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const userAgents = [
  'Mozilla/5.0 (Windows NT 6.2; en-US) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Linux; Android 11; Black G Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/110.0.5481.65 Mobile Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/118.0',
  'Mozilla/5.0 (Linux; Android 12; WP21 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/115.0.5790.166 Mobile Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15; rv:105.0) Gecko/20100101 Firefox/105.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_15_2) AppleWebKit/557.9.2 (KHTML, like Gecko) Version/11.7 Safari/557.9.2',
  'Mozilla/5.0 (Macintosh; Apple M1 Mac OS X 11_3; rv:86.0) Gecko/20100101 Firefox/86.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14_7_1 Safari/605.1.15',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.04; rv:10.0) Gecko/20100101 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.15; rv:111.0) Gecko/20100101 Firefox/112.0. 1',
  'Mozilla/5.0 (Macintosh; Apple Mac OS X 14_0_0) AppleWebKit/537.36.0 (KHTML, like Gecko) Chrome/114.0.5735.45 Safari/537.36.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7) AppleWebKit/608.2.11 (KHTML, like Gecko) Version/14.6 Safari/604.1',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1; x64) AppleWebKit/605.37 (KHTML, like Gecko) Version/14.1 Safari/605.21',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/276.1.554948670 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/116.0.5845.90 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/276.1.554948670 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/276.1.554948670 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/105.0.5195.100 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 12_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/98.0 Tablet/15E148 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
  'Mozilla/5.0 (X11; Ubuntu 18.04 LTS; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36',
  'Mozilla/5.0 (X11; Ubuntu 20.04 LTS; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
  'Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.8.1.15) Gecko/20080702 Ubuntu/8.04 (hardy) Firefox/50.0.2',
  'Mozilla/5.0 (X11; U; Linux x86_64; it; rv:1.9.0.14) Gecko/2009090216 Ubuntu/8.04 (hardy) Firefox/52.6.0',
  'Mozilla/5.0 (Linux 4.9.57; Ubuntu 16.04.5 LTS; Linux Mint 18.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.3202.94 Safari/537.36',
  'Mozilla/5.0 (X11; Ubuntu 16.04; Linux Kernel 3.2.0-88.126) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0',
  'Mozilla/5.0 (Linux; Ubuntu 16.04; like Android 9;) AppleWebKit/537.36 Chrome/87.0.4280.144 Safari/537.36',
  'Mozilla/5.0 (Linux; Ubuntu 16.04 like Android 9;) AppleWebKit/537.36 Chrome/87.0.4280.144 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Ubuntu 16.04 like Android 4.4) AppleWebKit/537.36 Chrome/77.0.3865.129 Mobile Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_30_83) AppleWebKit/532.98.41 (KHTML, like Gecko) Chrome/57.4.0087.5359 Safari/534.59 Edge/38.65370',
  'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_46_99) AppleWebKit/533.05.58 (KHTML, like Gecko) Chrome/57.5.0734.6006 Safari/530.66 Edge/34.72849',
  'Mozilla/5.0 (Linux; Android 13; motorola edge 40) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/21.0 Chrome/110.0.5481.154 Mobile Safari/537.36',
];

async function imageUrlToBase64(url) {
  try {
    const response = await fetch(url);
    const blob = await response.arrayBuffer();

    const contentType = response.headers.get('content-type');
    const base64String = `data:${contentType};base64,${Buffer.from(
      blob
    ).toString('base64')}`;

    return base64String;
  } catch (err) {
    console.log(err);
  }
}

const noInstagramDataReturned = (data) => {
  if (data.title === 'Instagram' && data.images[0].startsWith('data:image/')) {
    return true;
  } else return false;
};

const blockedByCloudflare = (data) => {
  // Check data - if no image and title contains 'Attention Clouflare' throw error
  const lowerTitle = data.title.toLowerCase();

  if (
    lowerTitle.includes('attention') &&
    lowerTitle.includes('required') &&
    lowerTitle.includes('cloudflare') &&
    !data.image &&
    !data.description
  ) {
    return true;
  }
  return false;
};

const processInstagramData = (data) => {
  const regex = /(?:(?:20)[0-9]{2}):/g;
  const instaTitle = data.description.split(regex)[1];
  data.description = data.title;
  data.title = instaTitle;
};

app.get('/preview', async (req, res, next) => {
  const randomIndex = Math.floor(Math.random() * userAgents.length);
  const agent = userAgents[randomIndex];
  const domain = new URL(req.query.url);

  try {
    const options = {
      headers: { 'user-agent': agent, 'Accept-Language': 'en-GB' },
      timeout: 4500,
    };
    const data = await linkPreviewJs.getLinkPreview(req.query.url, options);

    if (blockedByCloudflare(data)) {
      throw Error('Blocked by Cloudflare');
    }

    const { url, siteName, mediaType, contentType } = data;
    let image = data.images[0];
    let imageData;

    if (data.images.length > 0) {
      let filteredImages = data.images
        .filter((img) => !img.includes('.svg'))
        .filter((img) => !img.includes('_logo'));
      if (filteredImages.length > 0) {
        image = filteredImages[0];
      }
    }

    if (domain.hostname === 'www.instagram.com') {
      if (noInstagramDataReturned(data)) {
        throw Error('No Instagram data returned');
      }
      imageData = await imageUrlToBase64(image);
      processInstagramData(data);
    }

    const { title, description } = data;

    const returnData = {
      url,
      title,
      siteName,
      description,
      mediaType,
      contentType,
      image,
      imageData,
      source: 'linkPreviewJS',
    };

    res.json(returnData);
  } catch (err) {
    console.log(err);
    try {
      const key = process.env.LINK_PREVIEW_API_KEY;
      var data = { key, q: req.query.url };

      const timeout = 4500;
      const controller = new AbortController();
      const id = setTimeout(() => {
        controller.abort();
        throw Error('API timeout');
      }, timeout);

      const response = await fetch('https://api.linkpreview.net', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      clearTimeout(id);

      const resData = await response.json();
      res.json({ ...resData, images: [resData.image] });
      const { url, title, siteName, description, mediaType, contentType } =
        resData;
      const image = resData.image;
      let imageData;

      if (domain.hostname === 'www.instagram.com') {
        imageData = await imageUrlToBase64(image);
      }

      const returnData = {
        url,
        title,
        siteName,
        description,
        mediaType,
        contentType,
        image,
        imageData,
        source: 'api',
      };

      res.json(returnData);
    } catch (err) {
      console.log(err);
      res.json(err);
      res.status(500);
    }
  }
});
