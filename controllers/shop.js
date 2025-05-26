const Product = require("../models/product");
const Cart=require("../models/cart");
const Order = require("../models/order");
exports.getProducts = (req,res,next)=>{

      Product.find().then(products=>{
            res.render('shop/product-list',{
                  prod:products,
                  docTitle:'Admin Products',
                  path:'/products'
            });  
      });
};

exports.getProduct= (req,res,next)=>{
     const productId=req.params.productId;

     Product.findById(productId)
      .then(products =>{
            res.render('shop/product-details',{product:products,docTitle:products.title,path:'/products'});
      })
      .catch(error=>{console.log(error)});
}

exports.getIndex=(req,res,next)=>{
      Product.find()
      .then(product=>{
            res.render('shop/index',{
                  prod:product,
                  docTitle:'Shop',
                  path:'/'
            });
      })
      .catch(error=>{
            console.log(error);
      });

};

exports.getCart=(req,res,next)=>{
      // console.log(req.user.getCart());
      req.user
      .populate('cart.items.productId')
      .then((user)=>{
            const products=user.cart.items;
                              res.render('shop/cart',
                              {
                                          path:'/cart',
                                          docTitle:'Your Cart',
                                          products:products
                              });
            
            
      })
      .catch((err)=>{ console.log(err);});
  
    
};

exports.postCart=(req,res,next)=>{
      const prodId=req.body.productId;
      Product.findById(prodId)
      .then(product=>{
            return req.user.addToCart(product);
      }).then(result=>{
           
            console.log(result);
             res.redirect("/cart");
      });
   

}

exports.postCartDeleteProduct=(req,res,next)=>{
      const prodId=req.body.productId;

      req.user
      .removeFromCart(prodId)
      .then(result=>{
            res.redirect('/cart');
      })
      .catch(err=>console.log(err));

}
exports.postOrder=(req,res,next)=>{
req.user
      .populate('cart.items.productId')
      .then((user)=>{
            const products=user.cart.items.map(i=>{
                  return {quantity:i.quantity,product:{...i.productId._doc}}; 
            });
            const order=new Order({
                        user:{
                              name:req.user.name,
                              userId:req.user
                        },
                        products:products
             });
             order.save();
      })
      .then(result=>{
            return req.user.clearCart();
           
      })
      .then(()=>{
            res.redirect('/orders');
      })
      .catch(err=>console.log(err));
};

exports.getOrders=(req,res,next)=>{
      Order.find({'user.userId':req.user._id})
      .then(orders=>{
            res.render('shop/orders',{
                  path:'/orders',
                  docTitle:'Your Orders',
                  orders:orders
            });
      })
      .catch(err=>{
            console.log(err);
      });
     
};


exports.getCheckout=(req,res,next)=>{
//       res.render('shop/checkout',{
//             path:'/checkout',
//             pageTitle:'Checkout'
//       });
 }


  