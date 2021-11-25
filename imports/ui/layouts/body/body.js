import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './body.html';


Template.header.events({
    'click .js-app-logout' (event) {
        event.preventDefault();
        console.log('Logging out of the app')
        Meteor.logout((err) => {
            if(err) console.log(err.reasons);
            FlowRouter.go('signin')
        });
    }
})


Template.header.helpers({
    isHomeActive() {
      FlowRouter.watchPathChange();
      return FlowRouter.current().path.indexOf('/dashboard') === 0;
    },
    isInventoryActive() {
        FlowRouter.watchPathChange();
        return FlowRouter.current().path.indexOf('/inventory') === 0;
    },
    isProductsActive() {
        FlowRouter.watchPathChange();
        return FlowRouter.current().path.indexOf('/products') === 0;
    },
    isOperationsActive() {
        FlowRouter.watchPathChange();
        return ['/transfers', '/inventory-adjustments'].find(path => FlowRouter.current().path.indexOf(path) === 0);
    },
    isConfigurationsActive() {
        FlowRouter.watchPathChange();
        return ['/users','/vendors', '/warehouses'].find(path => FlowRouter.current().path.indexOf(path) === 0);
    }
})