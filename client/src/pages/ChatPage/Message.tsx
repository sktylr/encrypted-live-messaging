import React from 'react';
import { StyledMessage } from './StyledMessage';
import { StyledMessageContent } from './StyledMessageContent';
import { Typography } from '@mui/material';
import NameAvatar from '../../components/shared/NameAvatar';

interface MessageProps {
    sender: string;
    isSender: boolean;
    content: string;
}

const Message: React.FC<MessageProps> = ({ sender, isSender, content }) => {
    return (
        <StyledMessage sx={{ marginBottom: 2 }} isSender={isSender}>
            {!isSender && <NameAvatar name={sender} sx={{ mt: '8px', mr: '8px', ml: '0', alignSelf: 'flex-start' }} />}
            <StyledMessageContent isSender={isSender}>
                <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
                    {sender}
                </Typography>
                <Typography variant='body1'>{content}</Typography>
            </StyledMessageContent>
            {isSender && <NameAvatar name={sender} sx={{ mt: '8px', mr: '0', ml: '8px', alignSelf: 'flex-start' }} />}
        </StyledMessage>
    );
};

export default Message;
