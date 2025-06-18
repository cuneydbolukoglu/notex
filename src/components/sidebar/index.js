import { Drawer, Toolbar, Typography, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive, faTags, faNotesMedical, faTrash, faNoteSticky, faStar } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { useTagsStore } from "@/zustand";
import { usePathname } from 'next/navigation';

const drawerWidth = 240;

const Sidebar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [tag, setTag] = useState([]);
    const { tags, getTags, removeTags } = useTagsStore();
    const menu = [
        { name: "All Notes", url: "/", icon: faNoteSticky },
        { name: "Archived Notes", url: "/archived-notes", icon: faArchive },
        { name: "Trash Box", url: "/trash-box", icon: faTrash },
    ];
    const pathname = usePathname();

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
                {menu?.map((item) => {
                    const isActive = pathname === item.url;

                    return (
                        <Link href={item.url} key={item.url} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    selected={isActive}
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: '#1e1e1e',
                                            color: 'white',
                                        },
                                        '&.Mui-selected:hover': {
                                            backgroundColor: '#ffffff14',
                                        }
                                    }}
                                >
                                    <ListItemIcon style={{ fontSize: 20 }}>
                                        <FontAwesomeIcon icon={item.icon} />
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    )
                })}
            </List>
            <Divider />
            <Typography variant="caption" sx={{ px: 2, pt: 2, fontWeight: 600 }}>
                Tags
            </Typography>
            <List>
                {tag?.map((item, index) => (
                    <ListItem
                        key={item.value}
                        disablePadding
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete" className="delete-button" 
                            onClick={() => {
                                removeTags(item.id);
                                getTags()
                            }}>
                                <FontAwesomeIcon icon={faTrash} size='2xs' />
                            </IconButton>
                        }
                    >
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