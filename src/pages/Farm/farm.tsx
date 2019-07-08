import * as React from 'react'
import logo from './logo.svg'
import { IFarmState } from './farmReducer';
import { navPath } from '../../navigation';
import { Link } from 'react-router-dom';

export interface IFarmProps extends IFarmState {
    incCounter: () => void
}

export default class Farm extends React.Component<IFarmProps> {
    _incCounter() {
        this.props.incCounter()
    }
    render() {
        return <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>TypeScript - pain first, then nice</p>
                <Link
                    to={navPath.HOME_PAGE}
                    className="App-link">
                    {"To Home"}
                </Link>
                <span>Count: {this.props.counter} </span>
                <button
                    className="btn"
                    onClick={this._incCounter.bind(this)}
                >Inc++</button>
            </header>
        </div>
    }
}