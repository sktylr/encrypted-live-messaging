import React, { useContext, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { capitalise } from '../utils/helpers/capitalise';
import { Box, Container, TextField, Alert, Button, Grid, CssBaseline, Avatar, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { signInRegisterText } from '../resources/Text';
import AuthContext from '../context/AuthContext';
import { FormValue } from '../types/interfaces';

const hasError = (field: string, value: string, formValues?: FormValues) => {
    switch (field) {
        case 'firstName':
        case 'lastName':
        case 'email':
        case 'password':
            return value === '';
        case 'confirmPassword':
            return formValues?.password?.value !== value || value === '';
        default:
            return false;
    }
};

interface FormValues {
    firstName: FormValue;
    lastName: FormValue;
    email: FormValue;
    password: FormValue;
    confirmPassword: FormValue;
}

const Register = () => {
    const navigate = useNavigate();
    const { register, registerError } = useContext(AuthContext);

    const [formValues, setFormValues] = useState<FormValues>({
        email: {
            value: '',
            error: false,
            errorMessage: 'You must enter an email',
        },
        firstName: {
            value: '',
            error: false,
            errorMessage: 'You must enter a first name',
        },
        lastName: {
            value: '',
            error: false,
            errorMessage: 'You must enter a surname',
        },
        password: {
            value: '',
            error: false,
            errorMessage: 'You must enter a password',
        },
        confirmPassword: {
            value: '',
            error: false,
            errorMessage: 'Passwords must match!',
        },
    });

    const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = e => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: {
                ...formValues[name as keyof FormValues],
                value,
                error: hasError(name, value, formValues),
            },
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
                    error: hasError(currentField, currentValue, formValues),
                },
            };
        }

        setFormValues(newFormValues);

        if (!Object.values(newFormValues).some((element: FormValue) => element.error)) {
            const email = formValues.email.value.toLowerCase();
            const firstName = capitalise(formValues.firstName.value);
            const lastName = capitalise(formValues.lastName.value);
            const password = formValues.password.value;
            const confirmPassword = formValues.confirmPassword.value;

            await register({
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                confirm_password: confirmPassword,
            });
            if (!registerError) {
                navigate('/');
            }
        }
    };

    return (
        <Box className='centered-page-container'>
            <Container component='main' maxWidth='xs'>
                <CssBaseline />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, mb: 2 }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <h1 className='page-title font-semibold'>Register for an account</h1>
                    <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2} sx={{ height: '100%' }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    placeholder={signInRegisterText.enterName}
                                    label={signInRegisterText.firstName}
                                    name='firstName'
                                    required
                                    fullWidth
                                    id='firstName'
                                    value={formValues.firstName.value}
                                    onChange={handleChange}
                                    error={formValues.firstName.error}
                                    helperText={formValues.firstName.error && formValues.firstName.errorMessage}
                                    inputProps={{
                                        style: { textTransform: 'capitalize' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    placeholder={signInRegisterText.enterName}
                                    label={signInRegisterText.lastName}
                                    name='lastName'
                                    required
                                    fullWidth
                                    id='lastName'
                                    value={formValues.lastName.value}
                                    onChange={handleChange}
                                    error={formValues.lastName.error}
                                    helperText={formValues.lastName.error && formValues.lastName.errorMessage}
                                    inputProps={{
                                        style: { textTransform: 'capitalize' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    placeholder={signInRegisterText.enterEmail}
                                    label={signInRegisterText.email}
                                    name='email'
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
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    data-testid='password'
                                    placeholder={signInRegisterText.enterPassword}
                                    label={signInRegisterText.password}
                                    name='password'
                                    required
                                    type='password'
                                    id='password'
                                    autoComplete='current-password'
                                    value={formValues.password.value}
                                    onChange={handleChange}
                                    error={formValues.password.error}
                                    helperText={formValues.password.error && formValues.password.errorMessage}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    data-testid='confirmPassword'
                                    placeholder={signInRegisterText.confirmYourPassword}
                                    label={signInRegisterText.confirmPassword}
                                    name='confirmPassword'
                                    required
                                    type='password'
                                    id='confirmPassword'
                                    value={formValues.confirmPassword.value}
                                    onChange={handleChange}
                                    error={formValues.confirmPassword.error}
                                    helperText={
                                        formValues.confirmPassword.error && formValues.confirmPassword.errorMessage
                                    }
                                />
                            </Grid>
                        </Grid>
                        {registerError && <Alert severity='error'>{registerError}</Alert>}
                        <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                            {signInRegisterText.register}
                        </Button>
                        <Grid item sx={{ textAlign: 'center' }}>
                            <Link component={RouterLink} to={'/login'} variant='body2'>
                                {signInRegisterText.accountMade}
                            </Link>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Register;
