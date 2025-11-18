import courses from './courses.js';
import users from './users.js';
import root from './root.js';

export const routes = {
    greeting: () => 'hello',
    usersPath: () => '/users',
    userPath: id => `/users/${id}`,
    newUserPath: () => '/users/new',
    editUserPath: id => `/users/${id}/edit`,
    coursesPath: () => '/courses',
    coursePath: id => `/courses/${id}`,
    newCoursePath: () => '/courses/new',
}

const controllers = [
    courses,
    users,
    root,
];

export default (app) => controllers.forEach((f) => f(app));
