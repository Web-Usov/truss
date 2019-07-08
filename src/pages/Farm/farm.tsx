import * as React from 'react'
import logo from './logo.svg'
import { IFarmState, defaultFarmState } from './farmReducer';
import { incCounter } from './farmActions';

export interface IFarmProps extends IFarmState {
    setTitle: (title: string) => void,
    incCounter: () => void
}

export default class Farm extends React.Component<IFarmProps> {
    _setTitle() {
        const title = this.props.title === defaultFarmState.title ? "It's works!" : defaultFarmState.title
        this.props.setTitle(title + '')
    }
    _incCounter() {
        this.props.incCounter()
    }
    render() {
        return <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>TypeScript - сначала боль, потом приятно</p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {this.props.title || "Dr"}
                </a>
                <button
                    className="btn"
                    onClick={this._setTitle.bind(this)}
                >Change title</button>
                <span>Count: {this.props.counter} </span>
                <button
                    className="btn"
                    onClick={this._incCounter.bind(this)}
                >Inc++</button>
            </header>
        </div>
    }
}