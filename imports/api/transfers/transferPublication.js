import { Transfers } from "../../api/database/transfersCollection.js";

Meteor.publish("transfer.getTransfers", function () {
  const userId = Meteor.userId();
  if (!userId) return this.stop();
  return Transfers.find({});
});

Meteor.publish("transfer.getTransfer", function (transferId) {
  const userId = Meteor.userId();
  if (!userId) return this.stop();
  return Transfers.find({ _id: transferId });
});
