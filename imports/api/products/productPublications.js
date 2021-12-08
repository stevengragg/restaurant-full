import { Products } from "../../api/database/productsCollection.js";

Meteor.publish("product.getProducts", function () {
  const userId = Meteor.userId();
  if (!userId) return this.stop();
  return Products.find({});
});

Meteor.publish("product.getProduct", function (productId) {
  const userId = Meteor.userId();
  if (!userId) return this.stop();
  return Products.find({ _id: productId });
});
