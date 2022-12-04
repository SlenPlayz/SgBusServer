const express = require("express");
const NodeCache = require("node-cache");
const axios = require("axios");
require("dotenv").config();

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

const Version = 1;

const cache = new NodeCache({ stdTTL: 60 });
const app = express();
const key = process.env.ACCKEY;

app.get("/api/data/version", (req, res) => {
  res.send({
    version: Version,
  });
});

app.get("/api/launch", (req, res) => {
  const cachedData = cache.get("Train service alerts");
  if (cachedData) {
    let data = cachedData;
    res.send(data);
  } else {
    axios
      .get(
        `http://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts`,
        {
          headers: {
            AccountKey: key,
          },
        }
      )
      .then((resp) => {
        let data = resp.data.value;
        let message;
        let response = {};
        response.version = Version
        response.alerts = [];
        if (data.Message.length != 0) {
          message = data.Message[0];
          response.alerts.push({title: 'Train service alert', message});
        }
        cache.set("Train service alerts", response);
        res.send(response);
      });
  }
});

app.get("/api/data/stops", (req, res) => {
  const cachedData = cache.get("stops");
  let data;
  if (cachedData) {
    data = cachedData;
    res.send(data);
  } else {
    axios.get(`https://data.busrouter.sg/v1/stops.geojson`).then((resp) => {
      let parsed;
      let stops = resp.data;
      let busStopsParsed = [];
      stops.features.forEach((x) => {
        busStopsParsed.push({
          Name: x.properties.name,
          Services: x.properties.services,
          id: x.properties.number,
          cords: x.geometry.coordinates,
        });
      });
      parsed = busStopsParsed;
      cache.set("stops", parsed, 60 * 60 * 24 * 3);
      data = parsed;
      res.send(data);
    });
  }
});

app.get("/api/data/routes", (req, res) => {
  axios.get(`https://data.busrouter.sg/v1/routes.min.geojson`).then((resp) => {
    let routes = resp.data;
    res.send(routes);
  });
});

app.get("/api/data/services", (req, res) => {
  const cachedData = cache.get("services");
  let data;
  if (cachedData) {
    data = cachedData;
    res.send(data);
  } else {
    axios.get(`https://data.busrouter.sg/v1/services.json`).then((resp) => {
      cache.set("services", resp.data, 60 * 60 * 24 * 3);
      data = resp.data;
      res.send(data);
    });
  }
});

app.get("/:sid", (req, res) => {
  const cachedData = cache.get(req.params.sid);
  let data;
  if (cachedData) {
    data = cachedData;
    res.send(data);
  } else {
    axios
      .get(
        `http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${req.params.sid}`,
        {
          headers: {
            AccountKey: key,
          },
        }
      )
      .then((resp) => {
        let srt;
        srt = resp.data;
        srt.Services.sort((a, b) => {
          if (isNumeric(a.ServiceNo)) {
            return a.ServiceNo - b.ServiceNo;
          } else {
            return a.ServiceNo.slice(0, -1) - b.ServiceNo;
          }
        });
        cache.set(req.params.sid, srt);
        data = srt;
        res.send(data);
      });
  }
});

app.get("/:sid/:bid", (req, res) => {
  const cachedData = cache.get(`${req.params.sid}/${req.params.bid}`);
  if (cachedData) {
    res.send(cachedData);
  } else {
    axios
      .get(
        `http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${req.params.sid}&ServiceNo=${req.params.bid}`,
        {
          headers: {
            AccountKey: key,
          },
        }
      )
      .then((resp) => {
        const data = resp.data;
        cache.set(`${req.params.sid}/${req.params.bid}`, data);
        res.send(data);
      });
  }
});

app.listen(3000, () => {
  console.log("Listening");
});
