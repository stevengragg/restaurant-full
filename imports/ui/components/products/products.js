import "./products.html";
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
  "Bag",
  "Bucket",
  "Bottle",
  "Box",
  "Centimeter",
  "Case",
  "Carton",
  "Dozen",
  "Foot",
  "Gallon",
  "Inches",
  "Kit",
  "Lot",
  "Meter",
  "Milimeter",
  "Piece",
  "Pack",
  "Pair",
  "Rack",
  "Roll",
  "Set",
  "Sachet",
  "Sheet",
  "Square FT",
  "Tube",
  "Yard",
];

Template.products.onCreated(function () {
  console.log("products");
  this.autorun(() => {
    this.subscribe("product.getProducts");
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
  "click .js-redirect-create-product-route"() {
    $("#productModal").modal("show");
  },
});

Template.new_product.events({
  "click .js-go-back-products-route"() {
    FlowRouter.go("products");
  },
});
