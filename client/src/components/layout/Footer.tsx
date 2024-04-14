import isMobile from '../../utils/helpers/isMobile';
import { Box, Container, Grid, Icon, Link, Typography } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EuroIcon from '@mui/icons-material/Euro';

const Footer = () => {
    const isMobileLayout = isMobile();
    return (
        <Box className='footer' component='footer' sx={{ backgroundColor: 'dark.main' }}>
            {isMobileLayout ? (
                <Container sx={{ textAlign: 'center' }}>
                    <Grid item xs={12} mb={2}>
                        <Box color='light.main'>
                            <Typography>
                                {'Copyright © '}
                                <Link color='light.main' href='https://github.com/sktylr/expense-tracker'>
                                    Sam Taylor
                                </Link>{' '}
                                {new Date().getFullYear()}
                                {'.'}
                            </Typography>
                            <Typography>
                                <Link
                                    color='light.main'
                                    href='https://github.com/sktylr/expense-tracker/blob/main/LICENSE.md'
                                >
                                    License
                                </Link>
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} mb={2}>
                        <Box className='footer-logo'>
                            <a
                                href='/'
                                style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                }}
                            >
                                <Icon>
                                    <EuroIcon />
                                </Icon>
                                xpense
                            </a>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '1em',
                                justifyContent: 'center',
                            }}
                        >
                            <Icon
                                component={'a'}
                                href='https://www.instagram.com/sam.taylor.28/'
                                rel='noreferrer'
                                target='_blank'
                                sx={{ color: 'light.main' }}
                            >
                                <InstagramIcon />
                            </Icon>
                            <Icon
                                component={'a'}
                                href='https://www.github.com/sktylr/'
                                rel='noreferrer'
                                target='_blank'
                                sx={{ color: 'light.main' }}
                            >
                                <GitHubIcon />
                            </Icon>
                            <Icon
                                component={'a'}
                                href='https://www.linkedin.com/in/sktylr/'
                                rel='noreferrer'
                                target='_blank'
                                sx={{ color: 'light.main' }}
                            >
                                <LinkedInIcon />
                            </Icon>
                        </Box>
                    </Grid>
                </Container>
            ) : (
                <Container className='footer-container'>
                    <Box className='footer-logo'>
                        <a
                            href='/'
                            style={{
                                color: 'white',
                                textDecoration: 'none',
                            }}
                        >
                            <Icon>
                                <EuroIcon />
                            </Icon>
                            xpense
                        </a>
                    </Box>
                    <Box className='footer-info' color='light.main'>
                        <Typography>
                            {'Copyright © '}
                            <Link color='light.main' href='https://github.com/sktylr/expense-tracker'>
                                Sam Taylor
                            </Link>{' '}
                            {new Date().getFullYear()}
                            {'.'}
                        </Typography>
                        <Typography>
                            <Link
                                color='light.main'
                                href='https://github.com/sktylr/expense-tracker/blob/main/LICENSE.md'
                            >
                                License
                            </Link>
                        </Typography>
                    </Box>

                    <Box className='footer-icons'>
                        <Box className='icon-group'>
                            <Icon
                                component={'a'}
                                href='https://www.instagram.com/sam.taylor.28/'
                                rel='noreferrer'
                                target='_blank'
                                sx={{ color: 'light.main' }}
                            >
                                <InstagramIcon />
                            </Icon>
                            <Icon
                                component={'a'}
                                href='https://www.github.com/sktylr/'
                                rel='noreferrer'
                                target='_blank'
                                sx={{ color: 'light.main' }}
                            >
                                <GitHubIcon />
                            </Icon>
                            <Icon
                                component={'a'}
                                href='https://www.linkedin.com/in/sktylr/'
                                rel='noreferrer'
                                target='_blank'
                                sx={{ color: 'light.main' }}
                            >
                                <LinkedInIcon />
                            </Icon>
                        </Box>
                    </Box>
                </Container>
            )}
        </Box>
    );
};

export default Footer;
