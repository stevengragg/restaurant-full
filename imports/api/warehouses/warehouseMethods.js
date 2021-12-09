import { Warehouses } from "../database/wareHouseCollection";

Warehouses.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Warehouses.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const notloggedIn = {
  title: "not-logged-in",
  message: "Please sign in ..",
};

Meteor.methods({
  // Create a warehouse

  warehouseCreate(data) {
    const user = Meteor.userId();
    if (!user) throw new Meteor.Error(notloggedIn.title, notloggedIn.title);
    console.log("warehouseCreate: started", { data, user });
    check(data.warehouseName, String);
    check(data.shortName, String);
    check(data.address, String);
    check(data.type, String);
    // const warehouse = Warehouses.findOne({
    //   shortName: new RegExp(data.shortName),
    // });
    // if (warehouse) {
    //   throw new Meteor.Error(
    //     "warehouse-exists",
    //     "Warehouse with that shortcode is already exists."
    //   );
    // }
    const result = Warehouses.insert({
      warehouseName: data.warehouseName,
      shortName: data.shortName,
      address: data.address,
      type: data.type,
    });
    console.log("warehouseCreate: ended", { result });
    return {
      success: result ? true : false,
      result,
    };
  },
  // Remove a warehouse

  warehouseRemove(data) {
    console.log("warehouseRemove: started", data);
    const user = Meteor.userId();
    if (!user) throw new Meteor.Error(notloggedIn.title, notloggedIn.title);
    check(data.warehouseId, String);
    const warehouseRemoved = Warehouses.remove({ _id: data.warehouseId });
    console.log("warehouseRemove: ended", {
      warehouseId: data.warehouseId,
      warehouseRemoved,
    });
  },
});
