import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider , createTheme} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#BBE6E4',
      second: '#F0F6F6',
      third: '#084B83',
      celeste: '#B1EDE8',
      eggplant: '#6D435A',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
