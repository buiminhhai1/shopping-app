const  Product = require('../models/product');

const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products, 
      pageTitle: "All products",
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const proId = req.params.productId;
  Product.findById(proId, product =>{
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  });
};


exports.getIndex = (req,res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products, 
      pageTitle: "Shop",
      path: '/'
    });
  });
};

exports.getCart = (req,res, next) => {
  Cart.getProducts(cart=> {
    Product.fetchAll(products => {
      const cartProducts = [];
      for(product of products){
        const cartProductData = cart.products.find(prod => prod.id === product.id); 
        if(cartProductData ){
          cartProducts.push({productData: product, qty: cartProductData.qty});
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
  
};

exports.postCart = (req,res, next) => {
  const proId =req.body.productId;
  Product.findById(proId, product => {
    Cart.addProduct(proId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  })
}

exports.getOrders = (req,res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req,res,next) => {
  res.render('/shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};