Tracker.autorun(() => {
  if (Meteor.userId()) {
    Meteor.subscribe("user.currentUser");
  }
});
