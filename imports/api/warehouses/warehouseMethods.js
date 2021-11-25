import {Warehouses} from '../database/wareHouseCollection';



const notloggedIn = {
    title: 'not-logged-in',
    message: 'Please sign in ..'
}

Meteor.methods({

    // Create a warehouse

    warehouseCreate (data) {
        console.log('warehouseCreate: started', data);
        // check(data.warehouseName, String);
        // check(data.shortName, String);
        // check(data.address, String);

        const result = Warehouses.insert({
            warehouseName: data.warehouseName,
            shortName: data.shortName,
            address: data.address,
        })
        console.log('warehouseCreate: ended', {result});
        return {
            success: result ? true : false,
            result
        }
    },
    // Remove a warehouse

    warehouseRemove(data) {
        console.log('warehouseRemove: started', data);
        const user = Meteor.userId();
        if(!user) throw new Meteor.Error(notloggedIn.title,notloggedIn.title);
        check(data.warehouseId, String);
        const warehouseRemoved = Warehouses.remove({ _id: data.warehouseId})
        console.log('warehouseRemove: ended', {warehouseId: data.warehouseId, warehouseRemoved});
    }
})