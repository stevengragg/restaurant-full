import "./fieldUpdate.html";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
Template.fieldUpdate.onCreated(function () {
  this.getId = () => FlowRouter.getParam("_id");
  this.state = new ReactiveVar("");
  this.message = new ReactiveVar("");
  this.cancel = new ReactiveVar(false);
});

Template.fieldUpdate.helpers({
  state() {
    return Template.instance().state.get();
  },
  message() {
    return Template.instance().message.get() || this.description;
  },
  dom(type, elName) {
    return (
      {
        checkbox: "checkbox",
        text: "input",
        email: "input",
        textarea: "textarea",
        comment: "comment",
        select: "select",
      }[type] === elName
    );
  },
});

Template.fieldUpdate.events({
  "click .js-save"(e, instance) {
    const { doc, key, value, server } = this;

    const val = instance.find(".js-field").value;
    if (val === value || !val) {
      Session.set(`editing${key}`, false);
      return;
    }
    instance.state.set("saving");
    instance.message.set(
      '<div class="spinner-grow" style="width: 1rem; height: 1rem;" role="status">' +
        '<span class="sr-only">Loading...</span>' +
        "</div>" +
        "Saving ..."
    );
    const id = instance.getId();

    Meteor.call(
      server,
      id,
      { [key]: val, lastUpdated: new Date().toISOString() },
      (err, res) => {
        if (err) {
          instance.state.set("failed");
          instance.message.set(`Failed to save. ${err.reason || ""}`);
        }
        if (res && res.success) {
          instance.state.set("saved");
          instance.message.set("Saved!");
        } else {
          instance.state.set("failed");
          instance.message.set("Failed to save. Internal Server Error");
        }

        Meteor.setTimeout(() => {
          instance.state.set("");
          instance.message.set("");
          Session.set(`editing${key}`, false);
        }, 2);
      }
    );

    instance.find(".js-field").value = "";
  },
  "click .js-cancel"(e, instance) {
    const { doc, key } = this;
    Session.set(`editing${key}`, false);
  },
});
