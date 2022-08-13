const express = require('express');
const NodeCache = require("node-cache");
const axios = require('axios');
require('dotenv').config()

const Version = 0.1

const cache = new NodeCache({ stdTTL: 60 });
const app = express();
const key = process.env.ACCKEY

app.get('/', (req, res) => {
  res.send(Version.toString())
});

app.get('/:sid', (req, res) => {
  const cachedData = cache.get(req.params.sid)
  if (cachedData) {
    res.send(cachedData)
  } else {
    axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${req.params.sid}`, {
      headers: {
        AccountKey: key
      }
    }).then(resp => {
      const data = resp.data
      cache.set(req.params.sid, data)
      res.send(data)
    })
  }
});

app.get('/:sid/:bid', (req, res) => {
  const cachedData = cache.get(req.params.sid)
  if (cachedData) {
    res.send(cachedData)
  } else {
    axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${req.params.sid}&ServiceNo=${req.params.bid}`, {
      headers: {
        AccountKey: key
      }
    }).then(resp => {
      const data = resp.data
      cache.set(req.params.sid, data)
      res.send(data)
    })
  }
});

app.listen(3000, () => {
  console.log('Listening');
});
