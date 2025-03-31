import { Router } from "express";
import { verifyUser, getUserRole } from "../../models/account.js";

const router = Router();

//login
router.get("/", (req, res) => {
  res.render("account/login", { title: "Login" });
});

//login post
router.post("/", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await verifyUser(email, password);

  if (!user) {
    req.flash("error", "Invalid email or password");
    res.redirect("login");
    return;
  } else {
    const user_role = await getUserRole(user.user_id); //returns user role name
    //delete user.password; //deletes the password from the user obejct befor sending it to the session
    req.session.user_role = user_role;
    req.session.user_name = user.name;
    req.session.user_email = user.email;
    req.session.user_id = user.user_id;
    //console.log(req.session.user_id);
    console.log(
      `user logged in: ${user.name}, email:${user.email}, role:${user_role}`
    );
    res.redirect("/account");
  }
});
export default router;
