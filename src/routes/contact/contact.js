import { Router } from "express";
import { submitMessage } from "../../models/contact.js";

const router = Router();

//contact
router.get("/", (req, res) => {
  res.render("contact/contact", { title: "Contact Us" });
});
router.post("/", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  //   const date = new Date().toISOString().split("T")[0]; // Extracts YYYY-MM-DD to match Date format in the database
  //console.log(name, email, message);
  const result = await submitMessage(name, email, message);
  console.log(result);
  req.flash(
    "success",
    "Message sent successfully. We'll reach out to you soon."
  );
  res.redirect("contact");
});
export default router;
