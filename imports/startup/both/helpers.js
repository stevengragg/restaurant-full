// Checking if current user is Admin
isAdmin = (userId = Meteor.userId()) => { 
    const adminUserIds = Meteor.settings.public.wglr.admins;
    return (isStaging() && _.contains(adminUserIds, userId)) || (isProduction() && _.contains(adminUserIds, userId));
}
  
// Check if current Wiggler is on the production
isProduction = () => Meteor.settings.public.wglr.production;
// Check if current wiggler is on testing or development/local environment
isStaging = () => Meteor.settings.public.wglr.staging;