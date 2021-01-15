var express = require('express');
const productQueries = require('../dbQueries/products/queries.js');
var router = express.Router();
const { dbError } = require('../utils/functions.js');

router.post('/createProduct', (req, res) => {
  productQueries.saveProduct(req.body, (err, results) => {
    if (err) res.status(500).json(dbError(err));
    else res.json(results)
  })
});
router.get('/getProducts', (req, res) => {
  productQueries.getProducts((err, results) => {
    if (err) res.status(500).json(dbError(err));
    else res.json(results)
  })
})
router.get('/getProductById/:productId', (req, res) => {
  productQueries.getProductById(req.params.productId, (err, results) => {
    if (err) res.status(500).json(dbError(err));
    else res.json(results)
  })
})
router.post('/updateProduct', (req, res) => {
  productQueries.updateProducts(req.body, (err, results) => {
    if (err) res.status(500).json(dbError(err));
    else res.json(results)
  })
});

module.exports = router;
