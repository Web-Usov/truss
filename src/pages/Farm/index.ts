import {connect} from 'react-redux'
import Farm from './farm'
import { AppState } from '../../reducers';
import { Dispatch, bindActionCreators } from 'redux';
import * as farmActions from './farmActions';

const mapStateToProps =  ({farm}: AppState) => ({
    title:farm.title,
    counter:farm.counter
})
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({...farmActions}, dispatch)

export default connect(mapStateToProps,mapDispatchToProps)(Farm);