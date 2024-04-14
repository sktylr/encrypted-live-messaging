import React from 'react';
import { Box, Container, TextField, Typography, Button, Alert } from '@mui/material';
import UseAxios from '../../utils/UseAxios';
import { useNavigate } from 'react-router-dom';

const CreateMessageGroup: React.FC = () => {
    const api = UseAxios();
    const navigate = useNavigate();
    const [name, setName] = React.useState<string>();
    const [formError, setFormError] = React.useState<string>();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (!name) {
            setFormError('Group name must be supplied!');
            return;
        }
        const response = await api.post('/messages/groups/', { group_name: name });
        if (response?.status !== 201) {
            setFormError('An unknown error occurred!');
        } else navigate('/');
    };

    return (
        <Box className='centered-page-container'>
            <Container component='main' maxWidth='xs'>
                <Box className='centered-page-container'>
                    <Typography variant='h1' sx={{ mt: 3 }}>
                        Create a new group
                    </Typography>
                    <Box component='form' onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            placeholder='Enter group name'
                            label='Group name'
                            name='name'
                            margin='normal'
                            required
                            fullWidth
                            id='name'
                            value={name}
                            onChange={e => setName(e?.target?.value)}
                        />
                        {formError && <Alert severity='error'>{formError}</Alert>}
                        <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                            Create
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default CreateMessageGroup;
