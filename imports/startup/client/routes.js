import { FlowRouter } from "meteor/ostrio:flow-router-extra";
// Import needed templates
import "../../ui/layouts/body/body.js";
import "../../ui/components/home/home.js";
import "../../ui/components/not-found/not-found.js";
import "../../ui/components/signin/signin.js";
import "../../ui/components/dashboard/dashboard.js";
import "../../ui/components/inventory/inventory.js";
import "../../ui/components/supply/supplier.js";
import "../../ui/components/transfers/transfers.js";
import "../../ui/components/inventory-adjustments/inventory-adjustments.js";
import "../../ui/components/products/products.js";
import "../../ui/components/users/users.js";
import "../../ui/components/vendors/vendors.js";
import "../../ui/components/warehouses/warehouses.js";
// Render templates to Blaze Layout
const renderRouteName = () =>
  BlazeLayout.render("wigglerLayout", { main: FlowRouter.getRouteName() });
// Route for Sign in
FlowRouter.route("/signin", {
  name: "signin",
  action() {
    if (Meteor.userId()) {
      console.log("logged in");
      FlowRouter.go("home");
      return;
    }
    BlazeLayout.render("wigglerLayout", { main: FlowRouter.getRouteName() });
  },
});
const configureName = (name) => {
  if (name.includes("-")) {
    return name.replace("-", "_");
  } else {
    return name;
  }
};
// Route function
const route = (name) =>
  FlowRouter.route(`/${name}`, {
    name: configureName(name),
    action: () => {
      if (!Meteor.userId()) {
        FlowRouter.go("signin");
        return;
      }
      //If not admin then access denied for this pages
      if (
        !isAdmin() &&
        (name === "users" ||
          name === "vendors" ||
          name === "warehouses" ||
          name === "inventory-adjustments")
      ) {
        FlowRouter.go("access-denied");
        return;
      }
      renderRouteName();
    },
  });

// Automatically detects changes on routes
Tracker.autorun(() => {
  FlowRouter.watchPathChange();
  console.log("FlowRouter route", {
    path: FlowRouter.current().path,
    params: FlowRouter.current().params,
    queryParams: FlowRouter.current().queryParams,
  });
});

// Home or Dashboard route
FlowRouter.route("/", {
  name: "home",
  action() {
    if (Meteor.userId()) {
      console.log("logged in");
      FlowRouter.go("dashboard");
    } else {
      BlazeLayout.render("wigglerLayout", { main: "home" });
    }
  },
});

// Throw "Not found page" if Route does not exists
FlowRouter.notFound = {
  action() {
    BlazeLayout.render("wigglerLayout", { main: "App_notFound" });
  },
};

route("dashboard"); // Dashboard Route
// route('inventory'); // Inventory Route
// route('supplier'); // Supplier Route
route("transfers"); // Transfers Route
route("inventory-adjustments"); // Inventory Adjustments Route
route("products"); // Products Route
route("users"); // Users route
route("vendors"); // Vendors route
route("warehouses"); // Warehouses route
// route('product-category') // Product Category route

FlowRouter.route("/products/new-product", {
  name: "new_product",
  action: renderRouteName,
});
