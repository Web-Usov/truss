import {connect} from 'react-redux'
import Home from './home'
import { AppState } from '../../reducers';
import { Dispatch, bindActionCreators } from 'redux';
import * as homeActions from './homeActions';

const mapStateToProps =  ({home}: AppState) => ({
    title:home.title,
})
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({...homeActions}, dispatch)

export default connect(mapStateToProps,mapDispatchToProps)(Home);