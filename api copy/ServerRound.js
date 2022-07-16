import { Namespace, Socket } from 'socket.io'
import { ServerTurn } from './ServerTurn'
import { RoundUser, User } from './types'
import { getWords, sleep } from './utils'

class ServerRound {
    constructor(
        users,
        sockets,
        maxTime,
        namespace
    ) {
        this.maxTime = maxTime

        this.passed = []
        this.notPassed = [...users.values()].map((u) => ({
            ...u,
            socket: sockets.get(u.id)
        }))

        this.nsp = namespace
    }

    addUser(user, socket) {
        console.log('ServerRound.addUser: %s', user.name)
        this.notPassed.push({ ...user, socket })
    }

    removeUser(user) {
        console.log('ServerRound.removeUser: %s', user.name)
        const isNotUser = (u) => u.id !== user.id
        this.notPassed = this.notPassed.filter(isNotUser)
        this.passed = this.passed.filter(isNotUser)

        if (this.currentTurn?.currentUser.id === user.id)
            this.currentTurn.emitter.emit('turnEnd')
    }

    users() {
        return this.passed.length + this.notPassed.length
    }

    async run() {
        console.log('ServerRound.run')

        while (this.notPassed.length > 0) {
            const currentUser = this.notPassed.shift()

            if (!currentUser) break
            this.passed.push(currentUser)
            this.nsp.emit('timer', this.maxTime)

            await sleep(5000)

            const words = await getWords()
            let word = words[Math.round(Math.random() * 2)]
            currentUser.socket.emit('drawing', words)

            // 20 seconds to think
            await new Promise((resolve) => {
                let timeout

                currentUser.socket.on(
                    'drawingResponse',
                    async (data) => {
                        if (words.includes(data)) word = data
                        resolve(true)
                        clearTimeout(timeout)
                    }
                )

                timeout = setTimeout(resolve, 20000)
            })
            this.currentTurn = new ServerTurn(
                word,
                currentUser,
                this.maxTime,
                this.passed.length + this.notPassed.length,
                this.nsp
            )
            await this.currentTurn.run()
        }
    }
}

module.exports = ServerRound