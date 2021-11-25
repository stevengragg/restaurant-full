import {Products} from '../../api/database/productsCollection.js';


Meteor.publish('product.getProducts', function () {
    const userId = Meteor.userId();
    if (!userId) return this.stop();
    return Products.find({});
});