// Fill the DB with example data on startup
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Inventory } from "../../api/database/inventoryCollection";

const SEED_EMAIL = "katherine@wiggler.com";
const SEED_PASSWORD = "wiggler2021!";

// Seed Account creation
createSeedAccount = () => {
  data = {
    email: SEED_EMAIL,
    password: SEED_PASSWORD,
    firstName: "Katherine",
    lastName: "Gragg",
  };
  Meteor.call("userCreate", data, (err) => err && console.log(err.reason));
};

Meteor.startup(() => {
  // if the Links collection is empty
  console.log("=== Server Started ===");

  if (!Accounts.findUserByEmail(SEED_EMAIL)) {
    createSeedAccount();
  }
});
