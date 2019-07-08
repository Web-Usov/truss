import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { history } from './utils';
import { mainReducer } from './reducers';
import { HashRouter, Router } from 'react-router-dom';
import App from './App';
import './index.css';

const isGitHubPages = process.env.REACT_APP_GHP || false;
const store = createStore(mainReducer);

ReactDOM.render(
    <Provider store={store}>
        {
            isGitHubPages ?
                <HashRouter>
                    <App />
                </HashRouter> :
                <Router history={history}>
                    <App />
                </Router>
        }

    </Provider>,
    document.getElementById('root')
);