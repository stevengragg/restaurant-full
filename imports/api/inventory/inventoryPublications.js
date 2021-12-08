import { Inventory } from "../../api/database/inventoryCollection";
// Connection to fetch Inventory data and display to the table
Meteor.publish("inventory.inventoryAll", function () {
  const userId = Meteor.userId();
  if (!userId) return this.stop();
  return Inventory.find({});
});
