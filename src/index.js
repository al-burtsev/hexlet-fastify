import fastify from 'fastify'
import formbody from '@fastify/formbody'
import view from '@fastify/view'
import pug from 'pug'

import usersState from './users.js'
import coursesState from './courses.js'

const app = fastify()
const port = 3000

// Подключаем pug через плагин
await app.register(view, { engine: { pug } })
await app.register(formbody)

// Обработчик главной страницы
app.get('/', (req, res) => res.view('src/views/index'));

app.get('/hello', (req, res) => {
    const { name } = req.query;
    const greeting = name ? `Hello, ${name}!` : 'Hello World!';
    res.send(greeting)
})

// Обработчики пользователей
app.get('/users', (req, res) => {
    const users = usersState.users
    console.log(users)
    res.view('src/views/users/index', { users })
})

app.get('/users/:id', (req, res) => {
    const { id } = req.params
    const user = usersState.users.find(user => user.id === parseInt(id))

    if (!user) {
        res.code(404).send({ message: 'User not found' })
        return
    }
    res.view('src/views/users/show', { user })
})

app.get('/users/:id/post', (req, res) => {
    res.send(`User ID: ${req.params.id}; Post: lala`)
})

app.get('/users/:id/post/:postId', (req, res) => {
    res.send(`User ID: ${req.params.id}; Post ID: ${req.params.postId}`)
})

app.get('/users/new', (req, res) => {
    res.view('src/views/users/new')
})

app.post('/users', (req, res) => {
    const user = {
        name: req.body.name.trim(),
        email: req.body.email.trim().toLowerCase(),
        password: req.body.password,
        id: Date.now()
    }

    usersState.users.push(user)

    res.redirect('/users')
})

// Обработчики курсов
app.get('/courses', (req, res) => {
    const term = req.query.term
    let filteredCourses = coursesState.courses;

    if (term && term.trim() !== '') {
        const cleanTerm = term.trim().toLowerCase();
        filteredCourses = coursesState.courses.filter(({ title, description }) =>
            title.toLowerCase().includes(cleanTerm) ||
            description.toLowerCase().includes(cleanTerm)
        );
    }

    const data = {
        term,
        courses: filteredCourses, // Где-то хранится список курсов
        header: 'Курсы по программированию',
    }

    res.view('src/views/courses/index', data)
})

app.get('/courses/:id', (req, res) => {
    const { id } = req.params
    const course = coursesState.courses.find(({ id: courseId }) => courseId === parseInt(id))
    if (!course) {
        res.code(404).send({ message: 'Course not found' })
        return
    }
    const data = {
        course,
    }
    res.view('src/views/courses/show', data)
})

app.get('/courses/new', (req, res) => {
    res.view('src/views/courses/new')
})

app.post('/courses', (req, res) => {
    const course = {
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        id: Date.now()
    }

    coursesState.courses.push(course)

    res.redirect('/courses')
})

app.listen({ port }, () => {
    console.log(`Example app listening on port ${port}`)
})