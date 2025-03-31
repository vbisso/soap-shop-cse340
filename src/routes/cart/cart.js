import { Router } from "express";
import { createOrder } from "../../models/orders.js";

const router = Router();

router.get("/", (req, res) => {
  const cart = req.session.cart || [];
  console.log(req.session.cart);
  //Total price
  const totalPrice = cart
    .reduce(
      (total, item) =>
        total + parseFloat(item.soap_price) * (item.quantity || 1),
      0
    )
    .toFixed(2);
  res.render("cart/cart", {
    title: "Cart",
    cart: cart,
    totalPrice: totalPrice,
  });
});

router.post("/remove", (req, res) => {
  const product_id = req.body.product_id;

  //filters out the removed item
  req.session.cart = req.session.cart.filter(
    (item) => item.soap_id !== parseInt(product_id)
  );

  req.flash("success", "Item removed from cart");

  // Redirect to the cart view
  res.redirect("/cart");
});

router.post("/buy", async (req, res) => {
  const cart = req.session.cart;
  const totalPrice = req.body.total_price;
  const user_id = req.session.user_id;
  await createOrder(cart, user_id, totalPrice);
  req.flash("success", "Order placed successfully");
  req.session.cart = [];
  res.redirect("/cart");
});
export default router;
