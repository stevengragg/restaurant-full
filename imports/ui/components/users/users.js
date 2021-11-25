import './users.html';
const ise = "Internal Server Error";
const roles = [{
    text: 'Staff',
    role: 'staff'
},
{
    text: 'Admin',
    role: 'admin'
}]

Template.users.onCreated(function () {
    console.log('users')
    this.isViewingUser = new ReactiveVar()
    this.isViewingUser.set({bool: false,userId: ''})
    this.autorun(() => {
        this.subscribe('user.systemUsers');
    })
    console.log(Meteor.users.find().fetch())
})

Template.users.helpers({
    userRolesHelper() { return roles; },
    systemUsers () { 
        return Meteor.users.find({_id: { $ne: Meteor.userId() }}).fetch().map( user => {
            return { _id: user._id, email: user.emails[0].address, role: user.profile.role }
        })
    },
    isViewingUser() {
        const instance = Template.instance();
        const getSessionisViewingUser = instance.isViewingUser.get()
        console.log(getSessionisViewingUser)
        if(getSessionisViewingUser.bool) return getSessionisViewingUser.userId;
        else return false;
    },
    showUser(userId) {
        console.log(Meteor.users.find({_id: userId}, { limit: 1}).fetch().map( user => {
            return { _id: user._id, email: user.emails[0].address, role: user.profile.role, name: `${user.profile.firstName} ${user.profile.lastName}` }
        }))
        return Meteor.users.find({_id: userId}, { limit: 1}).fetch().map( user => {
            return { _id: user._id, email: user.emails[0].address, role: user.profile.role, name: `${user.profile.firstName} ${user.profile.lastName}` }
        })
    }
})


Template.users.events({
    'click .js-open-create-user-modal' (event,instance) {
        instance.isViewingUser.set({ bool: false, userId: ""})
        $('#usersModal').modal('show')
    },
    'click .js-create-user' (event,target) {
        event.preventDefault();
        
        const role = target.find('.js-role').value;
        const firstName = target.find('.js-firstName').value;
        const lastName = target.find('.js-lastName').value;
        const email = target.find('.js-email').value;
        const password = target.find('.js-password').value;
        console.log('userObj',{role,firstName,lastName,email,password});
        Meteor.call('userCreate', {role,firstName,lastName,email,password}, (err,res) => {
            if(err) { alert(err.reason); return;}
            if(!res.success) { alert(ise); return; }
            else { $('#usersModal').modal('hide') }
        })
        target.find('.js-firstName').value ="";
        target.find('.js-lastName').value ="";
        target.find('.js-email').value ="";
        target.find('.js-password').value ="";
    },
    'click .js-remove-user' (event,target) {
        console.log(this._id);
        const answer = confirm("Are you sure that you want to remove this user?");
        if(answer) { Meteor.call('userRemove', { userId: this._id}, (err) => { if(err) alert(err.reason); }) }
        else return;   
    },
    'click .js-view-user' (event,instance) {
        console.log(this._id);
        instance.isViewingUser.set({ bool: true, userId: this._id})
        $('#usersModal').modal('show')
    }
})

//Reference
// 'click #saveBtnUser': async (event,target) => {
//     // const target = event.target;
//     event.preventDefault();
//     const nfullname = target.find('#nfullname').value