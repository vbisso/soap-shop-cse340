import { Router } from "express";
import fs from "fs";
import path from "path";
import { getOrderStats } from "../../models/orders.js";
import { getMessagesStats } from "../../models/contact.js";
import { getTicketsStats } from "../../models/tickets.js";
import { getAllUsers, updateUserRole, deleteUser } from "../../models/users.js";
import { getSoaps, addSoap, deleteSoap } from "../../models/soaps.js";

const router = Router();

router.get("/", async (req, res) => {
  const user_role = req.session.user_id;

  const messagesStatsAll = await getMessagesStats("all");
  const messagesStatsUnread = await getMessagesStats("unread");
  const messagesStatsCompleted = await getMessagesStats("completed");

  const orderStatsAll = await getOrderStats("all");
  const orderStatsRevenue = await getOrderStats("revenue");

  const ticketsStatsAll = await getTicketsStats("all");
  const ticketsStatsOpen = await getTicketsStats("open");
  const ticketsStatsClosed = await getTicketsStats("closed");

  const users = await getAllUsers();

  const soaps = await getSoaps();
  //console.log(users);

  res.render("dashboard/dashboard", {
    title: "Dashboard",
    user_role,
    messagesStatsAll,
    messagesStatsUnread,
    messagesStatsCompleted,
    orderStatsAll,
    orderStatsRevenue,
    ticketsStatsAll,
    ticketsStatsOpen,
    ticketsStatsClosed,
    users,
    soaps,
  });
});

router.post("/update-role", async (req, res) => {
  const new_role_id = req.body.new_role_id;
  console.log(user_id, new_role_id);
  await updateUserRole(new_role_id, req.body.user_id);
  req.flash("success", "User role updated successfully!");
  res.redirect("/dashboard");
});

router.post("/delete-user", async (req, res) => {
  await deleteUser(req.body.user_id);
  req.flash("success", "User deleted successfully!");
  res.redirect("/dashboard");
});
const getVerifiedImage = (images = []) => {
  // Exit early if no valid images array provided
  if (!images || images.length === 0) {
    return "";
  }
  // Process first image (assuming single image upload)
  const image = images[0];
  const imagePath = path.join(
    process.cwd(),
    `public/images/${image.newFilename}`
  );
  // Move uploaded file from temp location to permanent storage
  fs.renameSync(image.filepath, imagePath);
  // Cleanup by removing any remaining temporary files
  images.forEach((image) => {
    if (fs.existsSync(image.filepath)) {
      fs.unlinkSync(image.filepath);
    }
  });
  // Return the new frontend image path for storage in the database
  return `/images/${image.newFilename}`;
};
router.post("/add-soap", async (req, res) => {
  const soap = req.body;

  //console.log(req.files.image_path);
  const image_path = getVerifiedImage(req.files.image_path);
  await addSoap(soap, image_path);

  req.flash("success", "Soap added successfully!");
  res.redirect("/dashboard");
});

router.post("/delete-soap", async (req, res) => {
  await deleteSoap(req.body.soap_id);
  req.flash("success", "Soap deleted successfully!");
  res.redirect("/dashboard");
});

export default router;
