
import './inventory.html';
import { Inventory } from './../../../api/database/inventoryCollection.js';
let numbers = [];
for(let i = 1; i <= 1000; i++){
    numbers[i] = i;
}

const uom = ['kg', 'g', 'L', 'mL', 'pack', 'sack', 'sachet', 'piece(s)']

Template.inventory.onCreated(function () { 
    this.subscribe('inventory.inventoryAll')
})

Template.inventory.helpers({
    items () { return Inventory.find({}) }, // Items helper incharge of displaying data to the Table
    quantities () { return numbers; },
    uom () { return uom; }
})


Template.inventory.events({
    // When Add item BUTTON is clicked this happens
    'click .js-add-item' (event,target) {
        event.preventDefault();
        //Gets the value of all the fields
        const itemName = target.find('#itemName').value; 
        const quantity = Number(target.find('#quantity').value);
        const unitOfMeasure = target.find('#uom').value;
        //Call inventoryCreateItem from the server to pass these values
        Meteor.call('inventoryCreateItem', {itemName, quantity, unitOfMeasure}, (err,res) =>{
            if(err) alert(err.reason); // Alert when error happens
            if(!res) alert('Internal Server Error, Please contact support.') // Alert when insert to database fails
        })
    }
})