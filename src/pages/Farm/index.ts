import {connect} from 'react-redux'
import UIFarm from './farm'
import { AppState } from 'src/store';
import { Dispatch, bindActionCreators } from 'redux';
import { FarmController} from './store/';

const mapStateToProps =  (state: AppState) => ({
    nodes:state.farm.nodes,
    beams:state.farm.beams,
    forces:state.farm.forces
})
// const mapDispatchToProps = (dispatch: Dispatch) => ({
//     addNode: bindActionCreators(FarmController.addNode,dispatch),
//     moveNode:bindActionCreators(FarmController.moveNode,dispatch)
// })
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({...FarmController}, dispatch)

export default connect(mapStateToProps,mapDispatchToProps)(UIFarm);