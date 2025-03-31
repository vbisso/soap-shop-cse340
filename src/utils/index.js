import express from "express";
import path from "path";
import { getCategories } from "../models/category.js";

/** @type {Array<{route: string, dir: string}|string>} Static path configurations */
const staticPaths = [
  { route: "/css", dir: "public/css" },
  { route: "/js", dir: "public/js" },
  { route: "/images", dir: "public/images" },
];

/**
 * THIS IS A CUSTOM FUNCTION. This code is specifically needed to support Brother Keers' layout
 * middleware. If you decide not to use Brother Keers' layout middleware, you can remove this and
 * will need to add the normal express.static middleware to your server.js file.
 *
 * Configures static paths for the given Express application.
 *
 * @param {Object} app - The Express application instance.
 */
const configureStaticPaths = (app) => {
  // Track registered paths
  const registeredPaths = new Set(app.get("staticPaths") || []);

  staticPaths.forEach((pathConfig) => {
    const pathKey =
      typeof pathConfig === "string" ? pathConfig : pathConfig.route;

    if (!registeredPaths.has(pathKey)) {
      registeredPaths.add(pathKey);

      if (typeof pathConfig === "string") {
        // Register the path directly
        app.use(pathConfig, express.static(pathConfig));
      } else {
        // Register the path with the specified route and directory
        app.use(
          pathConfig.route,
          express.static(path.join(process.cwd(), pathConfig.dir))
        );
      }
    }
  });

  // Update the app settings with the newly registered paths
  app.set("staticPaths", Array.from(registeredPaths));
};

/**
 * Returns the navigation menu.
 *
 * @returns {string} The navigation menu.
 */
const getNav = async (user_role) => {
  try {
    const categories = await getCategories();

    let nav = "";
    categories.forEach((row) => {
      const id = row.category_id;
      const name = row.category_name;
      nav += `<li><a href="/category/view/${id}">${name}</a></li>`;
    });

    nav += `<li><a href="/contact">Contact Us</a></li>`;

    if (user_role === "admin") {
      nav += `
      <li><a href="/dashboard">Dashboard</a></li>
      <li><a href="/tasks">Tasks</a></li>
      <li><a href="/account">Account</a></li>
      <li><a href="/account/logout">Logout</a></li>
      `;
    } else if (user_role === "staff") {
      nav += `
      <li><a href="/tasks">Tasks</a></li>
      <li><a href="/account">Account</a></li>
      <li><a href="/account/logout">Logout</a></li>`;
    } else if (user_role === "user") {
      nav += `<li><a href="/account">Account</a></li>
      <li><a href="/account/logout">Logout</a></li>
      <li><a href="/cart"><img src="/images/shopping-cart.png" alt="Cart">Cart</a></li>
      `;
    } else {
      nav += `<li><a href="/login"> Login</a></li><li><a href="/register"> Register</a></li>`;
    }

    return `${nav}`;
  } catch (error) {
    console.error("Error in getNav:", error);
    return "<nav><ul><li>Error loading categories</li></ul></nav>";
  }
};

export { configureStaticPaths, getNav };
