import React from 'react';
import AuthProvider from '../context/AuthProvider';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline, Box, Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import { theme } from '../theme/theme';
import NavHandler from '../components/layout/NavHandler';
import AuthGuard from '../utils/AuthGuard';
import MessageGroups from './MessageGroups';
import CreateMessageGroup from './CreateMessageGroup';
import ChatPage from './ChatPage';

const Main = () => {
    return (
        <React.StrictMode>
            <AuthProvider>
                <ThemeProvider theme={theme}>
                    <Box className='app'>
                        <CssBaseline />
                        <NavHandler />

                        <Container className='container' maxWidth='xl'>
                            <Routes>
                                <Route path='/login' element={<Login />} />
                                <Route path='/register' element={<Register />} />
                                <Route element={<AuthGuard />}>
                                    <Route element={<MessageGroups />} path='/' />
                                </Route>
                                <Route element={<AuthGuard />}>
                                    <Route element={<CreateMessageGroup />} path='/groups/create' />
                                </Route>
                                <Route element={<AuthGuard />}>
                                    <Route element={<ChatPage />} path='/messages/:groupId' />
                                </Route>
                            </Routes>
                        </Container>
                    </Box>
                </ThemeProvider>
            </AuthProvider>
        </React.StrictMode>
    );
};

export default Main;
