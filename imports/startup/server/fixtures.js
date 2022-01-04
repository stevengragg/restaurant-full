// Fill the DB with example data on startup
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Inventory } from "../../api/database/inventoryCollection";

const SEED_EMAIL = "katherine@wiggler.com";
const SEED_PASSWORD = "wiggler2021!";

// Seed Account creation
createSeedAccount = () => {
  const data = {
    email: SEED_EMAIL,
    password: SEED_PASSWORD,
    firstName: "Katherine",
    lastName: "Gragg",
    role: "admin"
  };
  const userId = Accounts.createUser({
    email: data.email,
    password: data.password,
    profile: {
      firstName: data.firstName,
      lastName: data.lastName
    }
  });
  let userRoles = Roles.getRolesForUser(userId);
  if (userRoles.length == 0) {
    Roles.createRole(data.role, { unlessExists: true });
    Roles.addUsersToRoles(userId, data.role);
  }
  const userUpdated = Meteor.users.update({ _id: data.userId }, { $set: { "profile.role": data.role } });

  // Meteor.call("userCreate", data, (err) => err && console.log(err.reason));
};

Meteor.startup(() => {
  // if the Links collection is empty
  console.log("=== Server Started ===");

  if (!Accounts.findUserByEmail(SEED_EMAIL)) {
    createSeedAccount();
  }
});
