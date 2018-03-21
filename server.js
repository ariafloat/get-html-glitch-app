const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

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
    urls = [decodeURIComponent(request.query.url1), decodeURIComponent(request.query.url2), decodeURIComponent(request.query.url3), decodeURIComponent(request.query.url4), decodeURIComponent(request.query.url5)];
  } catch (err) {
    console.error(err);
    response.send(err);
    return;
  }
  Promise.all(urls.map(url => fetch(url).then(resp => resp.text())))
    .then((texts) => {
      response.json(JSON.stringify({ url1: texts[0], url2: texts[1], url3: texts[2], url4: texts[3], url5: texts[4] }));
    }).catch((err) => {
      console.error(err);
      response.send(err);
    });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
});
