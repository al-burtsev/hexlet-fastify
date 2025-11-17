export default {
    greeting: () => 'hello',
    usersPath: () => '/users',
    userPath: id => `/users/${id}`,
    newUserPath: () => '/users/new',
    coursesPath: () => '/courses',
    coursePath: id => `/courses/${id}`,
    newCoursePath: () => '/courses/new',
}
