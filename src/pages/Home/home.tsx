import * as React from 'react'
import { IHomeStore } from 'src/store/home/homeReducer';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core'
import { HomeHeader } from './components';

const styles = (theme: Theme) => createStyles({
	root: {
		width:'100%',
		minHeight:'100%',
		display:'block',
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