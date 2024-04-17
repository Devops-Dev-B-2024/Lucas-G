const express = require('express')
const cors = require("cors")
const bodyParser = require('body-parser');
let DB = require('./db.config')
const OpenApiValidator = require('express-openapi-validator')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')

const swaggerDocument = YAML.load('./open-api.yml')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
app.use(express.json())

// Middleware d'openAPI
app.use(
    OpenApiValidator.middleware({
        apiSpec: './open-api.yml',
        ignoreUndocumented: true
    })
)

/******  Modules de routage  ********/

const axios_router = require('./routers/axios')
const genre_router = require('./routers/genres')
const movie_router = require('./routers/movies')
const user_router = require('./routers/users')
const rating_router = require('./routers/ratings')
const review_router = require('./routers/reviews')
const auth_router = require('./routers/auth')



/******  Routage  ********/

app.get('/', (req, res) => res.send(`Connection réussi`))
app.use('/users', user_router)
app.use('/axios', axios_router)
app.use('/genres', genre_router)
app.use('/movies', movie_router)
app.use('/ratings', rating_router)
app.use('/reviews', review_router)
app.use('/auth', auth_router)
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Déclaration globale du middleware d'erreur, on assume que le paramètre error, possède certains attributs
app.use((error, req, res, next) => {
    res.status(error.status || 500)
        .json({success: false, message: error.message, status: error.status})
})

app.get('*', (req, res) => res.status(501).send("La ressource n'existe pas"))

/******  Démarrage serveur + DB  ********/

DB.sequelize.authenticate()
    .then(() => console.log('Database connection OK'))
    .then(() => {
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`This server is running on port ${process.env.SERVER_PORT}`)
        })
    })
    .catch(err => console.log('Database Error', err))
