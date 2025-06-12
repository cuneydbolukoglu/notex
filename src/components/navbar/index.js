import { AppBar, Toolbar, Typography, IconButton, Avatar, Box, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import SearchBar from '../searchbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import utils from '@/utils';
import { useRouter } from 'next/router';
import axiosInstance from '@/services/axiosInstance';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NavBar({ drawerWidth, pageTitle }) {
    const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const refreshToken = utils.cookieManager.get("refreshToken");
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState(null);
    const [user, setUser] = useState([]);
    const [avatar, setAvatar] = useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        setTimeout(setUser(userData), 30000);
    }, []);

    useEffect(() => {
        user.map(item => {
            if (!item.displayname == "") {
                setAvatar(item.displayname.charAt(0).toUpperCase());
            } else {
                setAvatar(item.email.charAt(0).toUpperCase());
            }
        })
    }, [user]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = () => {
        const URL = `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`;

        try {
            const response = axiosInstance.post(URL, {
                grant_type: "refresh_token",
                refresh_token: refreshToken
            }, {
                headers: { "Content-Type": "application/json" }
            });
            utils.cookieManager.delete("token");
            utils.cookieManager.delete("refreshToken");
            localStorage.removeItem("user");
            router.push("/auth/login");
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <AppBar
            component="nav"
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
            }}
        >
            <Toolbar>
                <IconButton
                    size="medium"
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                // onClick={handleDrawerToggle}
                >
                    <FontAwesomeIcon icon={faBars} />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {pageTitle}
                </Typography>
                <SearchBar />
                <IconButton aria-label="logout" size='small' onClick={() => logout()}>
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>{avatar}</Avatar>
                    </IconButton>
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleClose} disabled>
                        {user[0]?.displayName || user[0]?.email}
                    </MenuItem>
                    <Divider />
                    <Link href="/profile">
                        <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                <FontAwesomeIcon icon={faGear} />
                            </ListItemIcon>
                            Profile
                        </MenuItem>
                    </Link>
                    <MenuItem onClick={logout}>
                        <ListItemIcon>
                            <FontAwesomeIcon icon={faRightFromBracket} />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    )
}