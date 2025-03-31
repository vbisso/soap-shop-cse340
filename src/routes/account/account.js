import { Router } from "express";
import {
  getOrders,
  getOrderItems,
  getOrderStats,
} from "../../models/orders.js";
import { submitReview, getReviews } from "../../models/reviews.js";
import { getMessagesStats } from "../../models/contact.js";
import { getTicketsStats, getTickets } from "../../models/tickets.js";
import { getAllUsers } from "../../models/users.js";

const router = Router();

//account page once logged in
router.get("/", async (req, res) => {
  // console.log(req.session.user_id);
  const orders = await getOrders(req.session.user_id);
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const orderItems = await getOrderItems(order.order_id);
      return { ...order, items: orderItems }; // Add items to the order object
    })
  );

  const tickets = await getTickets(req.session.user_id);

  res.render("account/account", {
    title: "Account",
    name: req.session.user_name,
    email: req.session.user_email,
    user_role: req.session.user_role,
    orders: ordersWithItems,
    tickets: tickets,
  });
});

//logout router
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

//leave review on order
//IMPLEMENT VALIDATION
router.post("/submit-review", async (req, res) => {
  const { soap_id, rating, review } = req.body;
  if (!review) {
    req.flash("error", "Please enter a review");
  } else {
    const result = await submitReview(
      soap_id,
      req.session.user_id,
      rating,
      review
    );
    console.log(result);
    req.flash("success", "Review submitted successfully!");
  }

  res.redirect("/account");
});

router.post("/ticket/:order_id", (req, res) => {
  const { order_id } = req.params;
  res.redirect(`/tickets/create/${order_id}`);
});
export default router;
