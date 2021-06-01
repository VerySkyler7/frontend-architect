const routes = []

function app (req, res) {

    function next() {
        routes.unshift
    }

    next();

}

app.use = (fn) => {
    routes.push(fn);
}

app.use((req, res, next) => {
    console.log(1)
    next()
    console.log(11)
})

app.use((req, res, next) => {
    console.log(2)
    next()
    console.log(22)
})

