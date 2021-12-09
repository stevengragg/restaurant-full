import "./transfers.html";

import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Transfers } from "../../../api/database/transfersCollection.js";
import { Vendors } from "../../../api/database/vendorsCollection.js";
import { Warehouses } from "../../../api/database/wareHouseCollection";

Template.transfers.onCreated(function () {
  console.log("transfers");
  this.isReceipt = new ReactiveVar(false);
  this.isInternalDelivery = new ReactiveVar(false);
  this.autorun(() => {
    this.subscribe("transfer.getTransfers");
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
  productCategoryHelper() {
    return productCategory;
  },
  productUOMHelper() {
    return productUOM;
  },
});

Template.transfers.events({
  "click .js-create-transfer"() {
    $("#transferModal").modal("show");
  },
  "click .js-create-product"(event, target) {
    event.preventDefault();
    const productType = target.find(".js-productType").value;
    const productName = target.find(".js-productName").value;
    const productSalesPrice = Number(
      target.find(".js-productSalesPrice").value
    );
    const productCost = Number(target.find(".js-productCost").value);
    const productCategory = target.find(".js-productCategory").value;
    const internalReference = target.find(".js-internalReference").value;
    const internalNotes = target.find(".js-internal-notes").value;
    // const productUnitQuantity = target.find(".js-internal-notes").value;
    const productUOM = target.find(".js-productUOM").value;
    const productVolume = Number(target.find(".js-volume").value);
    const data = {
      productType,
      productName,
      productSalesPrice,
      productCost,
      productCategory,
      internalReference,
      internalNotes,
      // productUnitQuantity,
      productUOM,
      productVolume,
    };
    console.log("productObj", {
      data,
    });
    Meteor.call("productCreate", data, (err, res) => {
      if (err) {
        alert(err.reason);
        return;
      }
      if (!res.success) {
        alert("Internal Server Error: 4f03");
        return;
      } else {
        $("#productModal").modal("hide");
      }
    });
    target.find(".js-productType").value = "";
    target.find(".js-productName").value = "";
    target.find(".js-productSalesPrice").value = "";
    target.find(".js-productCost").value = "";
    target.find(".js-productCategory").value = "";
    target.find(".js-internalReference").value = "";
    target.find(".js-internal-notes").value = "";
    target.find(".js-internal-notes").value = "";
    target.find(".js-productUOM").value = "";
    target.find(".js-volume").value = "";
  },
  "click .js-view-product"(e, event) {
    e.preventDefault();
    // TODO: View product
    console.log(this._id);
    FlowRouter.go("product", { _id: this._id });
  },
});

Template.transfer.onCreated(function () {
  Session.set("editingproductName", false);
  Session.set("editingproductType", false);
  Session.set("editingproductSalesPricee", false);
  Session.set("editingproductCost", false);
  Session.set("editingproductCategory", false);
  Session.set("editinginternalReference", false);
  Session.set("editinginternalNotes", false);
  Session.set("editingproductUOM", false);
  Session.set("editingproductVolume", false);

  this.editName = new ReactiveVar(false);
  this.getTransferId = () => FlowRouter.getParam("_id");
  this.autorun(() => {
    const getProductReady = this.subscribe(
      "transfer.getTransfer",
      this.getTransferId()
    );
    if (getProductReady.ready()) {
      const product = Transfers.findOne(
        { _id: this.getTransferId() },
        { fields: { _id: 1 } }
      );
      if (!product) {
        alert("Transfer entry not found");
        FlowRouter.go("transfers");
      }
    }
  });
});

Template.transfer.events({
  "click .js-go-back-products-route"() {
    FlowRouter.go("transfers");
  },
  "click .js-edit-productName"(e, instance) {
    Session.set("editingproductName", true);
  },
  "click .js-edit-productType"(e, instance) {
    Session.set("editingproductType", true);
  },
  "click .js-edit-productSalesPrice"(e, instance) {
    Session.set("editingproductSalesPrice", true);
  },
  "click .js-edit-productCost"(e, instance) {
    Session.set("editingproductCost", true);
  },
  "click .js-edit-productCategory"(e, instance) {
    Session.set("editingproductCategory", true);
  },
  "click .js-edit-internalReference"(e, instance) {
    Session.set("editinginternalReference", true);
  },
  "click .js-edit-internalNotes"(e, instance) {
    Session.set("editinginternalNotes", true);
  },
  "click .js-edit-productUOM"(e, instance) {
    Session.set("editingproductUOM", true);
  },
  "click .js-edit-productVolume"(e, instance) {
    Session.set("editingproductVolume", true);
  },
});

Template.transfer.helpers({
  product() {
    return Products.findOne({ _id: Template.instance().getProductId() });
  },
  isEditing(field) {
    return Session.get(`editing${field}`);
  },
  productTypeHelper() {
    return productTypes;
  },
  productCategoryHelper() {
    return productCategory;
  },
  productUOMHelper() {
    return productUOM;
  },
});

Template.transfer.onDestroyed(function () {
  Session.set("editingproductName", false);
  Session.set("editingproductType", false);
  Session.set("editingproductSalesPricee", false);
  Session.set("editingproductCost", false);
  Session.set("editingproductCategory", false);
  Session.set("editinginternalReference", false);
  Session.set("editinginternalNotes", false);
  Session.set("editingproductUOM", false);
  Session.set("editingproductVolume", false);
});
