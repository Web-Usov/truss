import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Helment from 'react-helmet'
import {CssBaseline} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { UIFarm, Home } from './pages'
import { navPath } from './navigation'
import {consts} from './static/';
import { theme } from './utils/UI';

interface IAppProps {}

class App extends React.Component<IAppProps> {
	render() {
		return (
			<React.Fragment>
				<Helment
					htmlAttributes={{"leng":"en"}}
					titleTemplate="Truss - %s"
					defaultTitle={consts.title}
					link={[
						{"rel":"shortcut icon", "href":consts.bridgeIcon_2},
						{"rel":"image_src", "href":consts.airBridge},
						{"rel":"stylesheet", "href":'https://fonts.googleapis.com/css?family=Roboto:300,400,500'},
						{"rel":"stylesheet", "href":'https://fonts.googleapis.com/icon?family=Material+Icons'}
					]}
					meta={[
						{"charSet":"utf-8"},
						{"name": "viewport", "content": "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" },
						{"name": "theme-color", "content": "#000000" },
						{"name": "description", "content": consts.description },
						{"property": "og:type", "content": "website"},
						{"property": "og:title", "content": consts.title},
						{"property": "og:image", "content": consts.airBridge},
						{"property": "vk:image", "content": consts.airBridge},
						{"property": "twitter:image", "content": consts.airBridge},
						{"property": "og:url", "content": consts.url},
					]}

				/>
				<CssBaseline/>
				<ThemeProvider theme={theme}>
					<Switch>
						<Route path={navPath.HOME_PAGE} component={Home} exact />
						<Route path={navPath.FARM_PAGE} component={UIFarm} />
					</Switch>

				</ThemeProvider>

			</React.Fragment>
		)
	}
}


export default App;
