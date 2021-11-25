Template.registerHelper('get', (obj, propName) => obj && obj[propName]);
Template.registerHelper('eq', (a, b) => /* eslint-disable eqeqeq */ a == b /* eslint-enable eqeqeq */);
Template.registerHelper('neq', (a, b) => /* eslint-disable eqeqeq */ a != b /* eslint-enable eqeqeq */);
Template.registerHelper('gt', (a, b) => a > b);
Template.registerHelper('gte', (a, b) => a >= b);
Template.registerHelper('lt', (a, b) => a < b);
Template.registerHelper('lte', (a, b) => a <= b);
Template.registerHelper('and', (a, b) => a && b);
Template.registerHelper('or', (a, b) => a || b);
Template.registerHelper('not', a => !a);
Template.registerHelper('num', a => a || 0);
Template.registerHelper('int', a => +a);
Template.registerHelper('Session', a => Session.get(a));


// App

Template.registerHelper('isAdmin', () => isAdmin());