import { Transfers } from "../../api/database/transfersCollection.js";

Transfers.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Transfers.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const notloggedIn = {
  title: "not-logged-in",
  message: "Please sign in ..",
};

Meteor.methods({
  // Create a transfer
  transferCreate(data) {},
});
