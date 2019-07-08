import * as React from 'react'
import logo from './logo.svg'
import { IHomeState, defaultHomeState } from './homeReducer';
import { navPath } from '../../navigation';
import { Link } from 'react-router-dom';

export interface IHomeProps extends IHomeState {
    setTitle: (title: string) => void,
}

export default class Home extends React.Component<IHomeProps> {
    _setTitle() {
        const title = this.props.title === defaultHomeState.title ? "To Farm" : defaultHomeState.title
        this.props.setTitle(title + '')
    }
    render() {
        return <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>TypeScript - pain first, then nice</p>
                <Link
                    to={navPath.FARM_PAGE}
                    className="App-link">
                    {this.props.title || "To Farm )"}
                </Link>

                <button
                    className="btn"
                    onClick={this._setTitle.bind(this)}
                >Change title</button>
            </header>
        </div>
    }
}