import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import Root from './components/root';
import {login, register} from './actions/session_actions';
import configureStore from './store/store';

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    window.login = login;
    window.register = register;
    // window.currentSession = currentSession;
    let store = configureStore();
    window.dispatch = store.dispatch;
    window.getState = store.getState;

    ReactDOM.render(<Root store={store}/>, root);
    

})
