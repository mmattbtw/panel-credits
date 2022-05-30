import { Container, Tooltip, Group, Avatar, Image, Text } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { marked } from "marked"
import type { Panel } from "~/typings/typings";


export default function PanelComponent(panel: Panel) {
    const localeDateString = new Date(panel.createdAt).toLocaleDateString()
    const localeTimeString = new Date(panel.createdAt).toLocaleTimeString()

    return (
        <div>
                <br />
                <Container 
                    size={320}
                    py="xs"
                    px="xs"
                    pb="xs"
                    pt="xs"
                    style={{
                        backgroundColor: '#212326',
                        borderRadius: '1rem',
                    }}
                >
                    { panel.image !== "" ?? panel.image !== undefined ?
                        <>
                            <Tooltip
                                label='Panel Image - Click to copy link'
                                width={200}
                                position='top'
                                wrapLines
                            >
                                <Image 
                                    src={panel.image}
                                    alt={panel.title}
                                    width={320}
                                    height={'auto'}

                                    onClick={() => {
                                        if (panel.image !== "") {
                                            navigator.clipboard.writeText(panel.image ?? "")
                                            showNotification({
                                                title: "Copied!",
                                                message: "Copied image URL to your clipboard!",
                                            })
                                        } else {
                                            showNotification({
                                                title: "Error!",
                                                message: "No image URL provided!",
                                                color: 'red',
                                            })
                                        }
                                    }}
                                />
                            </Tooltip>
                            <br />
                        </>
                    :  <Text size="xs">No image provided</Text>}


                    <Tooltip
                        label="Panel Title"
                        position='left' 
                    >
                        <h1>{panel.title}</h1>
                    </Tooltip>

                    <hr />

                    <Tooltip
                        label="Panel Description (markdown) - Click to copy to clipboard"
                        width={200}
                        position='left'
                        wrapLines
                    >
                        <div onClick={
                            () => {
                                navigator.clipboard.writeText(panel.markdown)
                                showNotification({
                                    title: "Copied!",
                                    message: "Copied markdown to your clipboard!",
                                })
                            }
                        } dangerouslySetInnerHTML={{__html: marked(panel.markdown.trim())}} />
                    </Tooltip>
                    <br />
                    
                    { panel.link !== "" ?? panel.link !== undefined  ?
                        <Text size="sm">Image links to: {' '}
                            <Tooltip
                                label='Click to copy link'
                                position='left'
                            >
                                <Text 
                                    onClick={() => {
                                        navigator.clipboard.writeText(panel.link ?? "")
                                        showNotification({
                                            title: "Copied!",
                                            message: "Copied link to your clipboard!",
                                        })
                                    }} 
                                    inherit 
                                    style={{textDecoration: 'underline'}}
                                >{panel.link}</Text>
                            </Tooltip>
                        </Text>
                        : "" 
                    }

                    <Group>
                        <Text size="sm">Panel by:</Text>
                        <Avatar src={panel.chatter.profilePicture} alt={panel.chatter.displayName + "'s profile image."} size='sm' radius="xl" />
                        <div>
                        <Text size="sm">{panel.chatter.displayName}</Text>
                        </div>
                    </Group>

                    <Text size="sm">Status:{' '}
                    <Text 
                        component='span' 
                        inherit 
                        style={{backgroundColor: panel.status === "ACCEPTED" ? 'green' : panel.status === 'PENDING' ? 'grey' : 'red'}}
                        color='white'
                    >{panel.status}</Text></Text>
                    <Text size="sm">Created: {localeDateString} - {localeTimeString}</Text>
                </Container>
            </div>
    )
}