import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './signin.html'

Template.loginForm.events({
    // When Sign In BUTTON is clicked, form is submitted
    'submit .js-login-form' (event) {
        // Prevent default browser form submit
        event.preventDefault();
  
        // Get value from form element
        const target = event.target;
        const email =  target._email.value;
        const password = target._password.value;
        // Pass email and pasword to loginWithPassword method to Login to the SYSTEM
        Meteor.loginWithPassword(email, password, (err) => {
            if(err) { alert(err.reason); } // alert when error happens while logging in
            if(Meteor.userId()){ FlowRouter.go('dashboard') } // redirect to dashboard upon successful signin   
        })
    }
})