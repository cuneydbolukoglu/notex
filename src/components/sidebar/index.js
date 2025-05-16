import { Drawer, Toolbar, Typography, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive, faTags, faNotesMedical } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { useTagsStore } from "@/zustand";

const drawerWidth = 240;

const Sidebar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [tag, setTag] = useState([]);
    const { tags, getTags } = useTagsStore();
    const menu = [
        { name: "All Notes", url: "/", icon: faNotesMedical },
        { name: "Archived Notes", url: "/archived-notes", icon: faArchive }
    ];

    useEffect(() => {
        getTags();
    }, []);

    useEffect(() => {
        setTag(tags);
    }, [tags]);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const drawerContent = (
        <>
            <Toolbar>
                <Typography variant="h4">
                    <FontAwesomeIcon icon={faNotesMedical} /> NoteX
                </Typography>
            </Toolbar>
            <List>
                {menu?.map((item) => (
                    <Link href={item.url}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon style={{ fontSize: 20 }}>
                                    <FontAwesomeIcon icon={item.icon} />
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
            <Divider />
            <Typography variant="caption" sx={{ px: 2, pt: 2, fontWeight: 600 }}>
                Tags
            </Typography>
            <List>
                {tag?.map((item) => (
                    <ListItem key={item.value} disablePadding>
                        <ListItemButton>
                            <ListItemIcon style={{ fontSize: 20 }}>
                                <FontAwesomeIcon icon={faTags} />
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </>
    );

    return (
        <>
            {/* Mobil Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerClose}
                onTransitionEnd={handleDrawerTransitionEnd}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                slotProps={{
                    root: { keepMounted: true },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Kalıcı Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Sidebar;