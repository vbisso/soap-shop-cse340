import { Router } from "express";
import {
  getMessages,
  updateMessageStatus,
  deleteMessage,
} from "../../models/contact.js";
import { getAllTickets, updateTicketStatus } from "../../models/tickets.js";

const router = Router();

router.get("/", async (req, res) => {
  const messages = await getMessages();
  const tickets = await getAllTickets();
  //console.log(tickets);

  res.render("tasks/tasks", { title: "Task Management", messages, tickets });
});
export default router;

router.post("/update-message-status", async (req, res) => {
  const message_id = req.body.message_id;
  const status = req.body.status;

  const updated = await updateMessageStatus(message_id, status);
  if (updated) {
    req.flash("success", "Message status updated successfully!");
    res.redirect("/tasks");
  }
});

router.post("/delete-message", async (req, res) => {
  const message_id = req.body.message_id;
  const deleted = await deleteMessage(message_id);
  if (deleted) {
    req.flash("success", "Message deleted successfully!");
    res.redirect("/tasks");
  }
});

router.post("/update-ticket-status", async (req, res) => {
  const ticket_id = req.body.ticket_id;
  const status_id = req.body.status;
  await updateTicketStatus(ticket_id, status_id);
  req.flash("success", "Ticket status updated successfully!");
  res.redirect("/tasks");
});
