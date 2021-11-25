// User Server Definition

// Do not Allow editing ,inserting and Removing data of a User inside a client
Meteor.users.allow({
    insert: () => false,
    update: () => false,
    remove: () => false,
});

Meteor.users.deny({
    insert: () => true,
    update: () => true,
    remove: () => true,
});


const notloggedIn = {
    title: 'not-logged-in',
    message: 'Please sign in ..'
}

Meteor.methods({
    // TODO: do not remove the user if its responsible to any process
    // TODO: update user information




    
    // Create a user 

    userCreate (data) {
        console.log('userCreate: started', data);
        check(data.email, String);
        check(data.password, String);
        check(data.firstName, String);
        check(data.lastName, String);
        check(data.role, String);

        const userId = Accounts.createUser({
            email: data.email, 
            password: data.password,
            profile: { 
                firstName: data.firstName,
                lastName: data.lastName,
            }
        });
        if(userId) {
             // Add Role to the user
            Meteor.call('userAddRole', {userId, role: data.role});
        }
        console.log('userCreate: ended', {userId});
        return {
            success: userId ? true : false,
            userId
        }
    },

    // Add user role

    userAddRole (data) {
        console.log('userAddRole: started', data);
        const user = Meteor.userId();
        if(!user) throw new Meteor.Error(notloggedIn.title,notloggedIn.title);
        check(data.userId, String);
        check(data.role, String);

        let userRoles = Roles.getRolesForUser(data.userId);
        if (userRoles.length == 0) {
            Roles.createRole(data.role, {unlessExists: true});
            Roles.addUsersToRoles(data.userId, data.role);
        } 
        const userUpdated = Meteor.users.update({ _id: data.userId}, { $set: { 'profile.role': data.role }});
        console.log('userAddRole: ended', {userId: data.userId, userUpdated});
    },

    // Remove a user

    userRemove(data) {
        console.log('userRemove: started', data);
        const user = Meteor.userId();
        if(!user) throw new Meteor.Error(notloggedIn.title,notloggedIn.title);
        check(data.userId, String);
        const userRemoved = Meteor.users.remove({ _id: data.userId})
        console.log('userRemove: ended', {userId: data.userId, userRemoved});
    }
})