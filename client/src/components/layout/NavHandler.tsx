import React from 'react';
import NavBar from './NavBar';
import { AppBar, Box, Container, Toolbar } from '@mui/material';
import AuthContext from '../../context/AuthContext';

const NavHandler = () => {
    const { user } = React.useContext(AuthContext);

    return (
        <div>
            {user ? (
                <NavBar />
            ) : (
                <AppBar color='primary' position='fixed'>
                    <Container sx={{ minWidth: '100%' }}>
                        <Toolbar disableGutters>
                            <Box sx={{ flexGrow: 1 }}>
                                <a href='/login'>Go home</a>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            )}
        </div>
    );
};

export default NavHandler;
