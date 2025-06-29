const express=require("express");
const router=express.Router();
const shopController = require('../controllers/shop');
const adminRoutes=require("./admin");
const isAuth=require('../middleware/is-auth');


router.get('/',shopController.getIndex);

router.get('/products',shopController.getProducts);
router.get('/products/:productId',isAuth,shopController.getProduct);
router.get('/cart',isAuth,shopController.getCart);
router.post('/cart',isAuth,shopController.postCart);
router.get('/checkout',isAuth,shopController.getCheckout);
router.post('/cart-delete-item',isAuth,shopController.postCartDeleteProduct);
router.post('/create-order',isAuth,shopController.postOrder);
router.get('/orders',isAuth,shopController.getOrders);
module.exports=router;