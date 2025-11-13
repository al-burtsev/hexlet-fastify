import fastify from 'fastify'

const app = fastify()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/hello', (req, res) => {
    const { name } = req.query;
    const greeting = name ? `Hello, ${name}!` : 'Hello World!';
    res.send(greeting)
})

app.get('/users', (req, res) => {
    res.send('GET /users')
})

app.post('/users', (req, res) => {
    res.send('POST /users')
})

app.listen({ port }, () => {
    console.log(`Example app listening on port ${port}`)
})