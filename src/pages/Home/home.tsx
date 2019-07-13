import * as React from 'react'
import { IHomeStore, defaultHomeState } from './homeReducer';
import { navPath } from '../../navigation';
import { Link } from 'react-router-dom';
import { consts } from 'src/static';

export interface IHomeProps extends IHomeStore {
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
                <img src={consts.bridgeIcon_2} className="App-logo" alt="logo" />
                <h3>{consts.title}</h3>
                <p style={{
                    width:"800px",
                    fontSize:18
                }}>{consts.description}</p>
                <Link
                    to={navPath.FARM_PAGE}
                    className="App-link">
                    Поехали!
                </Link>
            </header>
        </div>
    }
}