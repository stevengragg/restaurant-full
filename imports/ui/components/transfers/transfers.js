import "./transfers.html";

import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Transfers } from "../../../api/database/transfersCollection.js";
import { Vendors } from "../../../api/database/vendorsCollection.js";
import { Warehouses } from "../../../api/database/wareHouseCollection";
import { Products } from "../../../api/database/productsCollection";
function keyGen(keyLength) {
  var i, key = "", characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  var charactersLength = characters.length;

  for (i = 0; i < keyLength; i++) {
      key += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
  }

  return key;
}
Template.transfers.onCreated(function () {
  console.log("transfers");
  this.isReceipt = new ReactiveVar(false);
  this.isInternalDelivery = new ReactiveVar(false);
  this.autorun(() => {
    this.subscribe("transfer.getTransfers");
    this.subscribe("vendor.getVendors");
    this.subscribe("warehouse.getWarehouses");
    this.subscribe("user.systemUsers");
    this.subscribe("product.getProducts", false);
  });
});

Template.transfers.helpers({
  transfers() {
    return Transfers.find();
  },
  vendors() {
    return Vendors.find({}, { fields: { name: 1 } });
  },
  isReceipt() {
    return Template.instance().isReceipt.get();
  },
  isInternalDelivery() {
    return Template.instance().isInternalDelivery.get();
  },
  warehouses() {
    return Warehouses.find({ type: "Stock" }, { fields: { warehouseName: 1 } });
  },
  deliverTo() {
    return Warehouses.find(
      { type: "Restaurant" },
      { fields: { warehouseName: 1 } }
    );
  },
  products() {
    return Products.find({},{fields: { productName: 1}});
  },
});

Template.transfers.events({
  "change .js-operationType"(e, instance) {
    const operationType = e.currentTarget.value;
    if (operationType === "Receipts") {
      instance.isReceipt.set(true);
      instance.isInternalDelivery.set(false);
    } else if (operationType === "Internal Delivery") {
      instance.isReceipt.set(false);
      instance.isInternalDelivery.set(true);
    } else {
      instance.isReceipt.set(false);
      instance.isInternalDelivery.set(false);
    }
  },
  "click .js-create-transfer"(event, target) {
    event.preventDefault();
    let data = {};
    let transferCode = "";
    const operationType = target.find(".js-operationType").value;
    if (!operationType) {
      alert("Please select operation type");
      return;
    }
    data = {
      operationType,
      productId: target.find(".js-productId").value,
      demand: Number(target.find(".js-demand").value),
      sourceDocument: target.find(".js-sourceDocument").value,
      internalNotes: target.find(".js-internalNotes").value,
    };

    if (operationType === "Receipts") {
      let countOfReceipts = Transfers.find({
        operationType,
        destinationLocation: target.find(".js-destinationLocation").value,
      }).count();
      data.receiveFrom = target.find(".js-receiveFrom").value;
      data.destinationLocation = target.find(".js-destinationLocation").value;
      const { shortName } = Warehouses.findOne(
        { _id: target.find(".js-destinationLocation").value },
        { fields: { shortName: 1 } }
      );
      console.log(shortName);
      countOfReceipts += 1;
      console.log(countOfReceipts);
      transferCode = `${shortName}/IN/${keyGen(5)}`;
    } else if (operationType === "Internal Delivery") {
      let countOfReceipts = Transfers.find({
        operationType,
        sourceLocation: target.find(".js-sourceLocation").value,
      }).count();
      data.deliveryTo = target.find(".js-deliveryTo").value;
      data.sourceLocation = target.find(".js-sourceLocation").value;
      const { shortName } = Warehouses.findOne(
        { _id: target.find(".js-sourceLocation").value },
        { fields: { shortName: 1 } }
      );
      console.log(shortName);
      countOfReceipts += 1;
      console.log(countOfReceipts);
      transferCode = `${shortName}/OUT/${keyGen(5)}`;
    }
    console.log(transferCode);
    data.transferCode = transferCode;

    console.log("transferObj", {
      data,
    });
    Meteor.call("transferCreate", data, (err, res) => {
      if (err) {
        alert(err.reason);
        return;
      }
      if (!res || !res.success || !res.transferId) {
        alert("Internal Server Error: 413e");
        return;
      } else {
        $("#transferModal").modal("hide");
        FlowRouter.go("transfer", { _id: res.transferId });
      }
    });

    target.find(".js-productId").value = "";
    target.find(".js-demand").value = "";
    target.find(".js-sourceDocument").value = "";
    target.find(".js-internalNotes").value = "";
  },
  "click .js-view-transfer"(e, event) {
    e.preventDefault();
    // TODO: View product
    console.log(this._id);
    FlowRouter.go("transfer", { _id: this._id });
  },
});

Template.transfer.onCreated(function () {
  Session.set("status", "")
  Session.set("editingproductId", false);
  Session.set("editingdemand", false);
  Session.set("editingoperationType", false);
  Session.set("editingreceiveFrom", false);
  Session.set("editingdeliveryTo", false);
  Session.set("editingdestinationLocation", false);
  Session.set("editingsourceLocation", false);
  Session.set("editingsourceDocument", false);
  Session.set("editinginternalNotes", false);
  // this.editName = new ReactiveVar(false);
  this.getTransferId = () => FlowRouter.getParam("_id");
  this.autorun(() => {
    this.subscribe("vendor.getVendors");
    this.subscribe("warehouse.getWarehouses");
    this.subscribe("user.systemUsers");
    this.subscribe("product.getProducts", false);
    const getTransferReady = this.subscribe(
      "transfer.getTransfer",
      this.getTransferId()
    );
    if (getTransferReady.ready()) {
      const transfer = Transfers.findOne(
        { _id: this.getTransferId() },
        { fields: { _id: 1, status: 1 } }
      );
      if (!transfer) {
        alert("Transfer entry not found");
        FlowRouter.go("transfers");
      }
      Session.set("status", transfer.status);
    }
  });
});

Template.transfer.events({
  "click .js-discard"(e,instance) {
    const answer = confirm(
    "Are you sure that you want to remove this transfer? Changes done will be removed."
    );
    if(answer){
      Meteor.call("transferDiscard", { transferId:  instance.getTransferId() });
      FlowRouter.go("transfer");
    }
    
  },
  "click .js-go-back-transfers"() {
    FlowRouter.go("transfers");
  },
  "click .js-validate-transfer" (e, instance) {
    //validate the transfer entry
    Meteor.call("transferValidate", { transferId:  instance.getTransferId() }, (err) => {
      if (err) {
        alert(err.reason);
        return;
      }
    });
  },
  "click .js-reject-transfer" (e, instance) {
    // reject transfer entry
    Meteor.call('transferUpdate', instance.getTransferId(), { status: "rejected"})
  },
  "click .js-draft-transfer" (e, instance) {
    //draft the transfer entry
    Meteor.call('transferUpdate', instance.getTransferId(), { status: "draft"})
  },
  "click .js-ready-transfer" (e, instance) {
    // ready transfer entry
    Meteor.call('transferUpdate', instance.getTransferId(), { status: "ready"})
  },
  "click .js-edit-productId"() {
    Session.set("editingproductId", true);
  },
  "click .js-edit-demand"(e, instance) {
    Session.set("editingdemand", true);
  },
  "click .js-edit-operationType"(e, instance) {
    Session.set("editingoperationType", true);
  },
  "click .js-edit-receiveFrom"(e, instance) {
    Session.set("editingreceiveFrom", true);
  },
  "click .js-edit-deliveryTo"(e, instance) {
    Session.set("editingdeliveryTo", true);
  },
  "click .js-edit-destinationLocation"(e, instance) {
    Session.set("editingdestinationLocation", true);
  },
  "click .js-edit-sourceLocation"(e, instance) {
    Session.set("editingsourceLocation", true);
  },
  "click .js-edit-sourceDocument"(e, instance) {
    Session.set("editingsourceDocument", true);
  },
  "click .js-edit-internalNotes"(e, instance) {
    Session.set("editinginternalNotes", true);
  },
});

Template.transfer.helpers({
  transfer() {
    return Transfers.findOne({ _id: Template.instance().getTransferId() });
  },
  isEditing(field) {
    return Session.get(`editing${field}`);
  },
  operationTypeHelper() {
    const operationType = ["Receipts", "Internal Delivery"];
    return operationType;
  },
});

Template.transfer.onDestroyed(function () {
  Session.set("status", "");
  Session.set("editingproductId", false);
  Session.set("editingdemand", false);
  Session.set("editingoperationType", false);
  Session.set("editingreceiveFrom", false);
  Session.set("editingdeliveryTo", false);
  Session.set("editingdestinationLocation", false);
  Session.set("editingsourceLocation", false);
  Session.set("editingsourceDocument", false);
  Session.set("editinginternalNotes", false);
});
