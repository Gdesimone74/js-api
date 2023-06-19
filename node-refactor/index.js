const express = require('express');
const app = express();
const listingRouter = require('./routes/listingRouter');
const updateRouter = require('./routes/updateRouter');
const bulkRouter = require('./routes/bulkStepsRouter');
require('dotenv').config();

app.use(express.json());

// Main Route
app.get('/', (req, res) => {
  res.send('healthCheck');
});

// Routes
app.use('/listings', listingRouter);
app.use('/update', updateRouter);
app.use('/create', bulkRouter);

// Port server
const port = 8080;
app.listen(port, () => {
  console.log('Servidor en ejecución en el puerto ' + port);
});
