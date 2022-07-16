const getPublicLobbies = (lobbies) => {
    const publicLobbies = []

    lobbies.forEach((lobby) => {
        if (lobby.isPrivate) return
        publicLobbies.push(lobby)
    })

    return publicLobbies
}

module.exports = getPublicLobbies;