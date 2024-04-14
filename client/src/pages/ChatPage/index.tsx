import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography,
} from '@mui/material';
import { StyledChatContainer } from './StyledChatContainer';
import { StyledInputContainer } from './StyledInputContainer';
import { StyledMessagesBox } from './StyledMessagesBox';
import NameAvatar from '../../components/shared/NameAvatar';
import Message from './Message';
import UseAxios from '../../utils/UseAxios';
import { useParams } from 'react-router-dom';
import { Message as IMessage, MessageGroup, User } from '../../types/interfaces';
import AuthContext from '../../context/AuthContext';
import SendIcon from '@mui/icons-material/Send';
import { decryptSymmetric, encryptSymmetric } from '../../services/aes';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { decryptBase64FromPEM, verify } from '../../services/rsa';

enum MessageType {
    NEW_MESSAGE = 'new_message',
    NEW_KEY = 'new_key',
    NEW_USER = 'new_user',
}

const safeGetKey = (groupId: string, keyId: string): string | null | { key: string; id: string } => {
    try {
        const keys = JSON.parse(localStorage.getItem('keys') ?? `{}`);
        const groupKeys = keys[groupId];
        const key = groupKeys[keyId];
        return key ?? null;
    } catch (err) {
        console.error(`Error in getting key from local storage: ${err}`);
        return null;
    }
};

const decryptMessage = async (groupId: string, message: IMessage): Promise<IMessage> => {
    try {
        const key = safeGetKey(groupId, message?.key);
        const plaintext = await decryptSymmetric(message?.cipher_text, message?.initialisation_vector, key as string);

        return {
            ...message,
            cipher_text: plaintext,
        };
    } catch (err) {
        console.error(`Error in decrypting message ${err}`);
        return message;
    }
};

const ChatPage: React.FC = () => {
    const { groupId } = useParams();
    const api = UseAxios();
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
    const [group, setGroup] = useState<MessageGroup>();
    const { user } = useContext(AuthContext);
    const userName = `${user?.first_name} ${user?.last_name}`;
    const messagesViewBoxRef = useRef<HTMLElement>(null);
    const isGroupCreator = group?.created_by?.id === user?.id;
    const [users, setUsers] = useState<User[]>();
    const [nonSelectedUsers, setNonSelectedUsers] = useState<User[]>();

    const fetchGroup = useCallback(async () => {
        const { data } = await api.get(`/messages/groups/${groupId}/`);
        setGroup(data);
    }, []);

    useEffect(() => {
        const webSocket = new WebSocket(`ws://localhost:8001/websockets/messages/${groupId}/`);
        const fetchMessages = async () => {
            const { data } = await api.get(`/messages/groups/${groupId}/messages/`);
            const decryptedMessages = [] as IMessage[];
            for (const message of data?.results?.reverse()) {
                const decryptedMessage = await decryptMessage(groupId ?? '', message);
                decryptedMessages?.push(decryptedMessage);
            }
            setChatMessages(decryptedMessages);
        };

        const fetchUsers = async () => {
            const { data } = await api.get(`/accounts/users/`);
            setUsers(data?.results);
        };

        const fetchLatestKey = async () => {
            try {
                const { data } = await api.get(`/crypto/aes/?group=${groupId}`);
                const { key, id, signature } = data;
                const publicKey = JSON.parse(localStorage?.getItem('serverPublicKey') ?? `{}`);
                if (!verify(key, signature, publicKey)) {
                    console.error(`Key signature is not from recognised party!`);
                    return;
                }
                const decryptedKey = decryptBase64FromPEM(key, JSON.parse(localStorage?.getItem('privateKey') ?? `{}`));
                return {
                    id,
                    key: decryptedKey,
                };
            } catch (err) {
                console.error(err);
            }
        };

        const storeLatestKey = async () => {
            const keyAndId = await fetchLatestKey();
            if (!keyAndId) {
                return;
            }
            const { id, key } = keyAndId;
            const existingKeys = JSON.parse(localStorage?.getItem('keys') ?? `{}`);
            const updatedKeys = {
                ...existingKeys,
                [groupId ?? '']: {
                    ...existingKeys[groupId ?? ''],
                    current: {
                        key,
                        id,
                    },
                    [id]: key,
                },
            };
            localStorage.setItem('keys', JSON.stringify(updatedKeys));
        };

        fetchGroup();
        fetchMessages();
        fetchUsers();
        storeLatestKey();

        const onMessage = async (e: MessageEvent) => {
            const data = JSON.parse(e?.data);
            switch (data?.type) {
                case MessageType.NEW_MESSAGE:
                    const decryptedMessage = await decryptMessage(groupId ?? '', data?.message);
                    setChatMessages(previous => [...previous, decryptedMessage]);
                    break;
                case MessageType.NEW_USER:
                case MessageType.NEW_KEY:
                    await Promise.all([storeLatestKey(), fetchGroup()]);
                    break;
            }
        };

        webSocket.onmessage = e => {
            console.log(e);
            onMessage(e);
        };

        return () => {
            webSocket.close();
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    useEffect(() => {
        const flatSelectedIds = group?.users?.map(user => user?.user?.id);
        const notSelected = users?.filter(user => !flatSelectedIds?.includes(user?.id));
        setNonSelectedUsers(notSelected);
    }, [users, group]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        let trimmedMessage = message?.trim();
        if (!trimmedMessage) {
            return;
        }
        try {
            const currentKey = safeGetKey(groupId ?? '', 'current') as { key: string; id: string };
            const { ciphertext, iv } = await encryptSymmetric(trimmedMessage, currentKey?.key);
            trimmedMessage = ciphertext;
            await api.post(`/messages/groups/${groupId}/messages/`, {
                cipher_text: trimmedMessage,
                initialisation_vector: iv,
                key: currentKey?.id,
            });
            setMessage('');
        } catch (err) {
            console.error(`Error in sending new message!: ${err}`);
        }
    };

    const scrollToBottom = () => {
        const messagesViewBox = messagesViewBoxRef?.current;
        messagesViewBox!.scrollTop = messagesViewBox?.scrollHeight ?? 0;
    };

    const inviteUser = async (userId: string) => {
        try {
            await api.post(`/messages/groups/${groupId}/users/`, {
                user: userId,
            });
            fetchGroup();
        } catch (err) {
            console.error(`Error in inviting user ${err}`);
        }
    };

    const removeUser = async (userId: string) => {
        try {
            await api.delete(`/messages/groups/${groupId}/users/remove/`, {
                data: {
                    user_id: userId,
                },
            });
            fetchGroup();
        } catch (err) {
            console.error(`Error in removing user ${err}`);
        }
    };

    const canSendMessages = group?.users?.some(groupUser => groupUser?.user?.id === user?.id);

    return (
        <Box sx={{ display: 'flex' }}>
            <StyledChatContainer maxWidth='md'>
                <Typography variant='h4' gutterBottom>
                    {group?.group_name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                    <NameAvatar name={userName} sx={{ marginRight: 2 }} />
                    <Typography variant='h6'>{userName}</Typography>
                </Box>
                <StyledMessagesBox ref={messagesViewBoxRef}>
                    {chatMessages?.map(chat => {
                        const isOwnMessage = chat?.user?.id === user?.id;
                        const sender = `${chat?.user?.first_name} ${chat?.user?.last_name}`;
                        const content = chat?.cipher_text;
                        return <Message key={chat.id} sender={sender} isSender={isOwnMessage} content={content} />;
                    })}
                </StyledMessagesBox>
                <StyledInputContainer>
                    <TextField
                        fullWidth
                        label='Type a message'
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyDown={async e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                await handleSendMessage(e);
                            }
                        }}
                        disabled={!canSendMessages}
                    />
                    <Button
                        variant='contained'
                        onClick={handleSendMessage}
                        sx={{ marginLeft: '1rem' }}
                        endIcon={<SendIcon />}
                        disabled={!canSendMessages}
                    >
                        Send
                    </Button>
                </StyledInputContainer>
            </StyledChatContainer>
            {isGroupCreator && (
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        padding: '10px',
                    }}
                >
                    <Card>
                        <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                            <Typography variant='h5' gutterBottom>
                                Group Members
                            </Typography>
                            <List sx={{ marginTop: 1 }}>
                                {group?.users?.map(user => (
                                    <ListItem
                                        key={user?.user?.id}
                                        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    >
                                        <ListItemText primary={`${user?.user?.first_name} ${user?.user?.last_name}`} />
                                        <IconButton
                                            disabled={user?.user?.id === group?.created_by?.id}
                                            onClick={async () => await removeUser(user?.user?.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                    <Card
                        sx={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            padding: '10px',
                            mt: '2em',
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                            <Typography variant='h5' gutterBottom>
                                Add Member
                            </Typography>
                            <List sx={{ marginTop: 1 }}>
                                {nonSelectedUsers?.map(user => (
                                    <ListItem
                                        key={user?.id}
                                        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    >
                                        <ListItemText primary={`${user?.first_name} ${user?.last_name}`} />
                                        <IconButton onClick={async () => await inviteUser(user?.id)}>
                                            <AddIcon />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Box>
            )}
        </Box>
    );
};

export default ChatPage;
