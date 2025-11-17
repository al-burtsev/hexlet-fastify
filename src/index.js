import fastify from 'fastify'
import formbody from '@fastify/formbody'
import view from '@fastify/view'
import pug from 'pug'
import yup from 'yup'

import usersState from './users.js'
import coursesState from './courses.js'
// Маршруты
import routes from './routes/index.js'

const app = fastify()
const port = 3000

// Подключаем pug через плагин
await app.register(view, {
    engine: { pug },
    defaultContext: {
        routes,
    },
})
await app.register(formbody)

// Обработчик главной страницы
app.get('/', (req, res) => res.view('src/views/index'));

app.get('/hello', (req, res) => {
    const { name } = req.query;
    const greeting = name ? `Hello, ${name}!` : 'Hello World!';
    res.send(greeting)
})

// Обработчики пользователей
app.get(routes.usersPath(), (req, res) => {
    const users = usersState.users
    res.view('src/views/users/index', { users, routes })
})

app.get(routes.userPath(':id'), (req, res) => {
    const { id } = req.params
    const user = usersState.users.find(user => user.id === parseInt(id))

    if (!user) {
        res.code(404).send({ message: 'User not found' })
        return
    }
    res.view('src/views/users/show', { user, routes })
})

app.get('/users/:id/post', (req, res) => {
    res.send(`User ID: ${req.params.id}; Post: lala`)
})

app.get('/users/:id/post/:postId', (req, res) => {
    res.send(`User ID: ${req.params.id}; Post ID: ${req.params.postId}`)
})

app.get(routes.newUserPath(), (_req, res) => {
    res.view('src/views/users/new', { routes })
})

app.post(routes.usersPath(), {
    attachValidation: true,
    schema: {
        body: yup.object({
            name: yup.string().min(2, 'Имя должно быть не меньше 2 символов'),
            email: yup.string().email(),
            password: yup.string().min(5),
            passwordConfirmation: yup.string().min(5),
        }),
    },
    validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
        if (data.password !== data.passwordConfirmation) {
            return {
                error: Error('Password confirmation is not equal the password'),
            }
        }
        try {
            const result = schema.validateSync(data)
            return { value: result }
        }
        catch (e) {
            return { error: e }
        }
    },
}, (req, res) => {
    const { name, email, password, passwordConfirmation } = req.body

    if (req.validationError) {
        const data = {
            name, email, password, passwordConfirmation,
            error: req.validationError,
        }

        res.view('src/views/users/new', data)
        return
    }

    const user = {
        name,
        email,
        password,
        id: Date.now()
    }

    usersState.users.push(user)

    res.redirect('/users')
})

// Обработчики курсов
app.get(routes.coursesPath(), (req, res) => {
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

app.get(routes.coursePath(':id'), (req, res) => {
    const { id } = req.params
    const course = coursesState.courses.find(({ id: courseId }) => courseId === parseInt(id))
    if (!course) {
        res.code(404).send({ message: 'Course not found' })
        return
    }
    const data = {
        course,
        routes
    }
    res.view('src/views/courses/show', data)
})

app.get(routes.newCoursePath(), (_req, res) => {
    res.view('src/views/courses/new', { routes })
})

app.post('/courses', {
    attachValidation: true,
    schema: {
        body: yup.object({
            title: yup.string().min(2, 'Название курса должно быть не меньше 2 символов'),
            description: yup.string().min(10, 'Описание курса должно быть не меньше 10 символов'),
        }),
    },
    validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
        try {
            const result = schema.validateSync(data)
            return { value: result }
        }
        catch (e) {
            return { error: e }
        }
    },
}, (req, res) => {
    const { title, description } = req.body

    if (req.validationError) {
        const data = {
            title, description,
            error: req.validationError,
        }

        res.view('src/views/courses/new', data)
        return
    }

    const course = {
        title, description,
        id: Date.now()
    }

    coursesState.courses.push(course)

    res.redirect('/courses')
})

app.listen({ port }, () => {
    console.log(`Example app listening on port ${port}`)
})