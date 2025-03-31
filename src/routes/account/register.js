import { Router } from "express";
import { body, validationResult } from "express-validator";
import { registerUser } from "../../models/account.js";
const router = Router();

//register page
router.get("/", (req, res) => {
  res.render("account/register", { title: "Register" });
});
export default router;

const registrationValidation = body("password")
  .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
  .withMessage(
    "Password must be at least 8 characters long, include one uppercase letter, one number, and one symbol."
  );

//register page POST
router.post("/", registrationValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash(
      "error",
      errors
        .array()
        .map((err) => err.msg)
        .join(" ")
    );
    return res.redirect("/register");
  }
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirm_password;

  if (password !== confirmPassword) {
    req.flash("error", "Passwords did not match.");
    res.redirect("/register");
    return;
  }

  const user = await registerUser(name, email, password);
  console.log(user);
  res.redirect("/login");
});
