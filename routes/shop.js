const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProductId);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.post("/delete-cartitem", shopController.postDeleteCart);

// router.post("/create-order", shopController.addOrders);
// router.get("/orders", shopController.getOrders);

// router.get('/checkout', shopController.getCheckout);

module.exports = router;
