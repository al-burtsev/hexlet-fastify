import yup from 'yup';
import usersState from '../users.js'
import { routes } from './index.js'

export default (app) => {
    app.get(routes.usersPath(), (_req, res) => {
        const users = usersState.users
        res.view('users/index', { users, routes })
    })

    app.get(routes.userPath(':id'), (req, res) => {
        const { id } = req.params
        const user = usersState.users.find(user => user.id === parseInt(id))

        if (!user) {
            res.code(404).send({ message: 'User not found' })
            return
        }
        res.view('users/show', { user, routes })
    })

    app.get('/users/:id/post', (req, res) => {
        res.send(`User ID: ${req.params.id}; Post: lala`)
    })

    app.get('/users/:id/post/:postId', (req, res) => {
        res.send(`User ID: ${req.params.id}; Post ID: ${req.params.postId}`)
    })

    app.get(routes.newUserPath(), (_req, res) => {
        res.view('users/new', { routes })
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

            res.view('users/new', data)
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

    // Форма редактирования пользователя
    app.get(routes.editUserPath(':id'), (req, res) => {
        const { id } = req.params;
        const user = usersState.users.find((item) => item.id === parseInt(id));
        if (!user) {
            res.code(404).send({ message: 'User not found' });
        } else {
            res.view('users/edit.pug', { user, routes });
        }
    });

    // Обновление пользователя
    app.patch(routes.userPath(':id'), (req, res) => {
        const { id } = req.params;
        const { name, email, password, passwordConfirmation, } = req.body;
        const userIndex = usersState.users.findIndex((item) => item.id === parseInt(id));
        if (userIndex === -1) {
            res.code(404).send({ message: 'User not found' });
        } else {
            usersState.users[userIndex] = { ...usersState.users[userIndex], name, email };
            res.send(users[userIndex]);
            res.redirect('/users');
        }
    });

    // Удаление пользователя
    app.delete(routes.userPath(':id'), (req, res) => {
        const { id } = req.params;
        const userIndex = usersState.users.findIndex((item) => item.id === parseInt(id));
        if (userIndex === -1) {
            res.code(404).send({ message: 'User not found' });
        } else {
            usersState.users.splice(userIndex, 1);
            res.redirect('/users');
        }
    });
}
