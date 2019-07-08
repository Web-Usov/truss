import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { history } from './utils';
import { mainReducer } from './reducers';
import { Router } from 'react-router-dom';
import App from './App';
import './index.css';

const store = createStore(mainReducer);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);