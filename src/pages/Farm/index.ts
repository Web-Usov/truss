import {connect} from 'react-redux'
import UIFarm from './farm'
import { AppState } from 'src/store';
import { Dispatch, bindActionCreators } from 'redux';
import * as farmActions from './farmActions';

const mapStateToProps =  (state: AppState) => ({
    workSpace:state.farm.workSpace,
})
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({...farmActions}, dispatch)

export default connect(mapStateToProps,mapDispatchToProps)(UIFarm);