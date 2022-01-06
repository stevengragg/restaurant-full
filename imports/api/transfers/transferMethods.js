import { Transfers } from "../../api/database/transfersCollection.js";
import { Products } from "../../api/database/productsCollection";

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
    let transferId;
    if(data.operationType === "Internal Delivery"){
      //subtract
      const product = Products.findOne({ _id: data.productId})
      console.log(product.inventoryQuantity)
      if(product && product.inventoryQuantity <= 0 ) {
        console.log("error1")
        throw new Meteor.Error("creation-error", "Unable to process internal delivery. The product selected is empty.");
      } 
      if(Number(data.demand) > product.inventoryQuantity) {
        console.log("error2")
        throw new Meteor.Error("creation-error", "Unable to process internal delivery. The product demand for this transfer is greater than the inventory quantity of the product.");
      }

    }
      transferId = Transfers.insert({
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

  //Update any fields of the transfers

  transferUpdate(transferId, data) {
    const user = Meteor.userId();
    if (!user) throw new Meteor.Error(notloggedIn.title, notloggedIn.title);
    console.log("transferUpdate: started", { user, data, transferId });
    check(data, Object);
    check(transferId, String);
    const updateTransfer = Transfers.update({ _id: transferId }, { $set: data });
    console.log("transferUpdate: ended", { data, transferId, updateTransfer });
    return {
      success: updateTransfer === true,
      updateTransfer,
    };
  },

// Discard transfer
  transferDiscard (data) {
    const user = Meteor.userId();
    if (!user) throw new Meteor.Error(notloggedIn.title, notloggedIn.title);
    console.log("transferDiscard: started", { user, transferId: data.transferId });
    check(data.transferId, String);
    const remove = Transfers.remove({ _id: data.transferId });
    console.log("transferDiscard: ended", {  user, transferId: data.transferId, remove });
    return {
      success: remove === true,
      remove,
    };

  },

//Validate Transfer
transferValidate (data) {
    const user = Meteor.userId();
    if (!user) throw new Meteor.Error(notloggedIn.title, notloggedIn.title);
    console.log("transferValidate: started", { user, transferId: data.transferId });
    check(data.transferId, String);
    const transfer = Transfers.findOne({ _id: data.transferId });
    const product =  Products.findOne({ _id: transfer.productId });
    const updateTransfer = Transfers.update(
      { _id: data.transferId }, 
      { 
        $set: 
        { 
          status: "validated",
          done: transfer.demand,
          approvedBy: user,
          isValidated: true
        }
      });
      let productUpdate;
    if(transfer.operationType === "Internal Delivery"){
      console.log("Internal Delivery")
      const currentQty = product.inventoryQuantity;
      const resultQty = currentQty - transfer.demand
      productUpdate = Products.update({ _id: transfer.productId }, { $set: { inventoryQuantity: resultQty }})
    }else {
      console.log("Receipts")
      const currentQty = product.inventoryQuantity;
      const resultQty = currentQty + transfer.demand;
      productUpdate = Products.update({ _id: transfer.productId }, { $set: { inventoryQuantity: resultQty }})
    }
    
    console.log("transferValidate: ended", {  user, transferId: data.transferId, updateTransfer, productUpdate });
    return {
      success: updateTransfer && productUpdate,
      updateTransfer,
    };

  },
});
