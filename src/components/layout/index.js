import { Box, Toolbar } from '@mui/material';
import withAuth from "../hoc/auth";
import NavBar from '../navbar';
import Sidebar from '../sidebar';

const drawerWidth = 240;

function Layout({ children, pageTitle }) {

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <NavBar
                    drawerWidth={drawerWidth}
                    pageTitle={pageTitle}
                />
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                    <Sidebar />
                </Box>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                >
                    <Toolbar />
                    {children}
                </Box>
            </Box>
        </>
    )
}

export default withAuth(Layout);