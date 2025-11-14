import fastify from 'fastify'
import { state } from './users.js'

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

app.get('/users/:id', (req, res) => {
    const { id } = req.params
    const user = state.users.find(user => user.id === parseInt(id))
    
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

app.listen({ port }, () => {
    console.log(`Example app listening on port ${port}`)
})