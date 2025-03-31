import { Router } from "express";
import { submitTicket } from "../../models/tickets.js";

const router = Router();

router.get("/create/:order_id", (req, res) => {
  const { order_id } = req.params;
  res.render("tickets/createTicket", { title: "Create Ticket", order_id });
});

router.post("/submit-ticket", async (req, res) => {
  const { subject, message, order_id } = req.body;

  await submitTicket(req.session.user_id, order_id, subject, message);
  req.flash("success", "Ticket submitted successfully!");
  res.redirect("/account");
});

export default router;
