const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const parserHtml = require('./src/parser-html');

const app = express();
app.use(cors());

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

app.get('/dreams', (request, response) => {
  let urls = null;
  try {
    urls = [decodeURIComponent(request.query.url1), decodeURIComponent(request.query.url2), decodeURIComponent(request.query.url3)];
  } catch (err) {
    console.error(err);
    response.send(err);
    return;
  }
  Promise.all(urls.map(url => fetch(url).then(resp => resp.text())))
    .then((texts) => {
      response.json(JSON.stringify({ url1: texts[0], url2: texts[1], url3: texts[2] }));
    }).catch((err) => {
      console.error(err);
      response.send(err);
    });
});

app.get('/dreams-gogo', (request, response) => {
  let urls = ['https://www.raqualia.co.jp/', 'http://askat-inc.com/japanese/news/', 'https://ir.syros.com/press-releases'];
  Promise.all(urls.map(url => fetch(url).then(resp => resp.text())))
    .then((texts) => {
      const raqualiaPromise = parserHtml.raqualia(texts[0]);
      raqualiaPromise.then((raqualia) => {
        const askat = parserHtml.askat(texts[1]);
        const syros = parserHtml.syros(texts[2]);
        response.json(JSON.stringify({ raqualia, askat, syros }));
      }).catch(console.error);
    }).catch((err) => {
      console.error(err);
      response.send(err);
    });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
});
