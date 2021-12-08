Meteor.publish('user.currentUser', function () {
    const userId = Meteor.userId();
    if (!userId) return this.stop();
    return Meteor.users.find({ _id: userId });
});

Meteor.publish('user.systemUsers', function () {
    const userId = Meteor.userId();
    if (!userId) return this.stop();
    return Meteor.users.find({ _id: { $ne: userId }}, { fields: { profile: 1, emails: 1}});
});