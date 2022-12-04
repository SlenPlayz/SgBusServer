# SGBus server
Server for the [SGBus](https://github.com/SlenPlayz/SGBus) app

## Instructions to host
1. Clone this repo and rename `.env.example` to `.env`
2. In the `.env` file replace `TOKEN HERE` with your token
3. Install packages using `npm i` in your terminal
4. Run `node index.js` to start the server

## Credits
 - Data for stops, services and routes taken from [@cheeaun/sgbusdata](https://github.com/cheeaun/sgbusdata) 
 - Arrival timings provided by [LTA Datamall](https://datamall.lta.gov.sg/content/datamall/en.html)
 - Server made with [node.js](https://nodejs.org)

### Packages used
 - [Axios](https://www.npmjs.com/package/axios) to fetch data from LTA Datamall and for stops, services amd route data from [cheeaun's site](https://data.busrouter.sg/)
 - [dotenv](https://www.npmjs.com/package/dotenv) to load LTA Datamall API access key from env file
 - [express](https://www.npmjs.com/package/express) as the web server framework
 - [node-cache](https://www.npmjs.com/package/node-cache) to cache bus timings and other data



