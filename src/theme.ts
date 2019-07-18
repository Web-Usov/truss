
import {  createMuiTheme } from '@material-ui/core';
const theme = createMuiTheme({
    palette: {
        primary: {
            dark:"#0A4467",
            main: "#1e779e",
            light:'#51A8D6'
        },
        secondary: {
            dark: "#a83e19",
            main: "#f15a24",
            light: "#F39B7C"
        },
        background:{
            default:'linear-gradient(35deg, #6863bf 0%, #067d93 50%, #e68a68 100%)'
        }  
        
    },
});

export default theme