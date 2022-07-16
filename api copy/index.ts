const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const apiRouter = require('./api');
const { ServerLobby } = require('./ServerLobby');
const socketEvents = require('./socketEvents');

require('dotenv').config()

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT ?? 3000

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const server = createServer(app)
export const lobbies: Map<string, ServerLobby> = new Map()
export const prisma = new PrismaClient()

const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

app.use('/api', apiRouter)
app.get('*', (req, res) => nextHandler(req, res))

const io = new Server(server, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: !dev
})
socketEvents(io, lobbies)

nextApp.prepare().then(() => {
    console.log('NextJS started')
    server.listen(port, () => {
        console.log(`Server listening on ${port}...`)
    })
})
