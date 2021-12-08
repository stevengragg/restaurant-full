import { Products } from "../../api/database/productsCollection.js";

Products.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Products.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const notloggedIn = {
  title: "not-logged-in",
  message: "Please sign in ..",
};

Meteor.methods({
  // TODO: do not remove the product if its responsible to any process
  // TODO: update product information

  // Create a product contact

  productCreate(data) {
    const user = Meteor.userId();
    if (!user) throw new Meteor.Error(notloggedIn.title, notloggedIn.title);
    console.log("productCreate: started", { user, data });
    check(data.productName, String);
    check(data.productType, String);
    check(data.productSalesPrice, Number);
    check(data.productCost, Number);
    check(data.productCategory, String);
    check(data.internalReference, String);
    check(data.internalNotes, String);
    // check(data.productUnitQuantity, String);
    check(data.productUOM, String);
    check(data.productVolume, Number);

    const result = Products.insert({
      ...data,
      inventoryQuantity: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      createdBy: user,
    });

    console.log("productCreate: ended", { result });
    return {
      success: result ? true : false,
      result,
    };
  },
  // Remove a vendor contact

  productRemove(data) {
    const user = Meteor.userId();
    if (!user) throw new Meteor.Error(notloggedIn.title, notloggedIn.title);
    console.log("productRemove: started", { user, data });

    check(data.productId, String);
    const vendorRemoved = Products.remove({ _id: data.productId });
    console.log("productRemove: ended", { data, vendorRemoved });
    return {
      success: result === true,
      vendorRemoved,
    };
  },
  //Update any fields of the product

  productUpdate(productId, data) {
    const user = Meteor.userId();
    if (!user) throw new Meteor.Error(notloggedIn.title, notloggedIn.title);
    console.log("productUpdate: started", { user, data, productId });
    check(data, Object);
    check(productId, String);
    const updateProduct = Products.update({ _id: productId }, { $set: data });
    console.log("productUpdate: ended", { data, productId, updateProduct });
    return {
      success: updateProduct === true,
      updateProduct,
    };
  },
});
