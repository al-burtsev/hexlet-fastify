import fastify from 'fastify'
import view from '@fastify/view'
import pug from 'pug'

import usersState from './users.js'
import coursesState from './courses.js'

const app = fastify()
const port = 3000

// Подключаем pug через плагин
await app.register(view, { engine: { pug } })

// Обработчик главной страницы
app.get('/', (req, res) => res.view('src/views/index'));

app.get('/hello', (req, res) => {
    const { name } = req.query;
    const greeting = name ? `Hello, ${name}!` : 'Hello World!';
    res.send(greeting)
})

app.get('/users', (req, res) => {
    res.send('GET /users')
})

app.get('/users/:id', (req, res) => {
    const { id } = req.params
    const user = usersState.users.find(user => user.id === parseInt(id))

    if (!user) {
        res.code(404).send({ message: 'User not found' })
    }
    else {
        res.send(user)
    }
})

app.get('/users/:id/post', (req, res) => {
    res.send(`User ID: ${req.params.id}; Post: lala`)
})

app.get('/users/:id/post/:postId', (req, res) => {
    res.send(`User ID: ${req.params.id}; Post ID: ${req.params.postId}`)
})

app.post('/users', (req, res) => {
    res.send('POST /users')
})

app.get('/courses', (req, res) => {
    const data = {
        courses: coursesState.courses, // Где-то хранится список курсов
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

app.listen({ port }, () => {
    console.log(`Example app listening on port ${port}`)
})