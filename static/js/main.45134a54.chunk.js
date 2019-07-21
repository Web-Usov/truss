(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{116:function(e,t,n){e.exports=n(185)},184:function(e,t,n){},185:function(e,t,n){"use strict";n.r(t);var a={};n.r(a),n.d(a,"update",function(){return Oe});var i={};n.r(i),n.d(i,"setTitle",function(){return _e});var r,o=n(0),c=n.n(o),s=n(15),l=n.n(s),d=n(53),u=n(31),m=(Object(u.a)(),n(16)),h=n(14),f=n(35),g=function(){function e(){Object(m.a)(this,e)}return Object(h.a)(e,null,[{key:"angleBePoints",value:function(e,t,n,a){return Math.atan2(-t+a,-e+n)/Math.PI}},{key:"lengthBePoints",value:function(e,t,n,a){return Math.sqrt(Math.pow(e-n,2)+Math.pow(t-a,2))}},{key:"cellX",value:function(e){return Math.round(e/f.UI_cellSize)*f.UI_cellSize}},{key:"cellY",value:function(e){return Math.round(e/f.UI_cellSize)*f.UI_cellSize}}]),e}(),v=n(40),p=n(24),y=n(23),b=n(25),E=function e(t){Object(m.a)(this,e),this.id=void 0,this.x=void 0,this.y=void 0,this.angle=void 0,this.name=void 0,this.newX=void 0,this.newY=void 0,this.id=Date.now(),this.x=t.x||0,this.y=t.y||0,this.angle=t.angle||0,this.name=t.name||this.id+"",this.newX=this.x,this.newY=this.y},k=function(e){function t(e){var n;return Object(m.a)(this,t),(n=Object(p.a)(this,Object(y.a)(t).call(this,e))).beamsID=void 0,n.forcesID=void 0,n.beamsID=e.beamsID||[],n.forcesID=e.forcesID||[],n}return Object(b.a)(t,e),Object(h.a)(t,[{key:"connectBeam",value:function(e){return!this.beamsID.find(function(t){return t===e})&&(this.beamsID.push(e),!0)}},{key:"removeBeam",value:function(e){this.beamsID=this.beamsID.filter(function(t){return t!==e})}},{key:"connectForce",value:function(e){this.forcesID.find(function(t){return t===e})||this.forcesID.push(e)}},{key:"removeForce",value:function(e){this.beamsID=this.forcesID.filter(function(t){return t!==e})}}]),t}(E),w=function(e){function t(e){var n;return Object(m.a)(this,t),(n=Object(p.a)(this,Object(y.a)(t).call(this,e))).length=void 0,n.startConnectedNodeID=void 0,n.endConnectedNodeID=void 0,n.newAngle=void 0,n.length=e.length||0,n.startConnectedNodeID=e.startConnectedNodeID||0,n.endConnectedNodeID=e.endConnectedNodeID||0,n.newAngle=n.angle,n}return Object(b.a)(t,e),Object(h.a)(t,[{key:"connectNode",value:function(e,t){switch(t){case"start":this.startConnectedNodeID=e;break;case"end":this.endConnectedNodeID=e}}},{key:"removeNode",value:function(e){"start"===e?this.startConnectedNodeID=0:this.endConnectedNodeID=0}},{key:"getEndX",value:function(){return this.x+this.length*Math.cos(this.angle*Math.PI)}},{key:"getEndY",value:function(){return this.y+this.length*Math.sin(this.angle*Math.PI)}},{key:"moveStartPoint",value:function(e,t){var n=this.getEndX(),a=this.getEndY();this.x=e,this.y=t,this.angle=g.angleBePoints(e,t,n,a),this.length=g.lengthBePoints(e,t,n,a)}},{key:"moveEndPoint",value:function(e,t){this.angle=g.angleBePoints(this.x,this.y,e,t),this.length=g.lengthBePoints(this.x,this.y,e,t)}}]),t}(E),N=function(){function e(t){Object(m.a)(this,e),this.fixedNodes=void 0,this.forces=void 0,this.nodes=void 0,this.beams=void 0,this.time=void 0,this.nodes=t?t.nodes:new Map,this.fixedNodes=t?t.fixedNodes:new Map,this.forces=t?t.forces:new Map,this.beams=t?t.beams:new Map,this.time=Date.now()}return Object(h.a)(e,[{key:"addNode",value:function(e,t,n){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"";if(this.getNodes().find(function(n){return n.x===e&&n.y===t}))return!1;var i=new k({x:e,y:t,angle:n,name:a});return this.nodes.set(i.id,i),!0}},{key:"addBeam",value:function(e,t){var n=new w({x:e,y:t});return this.beams.set(n.id,n),n}},{key:"deleteNode",value:function(e){this.nodes.delete(e)}},{key:"deleteBeam",value:function(e){this.beams.delete(e)}},{key:"getNode",value:function(e){var t=this.nodes.get(e);if(!t)throw Error("\u041d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d \u0443\u0437\u0435\u043b \u0441 ID ".concat(e));return t}},{key:"getBeam",value:function(e){var t=this.beams.get(e);if(!t)throw Error("\u041d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d \u043b\u0443\u0447 \u0441 ID ".concat(e));return t}},{key:"getForce",value:function(e){var t=this.forces.get(e);if(!t)throw Error("\u041d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430 \u0441\u0438\u043b\u0430 \u0441 ID ".concat(e));return t}},{key:"getNodes",value:function(){var e=[],t=!0,n=!1,a=void 0;try{for(var i,r=this.nodes.values()[Symbol.iterator]();!(t=(i=r.next()).done);t=!0){var o=i.value;e.push(o)}}catch(c){n=!0,a=c}finally{try{t||null==r.return||r.return()}finally{if(n)throw a}}return e}},{key:"getBeams",value:function(){var e=[],t=!0,n=!1,a=void 0;try{for(var i,r=this.beams.values()[Symbol.iterator]();!(t=(i=r.next()).done);t=!0){var o=i.value;e.push(o)}}catch(c){n=!0,a=c}finally{try{t||null==r.return||r.return()}finally{if(n)throw a}}return e}},{key:"getForcesOnNode",value:function(e){var t=this;return this.getNode(e).forcesID.map(function(e){return t.getForce(e)})}},{key:"getBeamsOnNode",value:function(e){var t=this;return this.getNode(e).beamsID.map(function(e){return t.getBeam(e)})}},{key:"getNodesOnBeam",value:function(e){var t=this.getBeam(e),n=t.startConnectedNodeID,a=t.endConnectedNodeID;return[this.getNode(n),this.getNode(a)]}},{key:"connectBeamToNode",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"start",a=e instanceof w?e:this.getBeam(e),i=t instanceof k?t:this.getNode(t);switch(n){case"start":a.connectNode(i.id,"start"),i.connectBeam(a.id);break;case"end":if(this.getBeamsOnNode(a.startConnectedNodeID).find(function(e){return e.startConnectedNodeID===a.startConnectedNodeID&&e.endConnectedNodeID===i.id||e.startConnectedNodeID===i.id&&e.endConnectedNodeID===a.startConnectedNodeID||e.id===a.id&&e.endConnectedNodeID===a.id})||!i.connectBeam(a.id))return!1;a.moveEndPoint(i.x,i.y),a.connectNode(i.id,"end");break;default:return!1}return!0}},{key:"deleteEntity",value:function(e){var t=this;if(e instanceof k)e.beamsID.map(function(e){return t.getBeam(e)}).forEach(function(n){n.startConnectedNodeID===e.id?t.getNode(n.endConnectedNodeID).removeBeam(n.id):t.getNode(n.startConnectedNodeID).removeBeam(n.id),t.deleteBeam(n.id)}),this.deleteNode(e.id);else if(e instanceof w)[e.startConnectedNodeID,e.endConnectedNodeID].forEach(function(n){n>0&&t.getNode(n).removeBeam(e.id)}),this.deleteBeam(e.id);else if(e instanceof E){var n=this.nodes.get(e.id)||this.beams.get(e.id);n&&this.deleteEntity(n)}else{var a=this.nodes.get(e)||this.beams.get(e);a&&this.deleteEntity(a)}}},{key:"moveNodeTo",value:function(e,t,n){var a=this,i=this.getNode(e);i.x=t,i.y=n,i.beamsID.forEach(function(i){var r=a.getBeam(i);r.startConnectedNodeID===e?r.moveStartPoint(t,n):r.endConnectedNodeID===e&&r.moveEndPoint(t,n)})}}]),e}(),O={workSpace:new N},S=n(54),j={title:"Hello, world!"},I=Object(v.b)({farm:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:O,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"FARM_UPDATE":return{workSpace:new N(t.workSpace)};default:return e}},home:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:j,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"SET_TITLE":return Object(S.a)({},e,{title:t.title});default:return e}}}),B=Object(v.c)(I),D=n(58),C=n(45),x=n(20),M=n(103),_=n(238),T=n(234),P=n(5),z=n(34),F=n(212),W=n(213),H=n(236),U=n(239),X=n(214),L=n(208),Y=n(209),A=n(210),R=n(211);!function(e){e[e.none=0]="none",e[e.move=1]="move",e[e.addNode=2]="addNode",e[e.addBeam=3]="addBeam",e[e.addBeamStart=4]="addBeamStart",e[e.delete=5]="delete"}(r||(r={}));var K=Object(P.a)(function(e){return Object(_.a)({appBar:{zIndex:e.zIndex.drawer+1},modsBtnGroup:{marginLeft:e.spacing(2),marginRight:e.spacing(2)}})})(function(e){var t=e.onSelect,n=e.selected,a=e.classes,i=[{name:"Move",mod:r.move,icon:o.createElement(L.a,null)},{name:"Add Node",mod:r.addNode,icon:o.createElement(Y.a,null)},{name:"Add Beam",mod:r.addBeam,icon:o.createElement(A.a,null)},{name:"Delete",mod:r.delete,icon:o.createElement(R.a,null)}];return o.createElement(F.a,{position:"fixed",className:a.appBar,color:"primary"},o.createElement(W.a,null,o.createElement(U.a,{color:"primary",value:n,exclusive:!0,onChange:function(e,n){return t(n)},size:"small",className:a.modsBtnGroup},i.map(function(e){return o.createElement(X.a,{value:e.mod,key:e.name,color:"secondory"},o.createElement(H.a,{title:e.name},e.icon))}))))}),G=n(110),V=Object(G.a)({palette:{primary:{dark:"#0A4467",main:"#1e779e",light:"#51A8D6"},secondary:{dark:"#a83e19",main:"#f15a24",light:"#F39B7C"},background:{default:"linear-gradient(35deg, #6863bf 0%, #067d93 50%, #e68a68 100%)"}}}),J=function(e){var t=e.node,n=e.drag,a=e.mode,i=e.onClick,c=e.selected,s=f.UI_nodeSize;return o.createElement(o.Fragment,{key:t.id},o.createElement(z.Circle,{className:"MyCircle",radius:s,x:t.x,y:t.y,fill:V.palette.secondary.main,shadowBlur:c?8:2,stroke:function(e){switch(e){case r.addBeam:case r.addBeamStart:case r.move:return V.palette.primary.light;default:return V.palette.secondary.main}}(a),strokeWidth:function(e){switch(e){case r.addBeam:case r.addBeamStart:case r.move:return 2;default:return 0}}(a)}),o.createElement(z.Circle,{radius:2*s,x:t.x,y:t.y,draggable:a===r.move,_useStrictMode:!0,onDragMove:function(e){return n(e,t)},onClick:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(e){return i(e,t)}),onMouseEnter:function(e){return function(e,t){var n=e.target.getStage();switch(t){case r.delete:case r.none:n.container().style.cursor="pointer";break;case r.addBeam:case r.addBeamStart:n.container().style.cursor="crosshair";break;case r.move:n.container().style.cursor="move"}}(e,a)},onMouseLeave:function(e){return function(e,t){e.target.getStage().container().style.cursor="default"}(e)}}))},q=function(e){var t=e.beam,n=e.mode,a=e.onClick,i=e.selected,c=f.UI_beamSize;return o.createElement(o.Fragment,null,o.createElement(z.Line,{points:[t.x,t.y,t.getEndX(),t.getEndY()],stroke:V.palette.secondary.light,strokeWidth:c,shadowBlur:i?8:2}),o.createElement(z.Line,{points:[t.x,t.y,t.getEndX(),t.getEndY()],strokeWidth:4*c,stroke:"transparent",onClick:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(e){return a(e,t)}),onMouseEnter:function(e){return function(e,t){var n=e.target.getStage();switch(t){case r.delete:case r.none:n.container().style.cursor="pointer"}}(e,n)},onMouseLeave:function(e){return function(e){e.target.getStage().container().style.cursor="default"}(e)}}))},Q=function(e){var t=e.widthCell,n=e.heightCell,a=e.heightBox,i=e.widthBox,r=i/t,c=a/n;return o.createElement(o.Fragment,null,function(){for(var e=[],n=0;n<r;n++)e.push(o.createElement(z.Line,{points:[n*t,0,n*t,a],stroke:"#ddd",strokeWidth:1}));return e}(),function(){for(var e=[],t=0;t<c;t++)e.push(o.createElement(z.Line,{points:[0,t*n,i,t*n],stroke:"#ddd",strokeWidth:1}));return e}())},Z=Object(P.a)(function(e){return Object(_.a)({stage:{backgroundColor:"#fff",flexGrow:1}})})(function(e){var t=e.classes,n=e.stage,a=e.stageHeight,i=e.stageWidth,r=e.onClick,c=e.onMouseMove,s=e.onDrag,l=e.farm,d=e.uiMode,u=e.selectedEntity;return o.createElement(z.Stage,{height:a,width:i,className:t.stage,onClick:r,onMouseMove:c,ref:n},o.createElement(z.Layer,{className:"layer"},o.createElement(Q,{heightCell:f.UI_cellSize,widthCell:f.UI_cellSize,heightBox:a,widthBox:i}),l.getBeams().map(function(e){return o.createElement(q,{key:e.id,beam:e,mode:d,onClick:r,selected:u===e})}),l.getNodes().map(function(e){return o.createElement(J,{key:e.id,node:e,mode:d,drag:s,onClick:r,selected:u===e})})))}),$=n(217),ee=n(218),te=n(219),ne=n(222),ae=n(223),ie=n(216),re=n(220),oe=n(221),ce=function(e){function t(e){var n;return Object(m.a)(this,t),(n=Object(p.a)(this,Object(y.a)(t).call(this,e))).state={open:!1,openedNodes:!0,openedBeams:!0},n.switchTab=n.switchTab.bind(Object(x.a)(n)),n}return Object(b.a)(t,e),Object(h.a)(t,[{key:"switchTab",value:function(e){switch(e){case"nodes":return this.setState(function(e){return{openedNodes:!e.openedNodes}});case"beams":return this.setState(function(e){return{openedBeams:!e.openedBeams}});default:return}}},{key:"render",value:function(){var e=this.props,t=e.classes,n=e.nodes,a=e.beams,i=e.selectedEntity,r=e.onSelect,c=this.state,s=c.openedBeams,l=c.openedNodes,d=this.switchTab;return o.createElement(ke,{anchor:"left",btnTitle:"\u0421\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0430 \u043f\u0440\u043e\u0435\u043a\u0430\u0442",btnIcon:o.createElement(ie.a,null)},o.createElement($.a,null,o.createElement(ee.a,{button:!0,onClick:function(){return d("nodes")}},o.createElement(te.a,{primary:"\u0423\u0437\u043b\u044b"}),l?o.createElement(re.a,null):o.createElement(oe.a,null)),o.createElement(ne.a,{in:l,timeout:"auto",unmountOnExit:!0},o.createElement($.a,{component:"div",disablePadding:!0},n.map(function(e){return o.createElement(ee.a,{button:!0,className:t.nested,key:e.id,selected:i===e,onClick:function(t){return r(e)}},o.createElement(te.a,{primary:e.id}))}))),o.createElement(ae.a,null),o.createElement(ee.a,{button:!0,onClick:function(){return d("beams")}},o.createElement(te.a,{primary:"\u041b\u0443\u0447\u0438"}),s?o.createElement(re.a,null):o.createElement(oe.a,null)),o.createElement(ne.a,{in:s,timeout:"auto",unmountOnExit:!0},o.createElement($.a,{component:"div",disablePadding:!0},a.map(function(e){return o.createElement(ee.a,{button:!0,className:t.nested,key:e.id,selected:i===e,onClick:function(t){return r(e)}},o.createElement(te.a,{primary:e.id}))})))))}}]),t}(o.PureComponent),se=Object(P.a)(function(e){return Object(_.a)({nested:{}})})(ce),le=n(224),de=n(225),ue=n(75),me=n(226),he=n(227),fe=n(228),ge=function(e){function t(e){var n;return Object(m.a)(this,t),(n=Object(p.a)(this,Object(y.a)(t).call(this,e))).state={},n}return Object(b.a)(t,e),Object(h.a)(t,[{key:"getTypeStr",value:function(e){return e instanceof k?"\u0423\u0437\u0435\u043b":e instanceof w?"\u041b\u0443\u0447":"\u042d\u043b\u0435\u043c\u0435\u043d\u0442"}},{key:"viewCard",value:function(e){var t=this.props,n=t.classes,a=t.onDelete;if(e)return o.createElement(le.a,null,o.createElement(de.a,null,o.createElement(ue.a,{className:n.title,color:"textSecondary",gutterBottom:!0},this.getTypeStr(e)),o.createElement(ue.a,{variant:"h5",component:"h2"},e.name)),o.createElement(me.a,{disableSpacing:!0},o.createElement(he.a,{"aria-label":"Delete",onClick:function(){return a(e)}},o.createElement(R.a,null))))}},{key:"render",value:function(){var e=this.props.entity;return o.createElement(ke,{anchor:"right",btnTitle:"\u0418\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u043e\u0431 \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u043e\u043c \u043e\u0431\u044a\u0435\u043a\u0442\u0435",btnIcon:o.createElement(fe.a,null)},this.viewCard(e))}}]),t}(o.PureComponent),ve=Object(P.a)(function(e){return Object(_.a)({title:{fontSize:14},pos:{marginBottom:12}})})(ge),pe=n(235),ye=n(229),be=n(230),Ee=function(e){function t(e){var n;return Object(m.a)(this,t),(n=Object(p.a)(this,Object(y.a)(t).call(this,e))).state={open:!1,viewTooltip:!1},n.switchDrawer=n.switchDrawer.bind(Object(x.a)(n)),n}return Object(b.a)(t,e),Object(h.a)(t,[{key:"switchDrawer",value:function(){this.setState({open:!this.state.open,viewTooltip:!1})}},{key:"changeViewtooltip",value:function(e){this.setState({viewTooltip:e})}},{key:"render",value:function(){var e=this,t=this.props,n=t.classes,a=t.children,i=t.btnTitle,r=t.btnIcon,c=t.anchor,s=this.state,l=s.open,d=s.viewTooltip;return o.createElement(o.Fragment,null,o.createElement(pe.a,{className:n.drawer,variant:"persistent",open:l,anchor:c,classes:{paper:n.drawerPaper}},o.createElement("div",{className:n.toolbar}),a),o.createElement(H.a,{title:i,open:void 0!==i&&d&&!l,onOpen:function(){return e.changeViewtooltip(!0)},onClose:function(){return e.changeViewtooltip(!1)}},o.createElement(ye.a,{style:{left:"left"===c?l?250:10:"auto",right:"right"===c?l?250:10:"auto"},color:"secondary",size:"small",className:n.toogleIcon,onClick:this.switchDrawer},l?o.createElement(be.a,null):r)))}}]),t}(o.PureComponent),ke=Object(P.a)(function(e){return Object(_.a)({drawer:{position:"relative"},drawerPaper:{width:240},toogleIcon:{position:"absolute",top:e.spacing(9),zIndex:e.zIndex.drawer+1},toolbar:e.mixins.toolbar})})(Ee),we=function(e){function t(e){var n;return Object(m.a)(this,t),(n=Object(p.a)(this,Object(y.a)(t).call(this,e))).stage=void 0,n.state={stageHeight:100,stageWidth:100,farm:e.workSpace,uiMode:r.none,selectedEntity:void 0,paintEntity:void 0},n.onClick=n.onClick.bind(Object(x.a)(n)),n.onDrag=n.onDrag.bind(Object(x.a)(n)),n.onMouseMove=n.onMouseMove.bind(Object(x.a)(n)),n.setFarm=n.setFarm.bind(Object(x.a)(n)),n.updateFarm=n.updateFarm.bind(Object(x.a)(n)),n.onKeyHandle=n.onKeyHandle.bind(Object(x.a)(n)),n._setStageSize=n._setStageSize.bind(Object(x.a)(n)),n._deleteEntity=n._deleteEntity.bind(Object(x.a)(n)),n._selectEntity=n._selectEntity.bind(Object(x.a)(n)),n.stage=o.createRef(),n}return Object(b.a)(t,e),Object(h.a)(t,[{key:"componentDidMount",value:function(){this._setStageSize(),window.addEventListener("resize",this._setStageSize)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this._setStageSize)}},{key:"componentWillReceiveProps",value:function(e){e.workSpace!==this.state.farm&&this.setState({farm:e.workSpace})}},{key:"setFarm",value:function(e){this.props.update(e)}},{key:"updateFarm",value:function(e){this.setState({farm:e})}},{key:"onClick",value:function(e,t){var n=this.state,a=n.uiMode,i=n.farm,o=e.target.getStage()===e.target;if(e.evt.preventDefault(),0===e.evt.button)switch(a){case r.none:o?this.setState({selectedEntity:void 0}):this._selectEntity(t);break;case r.addNode:if(o){var c=e.evt,s=c.layerX,l=c.layerY,d=g.cellX(s),u=g.cellX(l);i.addNode(d,u,0),this.updateFarm(i)}break;case r.addBeam:if(!o&&t instanceof k){var m=i.addBeam(t.x,t.y);i.connectBeamToNode(m,t),this.setState({paintEntity:m,uiMode:r.addBeamStart}),this.updateFarm(i)}break;case r.addBeamStart:if(!o&&t instanceof k&&this.state.paintEntity instanceof w){var h=this.state.paintEntity;i.connectBeamToNode(h,t,"end")&&this.setState({uiMode:r.addBeam,paintEntity:void 0}),this.updateFarm(i)}break;case r.delete:!o&&t&&this._deleteEntity(t)}}},{key:"onMouseMove",value:function(e){var t=this.state,n=t.uiMode,a=t.farm,i=t.paintEntity,o=e.evt,c=o.layerX,s=o.layerY;switch(n){case r.addBeamStart:if(i&&i instanceof w)i.moveEndPoint(g.cellX(c),g.cellY(s));else this.setState({uiMode:r.addBeam});this.updateFarm(a)}}},{key:"onDrag",value:function(e,t){var n=this.state,a=n.farm,i=n.uiMode;if(t instanceof k&&i===r.move){var o=e.evt,c=o.layerX,s=o.layerY;a.moveNodeTo(t.id,g.cellX(c),g.cellY(s)),this.updateFarm(a)}}},{key:"onKeyHandle",value:function(e){switch(e.key){case"Escape":this._deletePaintEntity()}}},{key:"setSelectedMode",value:function(e){this._deletePaintEntity(),this.setState({uiMode:e||0})}},{key:"_deletePaintEntity",value:function(){var e=this.state,t=e.uiMode,n=e.paintEntity,a=e.farm;t===r.addBeamStart&&n&&(a.deleteEntity(n),this.setState({paintEntity:void 0}),this.updateFarm(a))}},{key:"_setStageSize",value:function(e){var t=this.stage.current;if(t){var n=t.attrs.container,a=n.clientWidth,i=n.clientHeight;this.setState({stageHeight:i,stageWidth:a})}}},{key:"_selectEntity",value:function(e){e&&this.setState({selectedEntity:e})}},{key:"_deleteEntity",value:function(e){this.setState({selectedEntity:void 0}),this.state.farm.deleteEntity(e),this.updateFarm(this.state.farm)}},{key:"render",value:function(){var e=this.state,t=e.stageHeight,n=e.stageWidth,a=e.farm,i=e.uiMode,r=e.selectedEntity,c=this.props.classes;return o.createElement(T.a,{className:c.root},o.createElement(M.a,{keyEventName:"keyup",keyValue:"Escape",onKeyHandle:this.onKeyHandle}),o.createElement(K,{selected:i,onSelect:this.setSelectedMode.bind(this)}),o.createElement("div",{className:c.toolbar}),o.createElement(T.a,{className:c.stageBox},o.createElement("div",{className:c.toolbar}),o.createElement(se,{nodes:a.getNodes(),beams:a.getBeams(),selectedEntity:r,onSelect:this._selectEntity}),o.createElement(Z,{onClick:this.onClick,onDrag:this.onDrag,onMouseMove:this.onMouseMove,stageHeight:t,stageWidth:n,farm:a,stage:this.stage,selectedEntity:r,uiMode:i}),o.createElement(ve,{entity:r,onDelete:this._deleteEntity})))}}]),t}(o.Component),Ne=Object(P.a)(function(e){return Object(_.a)({root:{width:"100%",height:"100%",overflow:"hidden",background:e.palette.background.default,display:"flex",flexDirection:"column"},stageBox:{display:"flex",flexGrow:1,overflow:"hidden"},toolbar:e.mixins.toolbar})})(we),Oe=function(e){return{type:"FARM_UPDATE",workSpace:e}},Se=Object(d.b)(function(e){return{workSpace:e.farm.workSpace}},function(e){return Object(v.a)(Object(S.a)({},a),e)})(Ne),je=n(231),Ie="/",Be="/farm",De=n(186),Ce=Object(De.a)(function(e){return Object(_.a)({root:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start"},logo:{width:"auto",height:400},title:{padding:40},descripton:{padding:40},btn:{}})})(function(e){var t=e.classes;return o.createElement("header",{className:t.root},o.createElement("img",{src:f.bridgeIcon_2,alt:"logo",className:t.logo}),o.createElement(ue.a,{variant:"h3",className:t.title},f.title),o.createElement(ue.a,{variant:"subtitle1",align:"center",className:t.descripton},f.description),o.createElement(je.a,{component:D.b,to:Be,variant:"contained",size:"large",color:"secondary"},"\u041f\u043e\u0435\u0445\u0430\u043b\u0438"))}),xe=function(e){function t(){return Object(m.a)(this,t),Object(p.a)(this,Object(y.a)(t).apply(this,arguments))}return Object(b.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){var e=this.props.classes;return o.createElement("div",{className:e.root},o.createElement(Ce,null))}}]),t}(o.Component),Me=Object(P.a)(function(e){return Object(_.a)({root:{minWidth:window.innerWidth,minHeight:window.innerHeight,background:e.palette.background.default,padding:e.spacing(4)}})})(xe),_e=function(e){return{type:"SET_TITLE",title:e}},Te=Object(d.b)(function(e){return{title:e.home.title}},function(e){return Object(v.a)(Object(S.a)({},i),e)})(Me),Pe=n(109),ze=n.n(Pe),Fe=n(237),We=n(232),He=function(e){function t(){return Object(m.a)(this,t),Object(p.a)(this,Object(y.a)(t).apply(this,arguments))}return Object(b.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){return o.createElement(o.Fragment,null,o.createElement(ze.a,{htmlAttributes:{leng:"en"},titleTemplate:"Truss - %s",defaultTitle:f.title,link:[{rel:"shortcut icon",href:f.bridgeIcon_2},{rel:"image_src",href:f.airBridge},{rel:"stylesheet",href:"https://fonts.googleapis.com/css?family=Roboto:300,400,500"},{rel:"stylesheet",href:"https://fonts.googleapis.com/icon?family=Material+Icons"}],meta:[{charSet:"utf-8"},{name:"viewport",content:"minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"},{name:"theme-color",content:"#000000"},{name:"description",content:f.description},{property:"og:type",content:"website"},{property:"og:title",content:f.title},{property:"og:image",content:f.airBridge},{property:"vk:image",content:f.airBridge},{property:"twitter:image",content:f.airBridge},{property:"og:url",content:f.url}]}),o.createElement(Fe.a,null),o.createElement(We.a,{theme:V},o.createElement("main",{style:{height:"100%"}},o.createElement(C.c,null,o.createElement(C.a,{path:Ie,component:Te,exact:!0}),o.createElement(C.a,{path:Be,component:Se})))))}}]),t}(o.Component);n(184);l.a.render(c.a.createElement(d.a,{store:B},c.a.createElement(function(){return c.a.createElement(D.a,null,c.a.createElement(He,null))},null)),document.getElementById("root"))},35:function(e,t,n){"use strict";n.r(t),function(e){n.d(t,"url",function(){return m}),n.d(t,"title",function(){return h}),n.d(t,"description",function(){return f}),n.d(t,"favicon",function(){return g}),n.d(t,"UI_cellSize",function(){return v}),n.d(t,"UI_nodeSize",function(){return p}),n.d(t,"UI_beamSize",function(){return y});var a=n(86),i=n.n(a);n.d(t,"ogImage",function(){return i.a});var r=n(87),o=n.n(r);n.d(t,"bridgeIcon_1",function(){return o.a});var c=n(88),s=n.n(c);n.d(t,"bridgeIcon_2",function(){return s.a});var l=n(89),d=n.n(l);n.d(t,"airBridge",function(){return d.a});var u=n(102),m="https://web-usov.github.io/truss",h="Truss - \u0444\u0435\u0440\u043c\u0430 \u0434\u043b\u044f \u043a\u0430\u0436\u0434\u043e\u0433\u043e",f="\u0424\u0435\u0440\u043c\u0430 (farm \u0438\u043b\u0438 truss) \u2014 \u0441\u0442\u0435\u0440\u0436\u043d\u0435\u0432\u0430\u044f \u0441\u0438\u0441\u0442\u0435\u043c\u0430 \u0432 \u0441\u0442\u0440\u043e\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0439 \u043c\u0435\u0445\u0430\u043d\u0438\u043a\u0435, \u043e\u0441\u0442\u0430\u044e\u0449\u0430\u044f\u0441\u044f \u0433\u0435\u043e\u043c\u0435\u0442\u0440\u0438\u0447\u0435\u0441\u043a\u0438 \u043d\u0435\u0438\u0437\u043c\u0435\u043d\u044f\u0435\u043c\u043e\u0439 \u043f\u043e\u0441\u043b\u0435 \u0437\u0430\u043c\u0435\u043d\u044b \u0435\u0451 \u0436\u0451\u0441\u0442\u043a\u0438\u0445 \u0443\u0437\u043b\u043e\u0432 \u0448\u0430\u0440\u043d\u0438\u0440\u043d\u044b\u043c\u0438.",g=n.n(u).a.resolve(e,"favicon.ico"),v=40,p=10,y=6}.call(this,"/")},86:function(e,t,n){e.exports=n.p+"static/media/ogImage.0619e300.png"},87:function(e,t,n){e.exports=n.p+"static/media/icon.68e274b2.png"},88:function(e,t,n){e.exports=n.p+"static/media/bridge.e53bced3.png"},89:function(e,t,n){e.exports=n.p+"static/media/airBridge.7d581a65.png"}},[[116,1,2]]]);
//# sourceMappingURL=main.45134a54.chunk.js.map