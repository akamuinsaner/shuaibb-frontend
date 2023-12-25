import { createTheme } from '@mui/material/styles';
import { teal, orange, deepPurple } from '@mui/material/colors';

const mainTheme = createTheme({
    palette: {
        primary: deepPurple,
        secondary: orange,
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export {
    mainTheme,
    darkTheme
}