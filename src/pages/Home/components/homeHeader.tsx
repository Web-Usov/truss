import * as React from 'react'
import { consts } from 'src/static';
import { Typography, Button, Theme, createStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { navPath } from 'src/navigation';
import { WithStyles, withStyles } from '@material-ui/styles';


const styles = (theme: Theme) => createStyles({
	root:{
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "flex-start",

	},
	logo: {
		width: "20%",
		height:'20%'
	},
	title: {
		padding: 40
	},
	descripton: {
		padding: 40
	},
	btn: {

	}
})


const HomeHeader = ({classes} : WithStyles<typeof styles>) => {
	return (
		<header className={classes.root}>
			<img 
				src={consts.bridgeIcon_2} 
				alt="logo" 
				className={classes.logo} 
			/>
			<Typography variant="h3" className={classes.title}>
				{consts.title}
			</Typography>
			<Typography variant="subtitle1" align="center" className={classes.descripton}>
				{consts.description}
			</Typography>
			<Button
				component={Link}
				to={navPath.FARM_PAGE}
				variant="contained"
				size="large"
				color="secondary"
			>
				Поехали
			</Button>
		</header>

	)
}

export default withStyles(styles)(HomeHeader)