import * as React from 'react';
import { Farm, Home } from './pages'
import { navPath } from './navigation'
import { Switch, Route } from 'react-router-dom';
import './App.css';

class App extends React.Component {
	render() {
		return (
			<main>
				<Switch>
					<Route path={navPath.HOME_PAGE} component={Home} exact />
					<Route path={navPath.FARM_PAGE} component={Farm} />
				</Switch>
			</main>)
	}
}


export default App;
