import { Vendors } from "../../api/database/vendorsCollection.js";

Vendors.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Vendors.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const notloggedIn = {
  title: "not-logged-in",
  message: "Please sign in ..",
};

Meteor.methods({
  // TODO: do not remove the vendor if its responsible to any process
  // TODO: update vendor information

  // Create a vendor contact

  vendorCreate(data) {
    console.log("vendorCreate: started", data);
    check(data.name, String);
    check(data.type, String);
    check(data.address, String);
    check(data.mobile, String);
    check(data.email, String);
    check(data.internalNotes, String);

    const result = Vendors.insert({
      name: data.name,
      type: data.type,
      address: data.address,
      mobile: data.mobile,
      email: data.email,
      internalNotes: data.internalNotes,
    });
    console.log("vendorCreate: ended", { result });
    return {
      success: result ? true : false,
      result,
    };
  },
  // Remove a vendor contact

  vendorRemove(data) {
    console.log("vendorRemove: started", data);
    const user = Meteor.userId();
    if (!user) throw new Meteor.Error(notloggedIn.title, notloggedIn.title);
    check(data.vendorId, String);
    const vendorRemoved = Vendors.remove({ _id: data.vendorId });
    console.log("vendorRemove: ended", {
      vendorId: data.vendorId,
      vendorRemoved,
    });
  },
});
