import { createTheme } from '@mui/material/styles';

const customizeTheme = createTheme({
    palette: {
        mode: "dark",
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            boxShadow: 'none',
                            '-webkit-box-shadow': 'none',
                        },
                        '&:hover fieldset': {
                            boxShadow: 'none',
                        },
                        '&.Mui-focused fieldset': {
                            boxShadow: 'none',
                        },
                        '& .MuiInputBase-input.MuiOutlinedInput-input:-webkit-autofill': {
                            backgroundColor: 'transparent',
                            color: 'inherit',
                            boxShadow: 'none',
                        },
                    },
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    '&:before': {
                        borderBottom: '0px !important',
                    },
                    '&:after': {
                        borderBottom: '0px !important',
                    },
                    '&:hover:not(.Mui-disabled):before': {
                        borderBottom: '0px !important',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '5px 0'
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    background: '#3b3b3b'
                }
            }
        }
    },
});

export default customizeTheme;