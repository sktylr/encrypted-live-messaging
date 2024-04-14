import { Avatar, SxProps } from '@mui/material';
import React from 'react';
import { stringToColour } from '../../utils/helpers/stringToColour';

interface NameAvatarProps {
    name: string;
    sx?: SxProps;
}

const NameAvatar: React.FC<NameAvatarProps> = ({ name, sx }) => {
    return (
        <Avatar
            sx={{
                ...(sx ?? {}),
                bgcolor: stringToColour(name),
            }}
        >
            {name
                ?.split(' ', 3)
                ?.map(c => c?.charAt(0))
                ?.join('')}
        </Avatar>
    );
};

export default NameAvatar;
