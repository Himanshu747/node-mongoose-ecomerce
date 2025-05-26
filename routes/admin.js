const express=require('express');
const router=express.Router();
const adminController= require('../controllers/admin');

//GET
router.get("/add-product",adminController.getAddProduct);

router.get('/products',adminController.getProducts);
//POST 
router.post("/add-product",adminController.postAddProduct);

router.get("/edit-product/:productId",adminController.getEditProduct);

router.post("/edit-product",adminController.postEditProduct);

router.post("/delete-product",adminController.postDeleteProduct);

module.exports=router;
