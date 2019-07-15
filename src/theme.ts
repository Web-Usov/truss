
import {  createMuiTheme } from '@material-ui/core';
const theme = createMuiTheme({
    palette: {
        primary: {
            // dark: "#067d93",
            dark:"#0A4467",
            // main: "#09B4D3",
            main: "#1e779e",
            // light: "#3ac3db"
            light:'#51A8D6'
        },
        secondary: {
            dark: "#a83e19",
            main: "#f15a24",
            light: "#f37b4f"
        },
        background:{
            default:'linear-gradient(35deg, #6863bf 0%, #067d93 50%, #e68a68 100%)'
        }  
        
    },
});

export default theme