import moment from "moment";
import { Warehouses } from "../../api/database/wareHouseCollection.js";
import { Vendors } from "../../api/database/vendorsCollection.js";
Template.registerHelper("get", (obj, propName) => obj && obj[propName]);
Template.registerHelper("eq", (a, b) => a === b);
Template.registerHelper(
  "neq",
  (a, b) => /* eslint-disable eqeqeq */ a != b /* eslint-enable eqeqeq */
);
Template.registerHelper("gt", (a, b) => a > b);
Template.registerHelper("gte", (a, b) => a >= b);
Template.registerHelper("lt", (a, b) => a < b);
Template.registerHelper("lte", (a, b) => a <= b);
Template.registerHelper("and", (a, b) => a && b);
Template.registerHelper("or", (a, b) => a || b);
Template.registerHelper("not", (a) => !a);
Template.registerHelper("num", (a) => a || 0);
Template.registerHelper("int", (a) => +a);
Template.registerHelper("Session", (a) => Session.get(a));

// App

Template.registerHelper("isAdmin", () => isAdmin());

// User

Template.registerHelper(
  "getUser",
  (userId) =>
    Meteor.users.findOne({ _id: userId }).profile.firstName +
    " " +
    Meteor.users.findOne({ _id: userId }).profile.lastName
);

// moment related
Meteor.setInterval(() => Session.set("now", new Date()), 1000);
Template.registerHelper(
  "fromNow",
  (date) => (date && moment(date).from(Session.get("now"))) || "now"
);
Template.registerHelper(
  "getLocal",
  (date) => date && moment.utc(date).local().format("DD MMMM YYYY h:mm a")
);
Template.registerHelper("smallDate", (date) =>
  moment(date).format("MM-DD-YY HH:mm:ss")
);
Template.registerHelper("moment", (date) => moment(date));
Template.registerHelper("formatDate", (date, format) =>
  moment(date).format(format)
);


// Warehouse

Template.registerHelper("getLocation", (docId) => {
  const location = Warehouses.findOne({ _id: docId },{ fields: { warehouseName: 1 }});
  return location.warehouseName || "";
}) 

// Vendors

Template.registerHelper("getReceiveFrom", (docId) => {
  const vendor = Vendors.findOne({ _id: docId },{ fields: { name: 1 }});
  return vendor.name || "";
}) 
