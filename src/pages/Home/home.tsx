import * as React from 'react'
import { IHomeStore } from './homeReducer';
import {  colors } from 'src/static';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core'
import { HomeHeader } from './components';

const styles = (theme: Theme) => createStyles({
	root: {
		minWidth: window.innerWidth,
		minHeight: window.innerHeight,
		background: theme.palette.background.default,
		padding: theme.spacing(4)
	}
})

export interface IHomeProps extends IHomeStore, WithStyles<typeof styles> {
	setTitle: (title: string) => void,
}

class Home extends React.Component<IHomeProps> {
	render() {
		const { classes } = this.props
		return (
			<div className={classes.root}>
				<HomeHeader/>
			</div>
		)
	}
}

export default withStyles(styles)(Home)