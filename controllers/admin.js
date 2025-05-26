      // const Product = require("../models/product");

const Product = require("../models/product");


exports.getAddProduct = (req,res,next) => {
   
    res.render('admin/edit-product',{
                docTitle:'Add New Product',
                path:'/admin/add-product',
                editing:false
              });
};

exports.postAddProduct= (req,res,next)=>{
      const title=req.body.title;
      const imageUrl=req.body.imageUrl;
      const description=req.body.description;
      const price=req.body.price;
      
      const product=new Product({
            title:title,
            price:price,
            description:description,
            imageUrl:imageUrl,
            userId:req.user._id
      });
      product.save().then(result=>{
         //   console.log(result);
        // product.save();
            console.log('created product');
            res.redirect("/admin/products");
      })
      .catch(err=>{
            console.log(err);
      });
      // req.user.createProduct({
      //       title:title,
      //       price:price,
      //       imageUrl:imageUrl,
      //       description:description
      // }).then(result=>{
      //       //console.log(result);    
      //       console.log('Product created Successfully');
      //       res.redirect("/admin/products");
      // })
      // .catch(err=>{
      //       console.log(err)
      // });
      //const product=new Product(null,title,imageUrl,description,price);
    /*  product.save()
      .then(()=>{
            res.redirect("/admin/products");
      }).catch((err)=>{
            console.log(err);
      });
   */
   
};

exports.getEditProduct = (req,res,next) => {
      const editMode=req.query.edit;
      if(!editMode){
          return res.redirect("/");
      }
      const prodId=req.params.productId;
      // req.user.getProducts({where:{id:prodId}})
      // .then(products=>{
     Product.findById(prodId).then(products=>{
   
      const product=products;
            if(!product){
                  return res.redirect("/");
            }
            res.render('admin/edit-product',{
                  docTitle:'Edit Product',
                  path:'/admin/add-product',
                  editing:editMode,
                  product:product
                });
      })
      .catch(error=>{
            console.log(error);
      });
      
     
};

exports.postEditProduct =(req,res,next)=>{
      const prodId=req.body.productId;
      const updatedTitle=req.body.title;
      const updatedPrice=req.body.price;
      const updatedImageUrl=req.body.imageUrl;
      const updatedDesc=req.body.description;

      Product.findById(prodId).then(product=>{
            product.title=updatedTitle;
            product.price=updatedPrice;
            product.description=updatedDesc;
            product.imageUrl=updatedImageUrl;
            return product.save();
      }).then(result=>{
            console.log('Updated Product Successfully');
            res.redirect('/admin/products');
      })
      .catch(error=>{
            console.log('error is calling');
            console.log(error);
      });
      // const product=new Product(updatedTitle,updatedPrice,updatedDesc,updatedImageUrl,prodId);
      // product.save();
    
      // .then(product=>{
      //       product.title=updatedTitle;
      //       product.price=updatedPrice;
      //       product.imageUrl=updatedImageUrl;
      //       product.description=updatedDesc;
      //       return product.save();
      // })
      // .then(result=>{
      //       console.log('Updated Product Successfully');
      //       res.redirect('/admin/products');
      // })
      // .catch(error=>{
      //       console.log(error);
      // });
   
};

exports.getProducts=(req,res,next)=>{
            // req.user.getProducts()
      Product.find()
      // .select('title price -_id')
      // .populate('userId','name')
      .populate('userId')
      .then(products=>{
            console.log(products);
            res.render('admin/products',{
                  prod:products,
                  docTitle:'Admin Products',
                  path:'/admin/products'
            });  
      })
      .catch(error=>{
            console.log(error);
      });
   
    
};

exports.postDeleteProduct=(req,res,next)=>{
      const prodId=req.body.productId;
      Product.findByIdAndDelete(prodId)
      .then(()=>{
            console.log('Products Delete successfully');
            res.redirect("/admin/products");
      })
      .catch(error=>{
            console.log(error);
      });

      // Product.findByPk(prodId)
      // .then(product=>{
      //       return product.destroy();
      // })
      
     
}