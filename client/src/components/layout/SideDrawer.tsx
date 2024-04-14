import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { Drawer, DrawerHeader } from '../../utils/helpers/navBarStyles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { navigation } from '../../resources/Text';
import { useContext, useEffect, useState } from 'react';
import { MessageGroup } from '../../types/interfaces';
import AuthContext from '../../context/AuthContext';
import UseAxios from '../../utils/UseAxios';
import NameAvatar from '../shared/NameAvatar';

interface SideDrawerProps {
    open: boolean;
    handleDrawer: () => void;
}

const SideDrawer = ({ open, handleDrawer }: SideDrawerProps) => {
    const theme = useTheme();
    const [userMessageGroups, setUserMessageGroups] = useState<MessageGroup[]>();
    const { user } = useContext(AuthContext);
    const api = UseAxios();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroups = async () => {
            if (!user) {
                return;
            }
            try {
                const { data } = await api.get(`/messages/groups/?usergroup__user__id=${user?.id}`);
                setUserMessageGroups(data?.results);
            } catch (err) {
                console.error(`Error in fetching groups ${err}`);
            }
        };

        fetchGroups();
    }, []);

    const handleDrawerClose = () => {
        // close any popups that are open
        handleDrawer();
    };

    return (
        <Drawer variant='permanent' open={open}>
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme?.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                </IconButton>
            </DrawerHeader>
            <List>
                <ListItem key='dashboard' disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        sx={{
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        component={Link}
                        to='/'
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <HomeOutlinedIcon className='w-8 h-8' />
                        </ListItemIcon>
                        <ListItemText primary={navigation?.home} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>
                {userMessageGroups?.map(group => (
                    <ListItem key={group?.id} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            onClick={() => {
                                navigate(`/messages/${group?.id}`);
                                window.location.reload();
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    ml: open ? -1 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <NameAvatar name={group?.group_name} />
                            </ListItemIcon>
                            <ListItemText
                                primary={group?.group_name}
                                sx={{
                                    opacity: open ? 1 : 0,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default SideDrawer;
