const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const routes = require('./src/routes');

const createApp = () => {
  const app = express();

  app.use(cors())
  app.use(express.json())
  app.use(morgan('combined'))
  app.use(routes)

  app.get('/ping',(req,res) => {
    res.status(200).json({
        message: 'pong'
    })
  })
  return app
}

module.exports = {
  createApp
}