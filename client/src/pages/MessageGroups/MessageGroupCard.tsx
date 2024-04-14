import React from 'react';
import { MessageGroup } from '../../types/interfaces';
import { Button, Card, CardActions, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';
import NameAvatar from '../../components/shared/NameAvatar';
import { useNavigate } from 'react-router-dom';

interface MessageGroupCardProps {
    group: MessageGroup;
    loading: boolean;
}

const MessageGroupCard: React.FC<MessageGroupCardProps> = ({ group, loading }) => {
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 3,
                flexDirection: 'column',
                maxHeight: '25rem',
                height: '25rem',
            }}
        >
            <NameAvatar
                sx={{
                    marginTop: 3,
                }}
                name={group.group_name}
            />
            <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Typography variant='h6'>{group?.group_name}</Typography>
                <List sx={{ marginTop: 1 }}>
                    {group?.users?.map(user => (
                        <ListItem
                            key={user?.user?.id}
                            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                            <ListItemText primary={`${user?.user?.first_name} ${user?.user?.last_name}`} />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
            <CardActions disableSpacing sx={{ mt: 'auto' }}>
                <Button variant='contained' onClick={() => navigate(`/messages/${group.id}`)} disabled={loading}>
                    View
                </Button>
            </CardActions>
        </Card>
    );
};

export default MessageGroupCard;
