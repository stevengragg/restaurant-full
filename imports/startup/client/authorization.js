// Add authorizations here


const checkRole = (role, authorizedTemplate) => {
  /**
   * Used for page authorization. Returns the template to be rendered.
   *
   * @params role -
   * @params authorizedTemplate - the template to render when user role is met
   * @returns renderTemplate - template name to be rendered when user role is met
   * */

  const isLoggedIn = !Meteor.loggingIn() && Meteor.userId();
  const hasRole = Roles.userIsInRole(Meteor.userId(), role);

  // If user is unauthorized, return the unathorized_page template
  return isLoggedIn && hasRole ? authorizedTemplate : 'unauthorized_page';
}

const authorization = {
  checkRole
}

export default authorization;