import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import App from './app';
import { BrowserRouter } from 'react-router-dom';
import LanguageProvider from 'components/Language';
import "cropperjs/dist/cropper.css";
// import './setupProxy'

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider >
        <App />
      </LanguageProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
