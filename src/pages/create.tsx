import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Button, Icon, Input, Step } from 'semantic-ui-react'
import { io } from 'socket.io-client'
import { LobbyCreator, LobbyUsers } from '../components'
import { LobbyContext } from '../contexts/Lobby'

const Create: React.FC = (): JSX.Element => {
    const [isCreating, setIsCreating] = useState(true)
    const [gameLink, setGameLink] = useState('')
    const [url, setUrl] = useState('')

    const { socket, setSocket, users } = useContext(LobbyContext)
    const router = useRouter()

    useEffect(() => {
        if (!url) return
        setSocket(io(`https://field-freckle-consonant.glitch.me//${url}`))
        setGameLink(`${getDomain()}/play/${url}`)
    }, [url])

    const getDomain = () => {
        const { protocol, hostname, port } = window.location
        return protocol + '//' + hostname + (port ? ':' + port : '')
    }

    const handleStart = () => {
        router.push(`/play/${url}`)
        socket?.emit('start')
    }

    return (
        <>
            <Step.Group ordered>
                <Step active={isCreating} completed={!isCreating}>
                    <Step.Content>
                        <Step.Title>Settings</Step.Title>
                        <Step.Description>
                            Choose your game options
                        </Step.Description>
                    </Step.Content>
                </Step>

                <Step active={!isCreating}>
                    <Step.Content>
                        <Step.Title>Invite players</Step.Title>
                    </Step.Content>
                </Step>
            </Step.Group>
            <div className='default-card'>
                {isCreating ? (
                    <LobbyCreator
                        setUrl={setUrl}
                        setIsCreating={setIsCreating}
                    />
                ) : (
                    <>
                        <LobbyUsers />
                        <Input
                            value={gameLink}
                            fluid
                            action={
                                <CopyToClipboard text={gameLink}>
                                    <Button
                                        color='blue'
                                        icon
                                        labelPosition='right'
                                    >
                                        Copy
                                        <Icon name='copy' />
                                    </Button>
                                </CopyToClipboard>
                            }
                        />
                        <Button
                            fluid
                            primary
                            onClick={handleStart}
                            disabled={users.length < 3}
                        >
                            Start
                        </Button>
                    </>
                )}
            </div>
        </>
    )
}

export default Create
