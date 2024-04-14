import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { AppBar } from '../../utils/helpers/navBarStyles';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import {
    Box,
    Button,
    Container,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { navigation } from '../../resources/Text';
import isMobile from '../../utils/helpers/isMobile';
import SideDrawer from './SideDrawer';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

const NavBar = () => {
    const navigate = useNavigate();
    const showMobileLayout = isMobile();
    const { user, logout } = useContext(AuthContext);
    const [open, setOpenDrawer] = React.useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [showMobileNavMenu, setShowMobileNavMenu] = React.useState<null | HTMLElement>(null);
    const [mobileNavMenuItems, setMobileNavMenuItems] = React.useState<any[]>([]);
    const [showProfileMenu, setShowProfileMenu] = React.useState<null | HTMLElement>(null);
    const [profileMenuItems, setProfileMenuItems] = React.useState<string[]>([]);

    const navigationItems = [
        {
            route: '/',
            name: navigation.home,
            icon: HomeOutlinedIcon,
            show: true,
        },
    ];

    useEffect(() => {
        setProfileMenuItems([user ? navigation.logout : navigation.login]);
        setMobileNavMenuItems(navigationItems);
        handleDrawerClose();
        setShowMobileNavMenu(null);
    }, [user, isMobile()]);

    const handleMenuOpen = (event: any) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
        showProfileMenu ? setShowProfileMenu(null) : setShowProfileMenu(event?.currentTarget);
    };

    const handleNavigationMenu = (event?: any) => {
        if (showMobileLayout) {
            showMobileNavMenu ? setShowMobileNavMenu(null) : setShowMobileNavMenu(event?.currentTarget);
        } else {
            setOpenDrawer(!open);
        }
    };

    const authHandler = () => {
        user ? logout() : navigate('/login');
        setShowProfileMenu(null);
        setProfileMenuItems([user ? navigation.logout : navigation.login]);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };

    return (
        <div>
            <AppBar color='primary' position='fixed' open={open}>
                <Container sx={{ minWidth: '100%' }}>
                    <Toolbar disableGutters>
                        <IconButton
                            color='inherit'
                            aria-label='open drawer'
                            onClick={handleNavigationMenu}
                            edge='start'
                            sx={{
                                marginRight: { xs: 1, sm: 3 },
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                            <Menu
                                sx={{ mt: '45px' }}
                                id='mobile nav menu'
                                anchorEl={showMobileNavMenu}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(showMobileNavMenu)}
                                onClose={handleNavigationMenu}
                            >
                                {mobileNavMenuItems?.map((menuItem, index) => (
                                    <div key={index}>
                                        {menuItem?.show && (
                                            <MenuItem component={Link} to={menuItem?.route}>
                                                <Typography textAlign='center'>{menuItem?.name}</Typography>
                                            </MenuItem>
                                        )}
                                    </div>
                                ))}
                            </Menu>
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }}>
                            <a
                                href='/'
                                style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                }}
                            >
                                EncryptoChat
                            </a>
                        </Box>
                        <div>
                            <Button
                                aria-controls='menu1'
                                aria-haspopup='true'
                                onClick={handleMenuOpen}
                                variant='contained'
                                sx={{
                                    padding: '0 10px',
                                    mr: 1,
                                    borderRadius: '40px',
                                    border: '1px solid white',
                                }}
                                startIcon={<AddIcon />}
                            >
                                New
                            </Button>
                            <Menu id='menu1' anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                <List sx={{ padding: '0px', minWidth: '265px' }}>
                                    <ListItemButton
                                        component={Link}
                                        to='/groups/create'
                                        sx={{ pl: 3 }}
                                        onClick={handleMenuClose}
                                    >
                                        <ListItemIcon sx={{ mr: -2 }}>
                                            <GroupAddIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={navigation.group} />
                                    </ListItemButton>
                                </List>
                            </Menu>
                        </div>
                        <Box sx={{ display: 'flex', flexGrow: 0, gap: 1 }}>
                            <IconButton
                                size='small'
                                sx={{ color: 'white' }}
                                onClick={handleProfileMenu}
                                aria-label={open ? 'account-menu' : undefined}
                                aria-haspopup='true'
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <PersonIcon />
                            </IconButton>
                            <Menu
                                sx={{ mt: '45px' }}
                                id='profile menu'
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                anchorEl={showProfileMenu}
                                onClose={handleProfileMenu}
                                open={Boolean(showProfileMenu)}
                            >
                                {profileMenuItems?.map(menuItem => (
                                    <MenuItem key={menuItem} onClick={authHandler} sx={{ paddingBottom: '12px' }}>
                                        <Typography textAlign='center'>{menuItem}</Typography>
                                    </MenuItem>
                                ))}

                                <Box className='menu-footer'>
                                    <span>
                                        {user?.first_name} {user?.last_name}
                                    </span>
                                    <span> {user?.username}</span>
                                </Box>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            {!showMobileLayout && <SideDrawer open={open} handleDrawer={handleNavigationMenu} />}
        </div>
    );
};

export default NavBar;
