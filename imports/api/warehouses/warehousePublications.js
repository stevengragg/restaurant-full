import {Warehouses} from '../database/wareHouseCollection';


Meteor.publish('warehouse.getWarehouses', function () {
    const userId = Meteor.userId();
    if (!userId) return this.stop();
    return Warehouses.find({});
});
