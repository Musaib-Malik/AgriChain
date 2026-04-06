const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const { auth, checkRole } = require('../middleware/auth');

router.post(
  '/',
  auth,
  checkRole('farmer'),
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('quantity').isNumeric().withMessage('Quantity must be a number'),
    body('unit').trim().notEmpty().withMessage('Unit is required'),
    body('location').trim().notEmpty().withMessage('Location is required')
  ],
  productController.createProduct
);

router.get('/', auth, productController.getProducts);
router.get('/my-products', auth, productController.getMyProducts);
router.get('/:id', auth, productController.getProduct);

router.post(
  '/transfer-to-distributor',
  auth,
  checkRole('farmer'),
  productController.transferToDistributor
);

router.post(
  '/transfer-to-retailer',
  auth,
  checkRole('distributor'),
  productController.transferToRetailer
);

router.post(
  '/sell-to-consumer',
  auth,
  checkRole('retailer'),
  productController.sellToConsumer
);

module.exports = router;
