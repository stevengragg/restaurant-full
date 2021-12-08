import "./vendors.html";
import { Vendors } from "../../../api/database/vendorsCollection.js";
const ise = "Internal Server Error";
const types = [
  {
    text: "Company",
    type: "company",
  },
  {
    text: "Individual",
    type: "individual",
  },
];

Template.vendors.onCreated(function () {
  console.log("vendors");
  this.isViewingVendor = new ReactiveVar();
  this.isViewingVendor.set({ bool: false, vendorId: "" });
  this.autorun(() => {
    this.subscribe("vendor.getVendors");
  });
  console.log(Vendors.find().fetch());
});

Template.vendors.helpers({
  vendorContactTypeHelper() {
    return types;
  },
  vendorContacts() {
    return Vendors.find({});
  },
  isViewingVendor() {
    const instance = Template.instance();
    const getSessionisViewingVendor = instance.isViewingVendor.get();
    console.log(getSessionisViewingVendor);
    if (getSessionisViewingVendor.bool)
      return getSessionisViewingVendor.vendorId;
    else return false;
  },
  showVendor(vendorId) {
    return Vendors.find({ _id: vendorId }).fetch();
  },
});

Template.vendors.events({
  "click .js-open-create-vendor-modal"(event, instance) {
    instance.isViewingVendor.set({ bool: false, vendorId: "" });
    $("#vendorsModal").modal("show");
  },
  "click .js-create-vendor-contact"(event, target) {
    event.preventDefault();
    const type = target.find(".js-type").value;
    const name = target.find(".js-name").value;
    const address = target.find(".js-address").value;
    const email = target.find(".js-email").value;
    const mobile = target.find(".js-mobile").value;
    const internalNotes = target.find(".js-internal-notes").value;
    console.log("vendorObj", {
      type,
      name,
      address,
      email,
      mobile,
      internalNotes,
    });
    Meteor.call(
      "vendorCreate",
      { type, name, address, email, mobile, internalNotes },
      (err, res) => {
        if (err) {
          alert(err.reason);
          return;
        }
        if (!res.success) {
          alert(ise);
          return;
        } else {
          $("#vendorsModal").modal("hide");
        }
      }
    );

    target.find(".js-name").value = "";
    target.find(".js-address").value = "";
    target.find(".js-email").value = "";
    target.find(".js-mobile").value = "";
    target.find(".js-internal-notes").value = "";
  },
  "click .js-remove-vendor"(event, target) {
    console.log(this._id);
    const answer = confirm(
      "Are you sure that you want to remove this contact?"
    );
    if (answer) {
      Meteor.call("vendorRemove", { vendorId: this._id }, (err) => {
        if (err) alert(err.reason);
      });
    } else return;
  },
  "click .js-view-vendor"(event, instance) {
    console.log(this._id);
    instance.isViewingVendor.set({ bool: true, vendorId: this._id });
    $("#vendorsModal").modal("show");
  },
});
