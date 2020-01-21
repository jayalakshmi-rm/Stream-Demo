const router = require('express').Router();
const productCtrl = require('./products.controller');
const logger = require('../../logger');
const Readable = require('stream').Readable;
var streamData = new Readable({
  objectMode: true,
  read() {}
});

router.get('/', (req, res) => {
  try {
    productCtrl.fetchProducts((err, result) => {
      if (err) {
        logger.error('Error ', err);
        return res.status(400).send({ error: 'Something is wrong, please try later..!' })
      } else {
        return res.send(result);
      }
    });
  } catch (err) {
    logger.error('Uncaught error ', err);
    return res.status(500).send({ error: 'Unexpected error, please try later...!' });
  }
});

router.post('/stream', (req, res) => {
  try {
    res.send({message: `Received ${req.body.length} objets`});
  } catch (err) {
    logger.error('Uncaught error ', err);
    return res.status(500).send({ error: 'Unexpected error, please try later...!' });
  }
});

router.get('/stream', (req, res) => {
  try {
    productCtrl.fetchProductsAsStream(res);
  } catch (err) {
    logger.error('Uncaught error ', err);
    return res.status(500).send({ error: 'Unexpected error, please try later...!' });
  }
});

router.get('/rawdata/stream', (req, res) => {
  try {
    productCtrl.fetchProductsFromFileAsStream(res)
    .then(result => res.send('success'),
    err => { throw new Error('couldnt update DB');});
  } catch (err) {
    logger.error('Uncaught error ', err);
    return res.status(500).send({ error: 'Unexpected error, please try later...!' });
  }
});

router.post('/rawdata/stream/:count', (req, res) => {
  try {
    for(var i = 1; i <= req.params.count; i++) {
      productCtrl.saveProductsAsStream(returnStream(req));
    }
  } catch (err) {
    logger.error('Uncaught error ', err);
    return res.status(500).send({ error: 'Unexpected error, please try later...!' });
  }
});

function returnStream(req) {
  streamData.push(req.body);
  return streamData;
}

module.exports = router;
