import { createTheme } from '@mui/material/styles';
import { lime, purple } from '@mui/material/colors';

const mainTheme = createTheme({
  palette: {
    primary: lime,
    secondary: purple
  },
});

export default mainTheme;