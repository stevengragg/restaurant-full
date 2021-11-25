import {Products} from '../../api/database/productsCollection.js';



const notloggedIn = {
    title: 'not-logged-in',
    message: 'Please sign in ..'
}

Meteor.methods({
    // TODO: do not remove the product if its responsible to any process
    // TODO: update product information




  
    // Create a product contact 

    productCreate (data) {
        console.log('productCreate: started', data);
        // check(data.productName, String);
        // check(data.productType, String);
        // check(data.productSalesPrice, String);
        // check(data.productCost, String);
        // check(data.productCategory, String);
        // check(data.internalReference, String);
        // check(data.internalNotes, String);
        // check(data.productUnitQuantity, String);
        // check(data.productUOM, String);
        // check(data.productVolumePerUOM, Float32Array);

        const result = Products.insert({

        })
        console.log('productCreate: ended', {result});
        return {
            success: result ? true : false,
            result
        }
    },
    // Remove a vendor contact

    productRemove(data) {
        console.log('productRemove: started', data);
        const user = Meteor.userId();
        if(!user) throw new Meteor.Error(notloggedIn.title,notloggedIn.title);
        check(data.productId, String);
        const vendorRemoved = Products.remove({ _id: data.productId})
        console.log('productRemove: ended', {data, vendorRemoved});
    }
})