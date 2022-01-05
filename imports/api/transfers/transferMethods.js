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
  transferCreate(data) {
    const user = Meteor.userId();
    if (!user) throw new Meteor.Error(notloggedIn.title, notloggedIn.title);
    console.log("transferCreate: started", { user, data });
    check(data, Object);

    const transferId = Transfers.insert({
      ...data,
      done: 0,
      status: "draft",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      approvedBy: "",
      isValidated: false,
      createdBy: user,
    });

    console.log("transferCreate: ended", { transferId });
    return {
      success: transferId ? true : false,
      transferId,
    };
  },
});
