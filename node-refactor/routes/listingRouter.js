const express = require('express');
const router = express.Router();
const { Listing } = require('../models');

router.get('/:listingId', async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.listingId);
    res.json(listing);
  } catch (error) {
    console.error('Error al obtener el listado:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;