import { Router } from "express";
import { getProductsByCategory } from "../../models/category.js";
import { getSoapById } from "../../models/soaps.js";
import { getAverageRatingsForSoaps } from "../../models/reviews.js";

const router = Router();
//view products by category
router.get("/view/:id", async (req, res) => {
  const id = req.params.id;
  const soapsByCat = await getProductsByCategory(id);
  if (!soapsByCat) {
    return res.status(404).send("Category not found");
  }

  const soapIds = soapsByCat.map((soap) => soap.soap_id);
  const ratingsBySoap = await getAverageRatingsForSoaps(soapIds);
  const soapsWithRatings = soapsByCat.map((soap) => ({
    ...soap,
    average_rating: ratingsBySoap[soap.soap_id] || 0,
  }));
  //console.log(soapsWithRatings);

  res.render("category/category", {
    soaps: soapsWithRatings,
    title: soapsByCat[0].category_name,
  });
});

//Adding items to cart from category view
router.post("/:id/add-to-cart", async (req, res) => {
  //check if user is logged in
  if (!req.session.user_id) {
    req.flash("error", "Please log in to add items to cart");
  } else {
    const { product_id, quantity = 1 } = req.body; //quatity 1 by default
    const soapDetails = await getSoapById(product_id);

    // Initialize cart session if it doesn't exist
    if (!req.session.cart) {
      req.session.cart = [];
    }

    // Checks if the item is already in the cart
    const existingItem = req.session.cart.find(
      (item) => item.soap_id === soapDetails.soap_id
    );
    if (existingItem) {
      existingItem.quantity += parseInt(quantity); // Increment quantity by the quantity selected
    } else {
      soapDetails.quantity = parseInt(quantity);
      req.session.cart.push(soapDetails);
    }
    req.flash("success", `${soapDetails.soap_name} added to cart!`);
    //console.log(req.params.id);
  }
  res.redirect("/category/view/" + req.params.id);
});

export default router;
