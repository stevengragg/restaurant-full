import "./transfers.html";

import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Transfers } from "../../../api/database/transfersCollection.js";
import { Vendors } from "../../../api/database/vendorsCollection.js";
import { Warehouses } from "../../../api/database/wareHouseCollection";
import { Products } from "../../../api/database/productsCollection";

Template.transfers.onCreated(function () {
  console.log("transfers");
  this.isReceipt = new ReactiveVar(false);
  this.isInternalDelivery = new ReactiveVar(false);
  this.autorun(() => {
    this.subscribe("transfer.getTransfers");
    this.subscribe("product.getProducts", Session.get('productFetchLimit'));
    this.subscribe("vendor.getVendors");
    this.subscribe("warehouse.getWarehouses");
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
    return Products.find();
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
      transferCode = `${shortName}/IN/${countOfReceipts}`;
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
      transferCode = `${shortName}/OUT/${countOfReceipts}`;
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
  // Session.set("editingproductName", false);
  // Session.set("editingproductType", false);
  // Session.set("editingproductSalesPricee", false);
  // Session.set("editingproductCost", false);
  // Session.set("editingproductCategory", false);
  // Session.set("editinginternalReference", false);
  // Session.set("editinginternalNotes", false);
  // Session.set("editingproductUOM", false);
  // Session.set("editingproductVolume", false);
  // this.editName = new ReactiveVar(false);
  // this.getTransferId = () => FlowRouter.getParam("_id");
  // this.autorun(() => {
  //   const getProductReady = this.subscribe(
  //     "transfer.getTransfer",
  //     this.getTransferId()
  //   );
  //   if (getProductReady.ready()) {
  //     const product = Transfers.findOne(
  //       { _id: this.getTransferId() },
  //       { fields: { _id: 1 } }
  //     );
  //     if (!product) {
  //       alert("Transfer entry not found");
  //       FlowRouter.go("transfers");
  //     }
  //   }
  // });
});

Template.transfer.events({
  // "click .js-go-back-products-route"() {
  //   FlowRouter.go("transfers");
  // },
  // "click .js-edit-productName"(e, instance) {
  //   Session.set("editingproductName", true);
  // },
  // "click .js-edit-productType"(e, instance) {
  //   Session.set("editingproductType", true);
  // },
  // "click .js-edit-productSalesPrice"(e, instance) {
  //   Session.set("editingproductSalesPrice", true);
  // },
  // "click .js-edit-productCost"(e, instance) {
  //   Session.set("editingproductCost", true);
  // },
  // "click .js-edit-productCategory"(e, instance) {
  //   Session.set("editingproductCategory", true);
  // },
  // "click .js-edit-internalReference"(e, instance) {
  //   Session.set("editinginternalReference", true);
  // },
  // "click .js-edit-internalNotes"(e, instance) {
  //   Session.set("editinginternalNotes", true);
  // },
  // "click .js-edit-productUOM"(e, instance) {
  //   Session.set("editingproductUOM", true);
  // },
  // "click .js-edit-productVolume"(e, instance) {
  //   Session.set("editingproductVolume", true);
  // },
});

Template.transfer.helpers({
  // product() {
  //   return Products.findOne({ _id: Template.instance().getProductId() });
  // },
  // isEditing(field) {
  //   return Session.get(`editing${field}`);
  // },
  // productTypeHelper() {
  //   return productTypes;
  // },
  // productCategoryHelper() {
  //   return productCategory;
  // },
  // productUOMHelper() {
  //   return productUOM;
  // },
});

Template.transfer.onDestroyed(function () {
  // Session.set("editingproductName", false);
  // Session.set("editingproductType", false);
  // Session.set("editingproductSalesPricee", false);
  // Session.set("editingproductCost", false);
  // Session.set("editingproductCategory", false);
  // Session.set("editinginternalReference", false);
  // Session.set("editinginternalNotes", false);
  // Session.set("editingproductUOM", false);
  // Session.set("editingproductVolume", false);
});
