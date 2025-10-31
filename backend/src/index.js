require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const swapRoutes = require('./routes/swap');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', swapRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(()=> {
    app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
  }).catch(err => console.error(err));
