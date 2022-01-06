import { Products } from "../../api/database/productsCollection.js";

Meteor.publish("product.getProducts", function (limitNumber) {
  const userId = Meteor.userId();
  if (!userId) return this.stop();
  if(!limitNumber) return Products.find({});
  return Products.find({}, {limit: limitNumber});
});

Meteor.publish("product.getProduct", function (productId) {
  const userId = Meteor.userId();
  if (!userId) return this.stop();
  return Products.find({ _id: productId });
});
