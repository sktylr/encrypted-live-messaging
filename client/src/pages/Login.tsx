import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Container, Avatar, TextField, Alert, Button, Grid, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { signInRegisterText } from '../resources/Text';
import { FormValue } from '../types/interfaces';

interface FormValues {
    email: FormValue;
    password: FormValue;
}

const Login = () => {
    const { login, user, loginError } = useContext(AuthContext);
    const [formValues, setFormValues] = useState<FormValues>({
        email: {
            value: '',
            error: false,
            errorMessage: 'You must enter an email',
        },
        password: {
            value: '',
            error: false,
            errorMessage: 'You must enter a password',
        },
    });
    const navigate = useNavigate();

    useEffect(() => {
        user ? navigate('/') : null;
    }, [user]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = e => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: {
                ...formValues[name as keyof FormValues],
                value,
                error: value === '',
            },
        });
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formFields = Object.keys(formValues);
        let newFormValues = { ...formValues };

        for (let index = 0; index < formFields.length; index++) {
            const currentField = formFields[index] as keyof FormValues;
            const currentValue = formValues[currentField].value;

            newFormValues = {
                ...newFormValues,
                [currentField]: {
                    ...newFormValues[currentField],
                    error: currentValue === '',
                },
            };
        }

        setFormValues(newFormValues);

        if (!Object.values(newFormValues).some((element: any) => element.error)) {
            const email = formValues.email.value.toLowerCase();
            const password = formValues.password.value;
            await login(email, password);
        }
    };

    return (
        <Box className='centered-page-container'>
            <Container component='main' maxWidth='xs'>
                <Box className='centered-page-container'>
                    <Avatar sx={{ m: 1 }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <h1 className='page-title font-semibold'>Sign in</h1>
                    <Box component='form' onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            placeholder={signInRegisterText.enterEmail}
                            label={signInRegisterText.email}
                            name='email'
                            margin='normal'
                            required
                            fullWidth
                            id='email'
                            value={formValues.email.value}
                            onChange={handleChange}
                            error={formValues.email.error}
                            helperText={formValues.email.error && formValues.email.errorMessage}
                            inputProps={{
                                style: { textTransform: 'lowercase' },
                            }}
                        />
                        <TextField
                            data-testid='password'
                            placeholder={signInRegisterText.enterPassword}
                            label={signInRegisterText.password}
                            name='password'
                            margin='normal'
                            required
                            fullWidth
                            type='password'
                            id='password'
                            autoComplete='current-password'
                            value={formValues.password.value}
                            onChange={handleChange}
                            error={formValues.password.error}
                            helperText={formValues.password.error && formValues.password.errorMessage}
                        />
                        {loginError && <Alert severity='error'>{loginError}</Alert>}
                        <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                            {signInRegisterText.signIn}
                        </Button>
                        <Grid item sx={{ textAlign: 'center' }}>
                            <Link component={RouterLink} to={'/register'} variant='body2'>
                                {signInRegisterText.noAccountMade}
                            </Link>
                        </Grid>
                        <Grid item sx={{ textAlign: 'center' }}>
                            or
                        </Grid>
                        <Grid item sx={{ textAlign: 'center' }}>
                            <Link component={RouterLink} to={'/forgot-password'} variant='body2'>
                                {signInRegisterText.forgotPassword}
                            </Link>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Login;
