import "./products.html";
import "../log-note/log-note.js";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Products } from "../../../api/database/productsCollection";
const productTypes = ["Storable Product", "Consumable"];
const productCategory = [
  "Ingredient",
  "Utensil",
  "Equipment",
  "Expenses",
  "Saleable",
];
const productUOM = [
  "Units",
  "kg",
  "g",
  "mg",
  "Bag",
  "Bucket",
  "Bottle",
  "Box",
  "Centimeter",
  "Case",
  "Carton",
  "Dozen",
  "Ft",
  "Gallon",
  "Grams",
  "Inches",
  "Kit",
  "Lot",
  "Liters",
  "Meter",
  "Milimeter",
  "mL(MiliLiter)",
  "Piece",
  "Pack",
  "Pair",
  "Rack",
  "Roll",
  "Set",
  "Sachet",
  "Sheet",
  "Square Ft",
  "Tube",
  "Yard",
];

Session.setDefault("productFetchLimit", 6);

Template.products.onCreated(function () {
  console.log("products");
  this.autorun(() => {
    this.subscribe("user.systemUsers");
    this.subscribe("product.getProducts", Session.get("productFetchLimit"));
  });
});

Template.products.helpers({
  products() {
    return Products.find();
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
Template.products.events({
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
  "click .js-view-product"(e, target) {
    e.preventDefault();
    // TODO: View product
    console.log(this._id);
    FlowRouter.go("product", { _id: this._id });
  },
  "click .js-load-more-products"(e) {
    let currentLimit = Session.get("productFetchLimit");
    const totalProducts = Products.find({}, { fields: { _id: 1 } }).count();
    if (totalProducts < 6) return;
    currentLimit += 6;
    Session.set("productFetchLimit", currentLimit);
  },
});

Template.product.onCreated(function () {
  Session.set("editingproductName", false);
  Session.set("editingproductType", false);
  Session.set("editingproductSalesPrice", false);
  Session.set("editingproductCost", false);
  Session.set("editingproductCategory", false);
  Session.set("editinginternalReference", false);
  Session.set("editinginternalNotes", false);
  Session.set("editingproductUOM", false);
  Session.set("editingproductVolume", false);

  this.editName = new ReactiveVar(false);
  this.getProductId = () => FlowRouter.getParam("_id");
  this.autorun(() => {
    this.subscribe("user.systemUsers");
    const getProductReady = this.subscribe(
      "product.getProduct",
      this.getProductId()
    );
    if (getProductReady.ready()) {
      const product = Products.findOne(
        { _id: this.getProductId() },
        { fields: { _id: 1 } }
      );
      if (!product) {
        alert("Product not found");
        FlowRouter.go("products");
      }
    }
  });
});

Template.product.events({
  "click .js-go-back-products-route"() {
    FlowRouter.go("products");
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
  // "change .js-edit-text-field"(e, instance) {
  //   const textfieldval = e.currentTarget.value;
  //   console.log("");
  //   if (!textfieldval) return;
  //   const update = Products.update(
  //     { _id: instance.getProductId() },
  //     { $set: { productName } }
  //   );
  //   console.log(update);
  //   instance.editName.set(false);
  // },
});

Template.product.helpers({
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

Template.product.onDestroyed(function () {
  Session.set("editingproductName", false);
  Session.set("editingproductType", false);
  Session.set("editingproductSalesPrice", false);
  Session.set("editingproductCost", false);
  Session.set("editingproductCategory", false);
  Session.set("editinginternalReference", false);
  Session.set("editinginternalNotes", false);
  Session.set("editingproductUOM", false);
  Session.set("editingproductVolume", false);
});
