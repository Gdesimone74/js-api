const { Listing } = require('../models');

module.exports = {
    async get(req, res) {
        try {
            const listing = await Listing.findByPk(req.params.listingId);
            res.json(listing);
          } catch (error) {
            console.error('Error al obtener el listado:', error);
            res.status(500).json({ error: 'Error en el servidor' });
          }
    }
}