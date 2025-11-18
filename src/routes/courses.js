import yup from 'yup';
import coursesState from '../courses.js'
import { routes } from './index.js'

export default (app) => {
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
            courses: filteredCourses,
            header: 'Курсы по программированию',
            routes,
        }

        res.view('courses/index', data)
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
        res.view('courses/show', data)
    })

    app.get(routes.newCoursePath(), (_req, res) => {
        res.view('courses/new', { routes })
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

            res.view('courses/new', data)
            return
        }

        const course = {
            title, description,
            id: Date.now()
        }

        coursesState.courses.push(course)

        res.redirect('/courses')
    })
}