import "./warehouses.html";
import { Warehouses } from "../../../api/database/wareHouseCollection.js";

const ise = "Internal Server Error";

Template.warehouses.onCreated(function () {
  console.log("warehouse");
  this.isViewingWarehouse = new ReactiveVar();
  this.isViewingWarehouse.set({ bool: false, warehouseId: "" });
  this.autorun(() => {
    this.subscribe("warehouse.getWarehouses");
  });
  console.log(Warehouses.find().fetch());
});

Template.warehouses.helpers({
  warehouseContactTypeHelper() {
    return types;
  },
  warehouseContacts() {
    return Warehouses.find({});
  },
  isViewingWarehouse() {
    const instance = Template.instance();
    const getSessionisViewingWarehouse = instance.isViewingWarehouse.get();
    console.log(getSessionisViewingWarehouse);
    if (getSessionisViewingWarehouse.bool)
      return getSessionisViewingWarehouse.warehouseId;
    else return false;
  },
  showWarehouse(warehouseId) {
    return Warehouses.find({ _id: warehouseId }).fetch();
  },
});

Template.warehouses.events({
  "click .js-open-create-warehouse-modal"(event, instance) {
    instance.isViewingWarehouse.set({ bool: false, warehouseId: "" });
  },
  "click .js-create-warehouse-contact"(event, target) {
    event.preventDefault();

    const warehouseName = target.find(".js-warehouse-name").value;
    const shortName = target.find(".js-warehouse-short-name").value;
    const address = target.find(".js-address").value;
    const type = target.find(".js-type").value;
    console.log("warehouseObj", { warehouseName, shortName, address });
    Meteor.call(
      "warehouseCreate",
      { warehouseName, shortName, type, address },
      (err, res) => {
        if (err) {
          alert(err.reason);
          return;
        }
        if (!res.success) {
          alert(ise);
          return;
        } else {
          $("#warehouseModal").modal("hide");
        }
      }
    );

    target.find(".js-warehouse-name").value = "";
    target.find(".js-warehouse-short-name").value = "";
    target.find(".js-address").value = "";
  },
  "click .js-remove-warehouse"(event, target) {
    console.log(this._id);
    const answer = confirm(
      "Are you sure that you want to remove this warehouse information?"
    );
    if (answer) {
      Meteor.call("warehouseRemove", { warehouseId: this._id }, (err) => {
        if (err) alert(err.reason);
      });
    } else return;
  },
  "click .js-view-warehouse"(event, instance) {
    console.log(this._id);
    instance.isViewingWarehouse.set({ bool: true, warehouseId: this._id });
  },
});
