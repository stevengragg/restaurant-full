import {Vendors} from '../../api/database/vendorsCollection.js';


Meteor.publish('vendor.getVendors', function () {
    const userId = Meteor.userId();
    if (!userId) return this.stop();
    return Vendors.find({});
});
