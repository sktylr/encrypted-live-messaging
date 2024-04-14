import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const StyledMessagesBox = styled(Box)`
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    padding: 16px;
    margin-bottom: 2rem;
    overflow-y: auto;
    flex-grow: 1;
`;
