import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const StyledMessage = styled(Box)`
    display: flex;
    justify-content: ${({ isSender }: { isSender: boolean }) => (isSender ? 'flex-end' : 'flex-start')};
    margin-bottom: 2rem;
`;
