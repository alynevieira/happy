import express, { json } from 'express'
import errorHandler from './errors/handler'
import 'express-async-errors'
import path from 'path'
import cors from 'cors'

import './database/connection';

import routes from './routes'

// ajuda a lidar com requisições/respostas
const app = express()

app.use(cors())
app.use(json())
app.use(routes)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
app.use(errorHandler)

app.listen(3333)