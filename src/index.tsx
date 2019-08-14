import React from 'react';
import ReactDOM from 'react-dom';
import { history } from './utils';
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
    <Root/>,
    document.getElementById('root')
);