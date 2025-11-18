import fastify from 'fastify'
import formbody from '@fastify/formbody'
import view from '@fastify/view'
import pug from 'pug'

// Маршруты
import { routes } from './routes/index.js'
import addRoutes from './routes/index.js';

const app = fastify()
const port = 3000

await app.register(view, {
    engine: { pug },
    root: 'src/views',
    defaultContext: {
        routes,
    },
})
await app.register(formbody)

addRoutes(app);

app.listen({ port }, () => {
    console.log(`Example app listening on port ${port}`)
})
