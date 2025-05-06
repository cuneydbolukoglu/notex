import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import SearchBar from '../searchbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import utils from '@/utils';
import { useRouter } from 'next/router';
import axiosInstance from '@/services/axiosInstance';

export default function NavBar({ drawerWidth, pageTitle }) {
    const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const refreshToken = utils.cookieManager.get("refreshToken");
    const router = useRouter();

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
            router.push("/login");
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
                    <FontAwesomeIcon icon={faRightFromBracket} />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}
