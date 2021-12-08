// User Server Definition
import { Inventory } from "../../api/database/inventoryCollection";
// Do not Allow editing, inserting and Removing data of a User inside a client
Inventory.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Inventory.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Meteor.methods({
  // Adding items to inventory
  inventoryCreateItem(data) {
    const currentLoggedInUser = Meteor.userId();
    console.log("inventoryCreateItem: start", {
      currentLoggedInUser,
      itemName: data.itemName,
      quantity: data.quantity,
      unitOfMeasure: data.unitOfMeasure,
    });
    check(data.itemName, String);
    check(data.quantity, Number);
    check(data.unitOfMeasure, String);

    // if not log in throw an error
    if (!currentLoggedInUser)
      throw new Meteor.Error(
        "not logged in",
        "Hey men! Please login first before proceeding."
      );

    // Insert data on Inventory collection
    return Inventory.insert({
      itemName: data.itemName,
      quantity: data.quantity,
      unitOfMeasure: data.unitOfMeasure,
      addedAt: new Date(),
    });
  },
});
