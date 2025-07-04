const express=require('express');
const router=express.Router();
const adminController= require('../controllers/admin');

const isAuth=require('../middleware/is-auth');
//GET
router.get("/add-product",isAuth,adminController.getAddProduct);

router.get('/products',isAuth,adminController.getProducts);
//POST 
router.post("/add-product",isAuth,adminController.postAddProduct);

router.get("/edit-product/:productId",isAuth,adminController.getEditProduct);

router.post("/edit-product",isAuth,adminController.postEditProduct);

router.post("/delete-product",isAuth,adminController.postDeleteProduct);

module.exports=router;
