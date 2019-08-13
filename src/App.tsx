import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Helment from 'react-helmet'
import {CssBaseline} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { FarmPage, Home } from './pages'
import { navPath } from './navigation'
import {str, img} from './static/const';
import { theme } from './utils/UI';

interface IAppProps {}

class App extends React.Component<IAppProps> {
	render() {
		return (
			<React.Fragment>
				<Helment
					htmlAttributes={{"leng":"en"}}
					titleTemplate="Truss - %s"
					defaultTitle={str.title}
					link={[
						{"rel":"shortcut icon", "href":img.bridgeIcon_2},
						{"rel":"image_src", "href":img.airBridge},
						{"rel":"stylesheet", "href":'https://fonts.googleapis.com/css?family=Roboto:300,400,500'},
						{"rel":"stylesheet", "href":'https://fonts.googleapis.com/icon?family=Material+Icons'}
					]}
					meta={[
						{"charSet":"utf-8"},
						{"name": "viewport", "content": "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" },
						{"name": "theme-color", "content": "#000000" },
						{"name": "description", "content": str.description },
						{"property": "og:type", "content": "website"},
						{"property": "og:title", "content": str.title},
						{"property": "og:image", "content": img.airBridge},
						{"property": "vk:image", "content": img.airBridge},
						{"property": "twitter:image", "content": img.airBridge},
						{"property": "og:url", "content": str.url},
					]}

				/>
				<CssBaseline/>
				<ThemeProvider theme={theme}>
					<Switch>
						<Route path={navPath.HOME_PAGE} component={Home} exact />
						<Route path={navPath.FARM_PAGE} component={FarmPage} />
					</Switch>

				</ThemeProvider>

			</React.Fragment>
		)
	}
}


export default App;
