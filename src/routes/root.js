export default (app, db) => {
    // Главная страница
    app.get('/', (req, res) => {
        const visited = req.cookies.visited
        const templateData = {
            visited,
        }
        res.cookie('visited', true)
        res.view('index', templateData);
    });
};