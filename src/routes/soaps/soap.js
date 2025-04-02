import { Router } from "express";
import { getSoapById, updateSoap } from "../../models/soaps.js";
import { getAverageRatingsForSoaps, getReviews } from "../../models/reviews.js";
import fs from "fs";
import path from "path";

const router = Router();
//view products by category
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const soapDetails = await getSoapById(id);
  if (!soapDetails) {
    return res.status(404).send("Soap not found");
  }
  const reviewsBySoap = await getReviews(soapDetails.soap_id);
  const ratingsBySoap = await getAverageRatingsForSoaps([soapDetails.soap_id]);

  //console.log(ratingsBySoap);

  res.render("soaps/soap", {
    soap: soapDetails,
    reviews: reviewsBySoap,
    average_rating: ratingsBySoap[soapDetails.soap_id] || 0,
    title: soapDetails.soap_name,
  });
});

///dashboard/edit-soap/:<%= soap.soap_id %>
router.get("/edit-soap/:id", async (req, res) => {
  const id = req.params.id;
  const soap = await getSoapById(id);

  res.render("soaps/editSoap", {
    soap,
    title: "Edit Soap",
  });
});
///soap/update-soap
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

router.post("/update-soap", async (req, res) => {
  const { soap_id, soap_name, category_id, soap_price, soap_description } =
    req.body;

  const image_path = getVerifiedImage(req.files.image_path);
  const result = await updateSoap(soap_id, {
    soap_name,
    category_id,
    soap_price,
    soap_description,
    image_path,
  });
  // console.log(result);
  req.flash("success", "Soap updated successfully!");

  res.redirect("/dashboard");
});
export default router;
