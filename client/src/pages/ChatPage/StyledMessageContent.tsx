import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const StyledMessageContent = styled(Box)`
    background-color: ${({ isSender }: { isSender: boolean }) => (isSender ? '#DCF8C6' : '#F4F4F4')};
    padding: 8px;
    border-radius: 4px;
`;
