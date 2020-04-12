require('dotenv').config()
const  express = require('express')
const  app = express()

// // using cors to setup the origin of client website that can only permitted
const cors = require('cors')
const corsOptions = {
      // origin: `http://localhost:${process.env.CORS_PORT_SOURCE}`,
      //// enable all sources/clients
      origin: '*',
      // // dynamic source of origin
      // origin: [`http://localhost:${process.env.CORS_PORT_SOURCE}`,`http://localhost:${process.env.CORS_PORT_SOURCE_MOBILE}`],
      // methods: ['GET','POST','OPTIONS','PUT','PATCH','DELETE'],
      // allowedHeaders: ['Origin','X-Requested-With','Content-Type','Accept'],
      // credentials: true,
      optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

// // native or without using cor plugin will fixed cor issues but not recommended
// app.use((req,res,next)=>{
// // enable all sources
//   res.setHeader("Access-Control-Allow-Origin","*")
//   res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
//   next()
//   // // Website you wish to allow to connect
//   // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

//   // // Request methods you wish to allow
//   // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // // Request headers you wish to allow
//   // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // // Set to true if you need the website to include cookies in the requests sent
//   // // to the API (e.g. in case you use sessions)
//   // res.setHeader('Access-Control-Allow-Credentials', true);

//   // // Pass to next layer of middleware
//   // next();

// })

app.set('view engine', 'ejs')

const bodyParser = require('body-parser')
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));



var methodOverride = require('method-override')
 

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

app.use('/public', express.static('public'))

const index = require('./app/routes/index')
const auth = require('./app/routes/auth')
const api = require('./app/routes/api')
// const barangay = require('./app/routes/barangay')
// const street = require('./app/routes/street')
// const address = require('./app/routes/address')

app.use('/',index)
app.use('/api',api)
app.use('/api/auth',auth)
// app.use('/api/barangay',barangay)
// app.use('/api/street',street)
// app.use('/api/address',address)

const server = require('./app/config/server')

app.listen(server.server.port, function(){
  console.log(`Server running at port ${server.server.port}: http://127.0.0.1:${server.server.port}`)
})
