import fastify from 'fastify'
import middie from '@fastify/middie'
import fastifyCookie from '@fastify/cookie'
import morgan from 'morgan'
import formbody from '@fastify/formbody'
import view from '@fastify/view'
import pug from 'pug'

// Маршруты
import { routes } from './routes/index.js'
import addRoutes from './routes/index.js';

const app = fastify()
const port = 3000

const logger = morgan('combined')
await app.register(middie)

app.use(logger)

await app.register(view, {
    engine: { pug },
    root: 'src/views',
    defaultContext: {
        routes,
    },
})
await app.register(formbody)

// подключение плагина
await app.register(fastifyCookie)

// отображение кук на отдельной странице
app.get('/cookies', (req, res) => {
    res.send(req.cookies)
})

// установка кук
app.get('/test', (req, res) => {
    res.cookie('test', 'value')
    res.cookie('test2', 'value2')
    res.cookie('test4', 'value5')
    res.send()
})

addRoutes(app);

app.listen({ port }, () => {
    console.log(`Example app listening on port ${port}`)
})
