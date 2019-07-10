import * as React from 'react';
import { UIFarm, Home } from './pages'
import { navPath } from './navigation'
import { Switch, Route } from 'react-router-dom';
import './App.css';

interface IAppProps {

}

class App extends React.Component<IAppProps> {
	constructor(props : IAppProps){
		super(props)
		document.title = "Truss - ферма для каждого"
	}
	render() {
		return (
			<main>
				<Switch>
					<Route path={navPath.HOME_PAGE} component={Home} exact />
					<Route path={navPath.FARM_PAGE} component={UIFarm} />
				</Switch>
			</main>
		)
	}
}


export default App;
