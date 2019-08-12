import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { history } from './utils';
import store from './store';
import { HashRouter, Router } from 'react-router-dom';
import App from './App';
import './index.css';

const isGitHubPages = process.env.REACT_APP_GHP === 'true' || false;

const Root = () => {    
    if (isGitHubPages) return (
        <HashRouter>
            <App />
        </HashRouter>
    )
    else return (
        <Router history={history}>
            <App />
        </Router>
    )
}


ReactDOM.render(
    <Provider store={store}>
        <Root/>
    </Provider>,
    document.getElementById('root')
);