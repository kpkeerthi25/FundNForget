import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PrivyProvider } from '@privy-io/react-auth';
import reportWebVitals from './reportWebVitals';
import { InvestorProvider } from './context/InvestorContext';
import logo from './assets/images/logo.png';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <InvestorProvider>
      <PrivyProvider
        appId="cm3jozg0802fig6vusm97pu3h"
        config={{
          loginMethods: ['wallet'],
          appearance: {
            theme: 'light',
            accentColor: '#818CF8',
            logo, 
          },
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
        }}
      >
        <App />
      </PrivyProvider>
    </InvestorProvider>
  </React.StrictMode>
);

reportWebVitals();
