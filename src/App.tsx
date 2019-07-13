import * as React from 'react';
import { UIFarm, Home } from './pages'
import { navPath } from './navigation'
import { Switch, Route } from 'react-router-dom';
import Helment from 'react-helmet'
import * as consts from './static/const';
import './App.css';

interface IAppProps {

}

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
						{"rel":"image_src", "href":consts.ogImage},
					]}
					meta={[
						{"charSet":"utf-8"},
						{"name": "viewport", "content": "width=device-width, initial-scale=1" },
						{"name": "theme-color", "content": "#000000" },
						{"name": "description", "content": consts.description },
						{"property": "og:type", "content": "website"},
						{"property": "og:title", "content": consts.title},
						{"property": "og:image", "content": consts.ogImage},
						{"property": "vk:image", "content": consts.ogImage},
						{"property": "twitter:image", "content": consts.ogImage},
						{"property": "og:image:width", "content": "1200"},
						{"property": "og:image:height", "content": "600"},
						{"property": "og:url", "content": consts.url},
					]}

				/>
				<main>
					<Switch>
						<Route path={navPath.HOME_PAGE} component={Home} exact />
						<Route path={navPath.FARM_PAGE} component={UIFarm} />
					</Switch>
				</main>

			</React.Fragment>
		)
	}
}


export default App;
