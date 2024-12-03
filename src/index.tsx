import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import './index.css';
import App from './App';
import store from './reducer/store/store'
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXlfcXRcRWRdVkBzWUQ=');
const container = document.getElementById('root') as HTMLElement;

const root = ReactDOM.createRoot(container);

root.render(
    <Provider store={store}>
      <App />
    </Provider>
);
