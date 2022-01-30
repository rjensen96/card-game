(function(e){function t(t){for(var r,o,i=t[0],c=t[1],l=t[2],d=0,m=[];d<i.length;d++)o=i[d],Object.prototype.hasOwnProperty.call(s,o)&&s[o]&&m.push(s[o][0]),s[o]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);u&&u(t);while(m.length)m.shift()();return n.push.apply(n,l||[]),a()}function a(){for(var e,t=0;t<n.length;t++){for(var a=n[t],r=!0,i=1;i<a.length;i++){var c=a[i];0!==s[c]&&(r=!1)}r&&(n.splice(t--,1),e=o(o.s=a[0]))}return e}var r={},s={app:0},n=[];function o(t){if(r[t])return r[t].exports;var a=r[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,o),a.l=!0,a.exports}o.m=e,o.c=r,o.d=function(e,t,a){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(o.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(a,r,function(t){return e[t]}.bind(null,r));return a},o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],c=i.push.bind(i);i.push=t,i=i.slice();for(var l=0;l<i.length;l++)t(i[l]);var u=c;n.push([0,"chunk-vendors"]),a()})({0:function(e,t,a){e.exports=a("cd49")},"025d":function(e,t,a){"use strict";a("eaaf")},"04c1":function(e,t,a){"use strict";a("bce7")},"20e7":function(e,t,a){"use strict";a("240a")},"240a":function(e,t,a){},"2b90":function(e,t,a){"use strict";a("7655")},"2fe7":function(e,t,a){"use strict";a("5dfc")},"3a81":function(e,t,a){},"41ab":function(e,t,a){"use strict";a("3a81")},"41b3":function(e,t,a){"use strict";a("d92c")},"51b0":function(e,t,a){},"5c0b":function(e,t,a){"use strict";a("9c0c")},"5d35":function(e,t,a){"use strict";a("6e38")},"5dfc":function(e,t,a){},"5f7d":function(e,t,a){"use strict";a("51b0")},"67cd":function(e,t,a){"use strict";a("fc03")},"6e38":function(e,t,a){},"6e8a":function(e,t,a){"use strict";a("e6ca")},7655:function(e,t,a){},7912:function(e,t,a){},7921:function(e,t,a){},"9c0c":function(e,t,a){},a00a:function(e,t,a){"use strict";a("cbd8")},a746:function(e,t,a){"use strict";a("7912")},b750:function(e,t,a){"use strict";a("7921")},bce7:function(e,t,a){},cbd8:function(e,t,a){},cd49:function(e,t,a){"use strict";a.r(t);a("e260"),a("e6cf"),a("cca6"),a("a79d");var r,s,n=a("2b0e"),o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"app"}},[e.notInRoom?a("create-join"):e.inRoom?a("waiting-room"):e.gameStarted?a("game"):e.gameOver?a("game-results"):e._e()],1)},i=[],c=a("daa8"),l=a("1b40"),u=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"home"},[a("h1",[e._v("Phase 10")]),a("div",{staticClass:"content"},[a("div",{staticClass:"rightborder"},[a("h2",[e._v("Create room")]),a("button",{on:{click:function(t){return e.createRoom()}}},[e._v("Create")])]),a("div",[a("h2",[e._v("Join room")]),a("div",{staticClass:"flex-center"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.roomId,expression:"roomId"}],attrs:{type:"text",placeholder:"Code",maxlength:4},domProps:{value:e.roomId},on:{input:function(t){t.target.composing||(e.roomId=t.target.value)}}}),a("button",{on:{click:function(t){return e.joinRoom()}}},[e._v("Join")])]),a("proctor-board"),this.codeIsInvalid?a("p",{attrs:{id:"join-error"}},[e._v("Invalid room code")]):e._e()],1)])])},d=[],m=(a("b0c0"),function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{class:e.highlightClass,attrs:{id:"proctorBoard"}},[a("p",[e._v(e._s(e.message))])])}),h=[],p=n["a"].component("proctor-board",{name:"ProctorBoard",props:["highlighted"],computed:{message:function(){return this.$store.state.proctorMessage},highlightClass:function(){return this.highlighted?"highlighted":""}}}),f=p,v=(a("67cd"),a("2877")),g=Object(v["a"])(f,m,h,!1,null,"4a096c8d",null),y=g.exports,b=l["a"].component("create-join",{name:"CreateJoin",components:{ProctorBoard:y},data:function(){return{socket:Object(c["a"])(),roomId:"",joinDisabled:!0,codeIsInvalid:!1}},computed:{getName:function(){return this.$store.state.name}},methods:{joinRoom:function(){console.log("joining room: ",this.roomId),this.$socket.emit("joinRoom",{roomId:this.roomId}),this.$store.commit("setProctorMessage","")},createRoom:function(){this.$store.commit("setIsCreator",!0),this.$store.commit("setProctorMessage",""),this.$socket.emit("createRoom")}}}),C=b,S=(a("b750"),Object(v["a"])(C,u,d,!1,null,"4e931546",null)),_=S.exports,I=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("proctor-board",{attrs:{highlighted:e.playerIsUp}}),a("div",{attrs:{id:"game-container"}},[a("draw-discard"),a("div",{attrs:{id:"table-sets"}},e._l(e.players,(function(e){return a("table-set",{key:e.key,attrs:{player:e}})})),1),a("div",{attrs:{id:"hand"}},[a("own-hand",{attrs:{roundIsOver:e.roundIsOver}})],1)],1)],1)},w=[],$=(a("4e82"),function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"drawDiscard"},[a("p",[e._v("Draw")]),a("div",{staticClass:"pileCard",on:{click:function(t){return e.hitDraw()}}},[a("phase-card",{attrs:{cardData:e.drawCard,baseClass:"gameCard"}})],1),a("p",[e._v("Discard")]),a("div",{staticClass:"pileCard",on:{click:function(t){return e.hitDiscard()}}},[a("phase-card",{attrs:{cardData:e.discardCard,baseClass:"gameCard"}})],1)])}),P=[],k=(a("4de4"),a("d3b7"),function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{class:e.cardClass,attrs:{id:this.cardData.key},on:{dragstart:e.startDrag}},[a("p",[e._v(e._s(this.cardData.text))])])}),x=[],O=n["a"].component("phase-card",{name:"PhaseCard",props:["cardData","baseClass"],computed:{colorClass:function(){switch(this.cardData.color){case 1:return"red";case 2:return"blue";case 3:return"yellow";case 4:return"green";default:return"black"}},cardClass:function(){return this.baseClass+" "+this.selectedClass+" "+this.colorClass},selectedClass:function(){var e=this.$store.state.selectedCardKeys;return e[this.cardData.key]?"selected":""}},methods:{startDrag:function(e){this.$emit("startDrag",{event:e,card:this.cardData})}}}),M=O,D=(a("a00a"),Object(v["a"])(M,k,x,!1,null,"2e9c6eda",null)),j=D.exports,R=n["a"].component("draw-discard",{name:"DrawDiscard",components:{PhaseCard:j},computed:{drawCard:function(){return this.$store.state.drawCard||{}},discardCard:function(){return this.$store.state.discardCard||{}}},methods:{hitDraw:function(){var e=this.$store.state,t=e.playerId,a=e.gameState;a.drew||this.$socket.emit("takeCard",{pileName:"draw",playerId:t})},hitDiscard:function(){var e=this.$store.state,t=e.playerId,a=e.selectedCardKeys,r=e.hand,s=e.gameState,n=r.filter((function(e){return a[e.key]}));s.drew&&1===n.length?this.$socket.emit("discard",{card:n[0],playerId:t}):s.drew&&n.length>1?this.$store.commit("setProctorMessage","You can only discard one card. Select a single card then try again."):s.drew&&!n.length?this.$store.commit("setProctorMessage","Please select a single card to discard and try again."):s.drew||this.$socket.emit("takeCard",{pileName:"discard",playerId:t}),this.$store.commit("unSelectAllCards")}}}),K=R,z=(a("5d35"),Object(v["a"])(K,$,P,!1,null,"232501a2",null)),N=z.exports,E=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"container",class:e.cursorClass,on:{mousedown:e.handleMouseDown,mousemove:e.handleMouseMove,mouseup:e.handleMouseUp,drop:function(t){return e.onDrop(t)},dragover:function(e){e.preventDefault()},dragenter:function(e){e.preventDefault()}}},[a("div",{attrs:{id:"marquee"}}),e.roundIsOver?e._e():a("tool-box",{on:{sortUpdate:e.setSortType,selectUpdate:e.setSelectionType,sortHand:e.handleSortHand}}),e._l(e.hand,(function(t){return a("phase-card",{key:t.key,attrs:{cardData:t,baseClass:"gameCard",draggable:e.isDraggable},on:{startDrag:e.handleStartDrag}})})),e.roundIsOver?a("button",{on:{click:e.advanceRound}},[e._v("Next round")]):e._e()],2)},q=[],T=a("5530"),B=a("2909");a("c740"),a("a434"),a("159b"),a("b64b");(function(e){e[e["value"]=0]="value",e[e["color"]=1]="color"})(r||(r={})),function(e){e[e["marquee"]=0]="marquee",e[e["drag"]=1]="drag"}(s||(s={}));var A=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"tools"},[a("div",{staticClass:"iconStack border"},[a("div",{staticClass:"iconButton",class:e.marqueeSelected,on:{click:function(t){return e.setSelectMethod("marquee")}}},[a("select-drag",{staticClass:"icon"})],1),a("div",{staticClass:"iconButton",class:e.dragSelected,on:{click:function(t){return e.setSelectMethod("drag")}}},[a("arrow-all",{staticClass:"icon"})],1)]),a("div",{staticClass:"iconStack"},[a("div",{staticClass:"iconButton",on:{click:function(t){return e.setSortMethod("value")}}},[a("numeric-icon",{staticClass:"icon"})],1),a("div",{staticClass:"iconButton",on:{click:function(t){return e.setSortMethod("color")}}},[a("palette-icon",{staticClass:"icon"})],1)])])},G=[],H=a("6509"),U=a("0d2e"),Y=a("8c43"),W=a("5be1"),J=n["a"].component("tool-box",{name:"ToolBox",components:{NumericIcon:H["a"],PaletteIcon:U["a"],SelectDrag:Y["a"],ArrowAll:W["a"]},data:function(){return{sortMethod:r.value,selectMethod:s.marquee}},computed:{numberSelected:function(){return this.sortMethod===r.value?"selected":""},palleteSelected:function(){return this.sortMethod===r.color?"selected":""},marqueeSelected:function(){return this.selectMethod===s.marquee?"selected":""},dragSelected:function(){return this.selectMethod===s.drag?"selected":""}},methods:{setSortMethod:function(e){"value"===e?this.sortMethod=r.value:"color"===e&&(this.sortMethod=r.color),this.$emit("sortHand",this.sortMethod)},setSelectMethod:function(e){"marquee"===e?this.selectMethod=s.marquee:"drag"===e&&(this.selectMethod=s.drag),this.$emit("selectUpdate",this.selectMethod)}}}),L=J,X=(a("20e7"),Object(v["a"])(L,A,G,!1,null,"b08e096c",null)),F=X.exports,Z=a("2ef0"),Q=a.n(Z),V=n["a"].component("own-hand",{name:"OwnHand",props:["roundIsOver"],data:function(){return{mouseIsDown:!1,boxW:0,boxH:0,boxX:0,boxY:0,marquee:null,selectedKeys:{},marqueeKeys:{},cardSortMethod:r.value,cardSelectionMethod:s.marquee}},components:{PhaseCard:j,ToolBox:F},mounted:function(){this.marquee=document.getElementById("marquee"),this.selectedKeys=this.$store.state.selectedCardKeys},computed:{hand:function(){var e=this.$store.state.hand;return e},handEls:function(){return document.getElementsByClassName("gameCard")},cursorClass:function(){var e=this.cardSelectionMethod===s.marquee?"cursorMarquee":"cursorDrag";return e},isDraggable:function(){return this.cardSelectionMethod===s.drag}},methods:{setSortType:function(e){this.cardSortMethod=e},setSelectionType:function(e){this.cardSelectionMethod=e},advanceRound:function(){this.$socket.emit("advanceRound",{playerId:this.$store.state.playerId})},handleSortHand:function(e){var t=e===r.value?"value":"color",a=this.$store.state.hand;a.sort((function(e,a){return e[t]-a[t]})),this.$store.commit("setHandWithoutReorder",a)},handleMouseDown:function(e){if(this.cardSelectionMethod===s.marquee){this.selectedKeys=this.$store.state.selectedCardKeys,this.marquee.style.display="block",this.boxX=e.clientX,this.boxY=e.clientY,this.marquee.style.top=e.clientY+"px",this.marquee.style.left=e.clientX+"px",this.marquee.style.width="0px",this.marquee.style.height="0px",this.marqueeKeys=ee(this.marquee.getBoundingClientRect(),this.handEls);var t=ae(this.selectedKeys,this.marqueeKeys);this.$store.commit("setSelectedCardKeys",t),this.mouseIsDown=!0}},handleMouseMove:function(e){if(this.mouseIsDown&&this.cardSelectionMethod===s.marquee){var t=te(this.boxX,this.boxY,e.clientX,e.clientY);this.marquee.style.top=t.y+"px",this.marquee.style.left=t.x+"px",this.marquee.style.height=t.h+"px",this.marquee.style.width=t.w+"px",this.marqueeKeys=ee(this.marquee.getBoundingClientRect(),this.handEls);var a=ae(this.selectedKeys,this.marqueeKeys);this.$store.commit("setSelectedCardKeys",a)}},handleMouseUp:function(e){this.cardSelectionMethod===s.marquee&&(this.mouseIsDown=!1,this.marquee.style.display="none",this.marquee.style.height="0px",this.marquee.style.width="0px",this.selectedKeys=ae(this.selectedKeys,this.marqueeKeys))},handleStartDrag:function(e){var t=e.event,a=e.card;this.cardSelectionMethod===s.drag&&(t.dataTransfer.dropEffect="move",t.dataTransfer.effectAllowed="move",t.dataTransfer.setData("key",a.key))},onDrop:function(e){if(this.cardSelectionMethod===s.drag){var t=e.dataTransfer.getData("key"),a=e.target,r=this.$store.state.hand,n="P"===a.nodeName?a.parentNode:a,o=n.id,i=Q.a.findIndex(r,(function(e){return e.key===t})),c=Q.a.findIndex(r,(function(e){return e.key===o})),l=r.splice(i,1)[0];r.splice(c,0,l),this.$store.commit("setHandWithoutReorder",r)}}}});function ee(e,t){var a=function(e,t,a){return a>=e&&a<=t},r=Object(B["a"])(t).filter((function(t){var r=t.getBoundingClientRect();if((a(r.top,r.bottom,e.top)||a(r.top,r.bottom,e.bottom))&&e.left<=r.right&&e.right>=r.left)return t})),s={};return r.forEach((function(e){return s[e.id]=!0})),s}function te(e,t,a,r){var s={x:0,y:0,h:0,w:0};return e>a?(s.x=a,s.w=e-a):(s.x=e,s.w=a-e),t>r?(s.y=r,s.h=t-r):(s.y=t,s.h=r-t),s}function ae(e,t){var a=Object(T["a"])({},e);return Object.keys(t).forEach((function(e){void 0!==a[e]?a[e]=!a[e]:a[e]=!0})),a}var re=V,se=(a("41b3"),Object(v["a"])(re,E,q,!1,null,"21d1033a",null)),ne=se.exports,oe=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"container"},[a("div",{staticClass:"headerData"},[a("h2",[e._v(e._s(e.displayName))]),a("h2",{staticClass:"score"},[e._v("Score: "+e._s(this.player.points))]),a("h2",{staticClass:"score"},[e._v("Phase "+e._s(e.currentPhase))])]),a("div",{staticClass:"cardArea"},e._l(this.player.phase,(function(t,r){return a("div",{key:r,staticClass:"cardSet",on:{click:function(t){return e.playSelectedCards(r)},mouseenter:function(t){return e.handleMouseEnter(t,r)},mouseleave:e.handleMouseLeave,mousemove:function(t){return e.handleMouseMove(t,r)}}},[a("p",[e._v(e._s(e.setLabel(t)))]),t.cards.length?a("div",{staticClass:"cards"},[a("div",{staticClass:"center arrow"},[a("transition",{attrs:{name:"slide-fade"}},[e.displayArrow(r,"left")?a("arrow-right-thick",{attrs:{size:18}}):e._e()],1)],1),e._l(t.cards,(function(e){return a("phase-card",{key:e.key,attrs:{cardData:e,baseClass:"tableCard"}})})),a("div",{staticClass:"center arrow"},[a("transition",{attrs:{name:"slide-fade"}},[e.displayArrow(r,"right")?a("arrow-left-thick",{attrs:{size:18}}):e._e()],1)],1)],2):a("div",{staticClass:"cards"},e._l(t.size,(function(e,t){return a("div",{key:t,staticClass:"dummyCard"})})),0)])})),0)])},ie=[],ce=(a("99af"),a("99b8")),le=a("5b82"),ue=n["a"].component("table-set",{name:"TableSet",props:["player"],data:function(){return{targetPhaseIndex:null,targetSideToPlay:null,targetSetClientRect:null}},components:{ArrowLeftThick:ce["a"],ArrowRightThick:le["a"]},computed:{phase:function(){return this.player.phase},displayName:function(){return this.player.gamename===this.$store.state.gamename?"".concat(this.player.gamename," (You)"):this.player.gamename},currentPhase:function(){return this.player.phaseNumber}},methods:{handleMouseEnter:function(e,t){this.targetSetClientRect=e.target.getBoundingClientRect(),this.targetPhaseIndex=t},handleMouseMove:function(e,t){var a=Math.floor((this.targetSetClientRect.right+this.targetSetClientRect.left)/2);e.clientX>=a?this.targetSideToPlay="right":this.targetSideToPlay="left"},handleMouseLeave:function(){this.targetPhaseIndex=null,this.targetSideToPlay=null},displayArrow:function(e,t){return e===this.targetPhaseIndex&&t===this.targetSideToPlay},setLabel:function(e){return"color"===e.pattern?"".concat(e.size," cards of one color"):"".concat(e.pattern," of ").concat(e.size)},playSelectedCards:function(e){var t=this.$store.state.gameState.drew,a=this.$store.state,r=a.selectedCardKeys,s=a.hand,n=a.playerId;if(!t)return this.$store.commit("setProctorMessage","You must draw before playing cards. Take a card from the draw or discard pile!");var o=s.filter((function(e){return r[e.key]})),i={playerId:n,gamename:this.player.gamename,phaseIndex:e,cards:o,targetSideToPlay:this.targetSideToPlay};this.$socket.emit("playCards",i),this.$store.commit("unSelectAllCards")},removePlayedCards:function(e){console.log("hit remove")}}}),de=ue,me=(a("04c1"),Object(v["a"])(de,oe,ie,!1,null,"63ee354c",null)),he=me.exports,pe=n["a"].extend({components:{OwnHand:ne,TableSet:he,DrawDiscard:N,ProctorBoard:y},computed:{players:function(){var e=this.$store.state.playersInRoom;return e.sort((function(e,t){return e.gamename<t.gamename?1:e.gamename>t.gamename?-1:0}))},roundIsOver:function(){return this.$store.state.gameState.roundIsOver},playerIsUp:function(){var e=this.$store.state.gamename===this.$store.state.gameState.playerUp;return console.log("playerup: ",e),e}}}),fe=pe,ve=(a("2b90"),Object(v["a"])(fe,I,w,!1,null,"42dbd4ac",null)),ge=ve.exports,ye=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("h1",[e._v("Results")]),a("div",{staticClass:"throne"},[a("div",{attrs:{id:"crown"}},[a("chess-king",{attrs:{size:150}})],1),a("span",[e._v(" "+e._s(e.winner.gamename[0])+" ")]),a("p",[e._v(e._s(e.winner.gamename)+" wins!")])]),a("div",{staticClass:"container"},[a("table",[e._m(0),e._l(e.players,(function(t){return a("tr",{key:t.key},[a("td",{staticClass:"playerName"},[e._v(e._s(t.gamename))]),a("td",[e._v(e._s(t.points))]),a("td",[e._v("Phase "+e._s(e.highestCompletedPhase(t)))])])}))],2)])])},be=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("tr",[a("th",{staticClass:"playerName"},[e._v("Player")]),a("th",[e._v("Points")]),a("th",[e._v("Completed")])])}],Ce=a("3a31"),Se=n["a"].extend({components:{ChessKing:Ce["a"]},data:function(){return{crownCycle:0}},mounted:function(){window.setInterval(this.floatCrown,100)},computed:{players:function(){var e=this.$store.state.playersInRoom;return e.sort((function(e,t){return e.points>t.points?1:e.points<t.points?-1:0}))},winner:function(){for(var e=this.players,t=0,a=e[0].points,r=0;r<this.players.length;r++)e[r].points<a&&(t=r,a=e[r].points);return e[t]}},methods:{highestCompletedPhase:function(e){return e.phaseNumber-1},floatCrown:function(){var e=document.getElementById("crown");e&&this.crownCycle++}}}),_e=Se,Ie=(a("025d"),Object(v["a"])(_e,ye,be,!1,null,"42c6b482",null)),we=Ie.exports,$e=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticClass:"flex"},[a("game-settings"),a("section",{attrs:{id:"playerList"}},[a("p",{attrs:{id:"roomIdLabel"}},[e._v("Room code")]),a("h1",{attrs:{id:"roomId"}},[e._v(e._s(e.getRoomId))]),e.confirmedName?e._e():a("div",{attrs:{id:"nameForm"}},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.nameInput,expression:"nameInput"}],attrs:{type:"text",placeholder:"Your name",maxlength:10},domProps:{value:e.nameInput},on:{input:function(t){t.target.composing||(e.nameInput=t.target.value)}}}),a("button",{on:{click:function(t){return e.confirmName()}}},[e._v("Confirm")]),a("proctor-board")],1),a("div",{staticClass:"personas"},e._l(e.playersInRoom,(function(e){return a("waiting-persona",{key:e.key,attrs:{player:e}})})),1),a("button",{attrs:{id:"start",disabled:e.startIsDisabled},on:{click:function(t){return e.startGame()}}},[e._v(" Start ")])])],1)])},Pe=[],ke=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticClass:"waitingPersona"},[a("span",[e._v(" "+e._s(e.playerInitial)+" ")])]),a("p",[e._v(e._s(e.playerName))])])},xe=[];function Oe(){var e=[];return e}var Me=l["a"].component("waiting-persona",{name:"WaitingPersona",props:{player:void 0},computed:{playerInitial:function(){return""===this.player.gamename?"?":this.player.gamename[0]},playerName:function(){return this.player.gamename}}}),De=Me,je=(a("2fe7"),Object(v["a"])(De,ke,xe,!1,null,"4855ee91",null)),Re=je.exports,Ke=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"container"},[a("h1",[e._v("Game Settings")]),a("preset-picker",{on:{"preset-change":e.handlePresetChange}}),e._l(e.phases,(function(t,r){return a("phase-form-block",{key:r,attrs:{phase:t,renderKey:e.renderKey},on:{"phase-data":function(t){return e.setPhaseData(t,r)}}})})),a("span",{attrs:{id:"estTime"}},[e._v("Approx. "+e._s(e.timeEstimate))])],2)},ze=[],Ne=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"phaseBlock"},[e._l(e.phase,(function(t,r){return a("div",{key:r,staticClass:"phaseItem"},[a("select",{on:{change:function(t){return e.handleSelectPattern(t,r)}}},e._l(e.dropdownOpts,(function(t,s){return a("option",{key:s,domProps:{value:t.value,selected:e.patternSelected(r,t.value)}},[e._v(" "+e._s(t.display)+" ")])})),0),a("input",{attrs:{type:"number",min:"2",max:e.getMaxSize(r)},domProps:{value:e.phaseItemSize(r)},on:{change:function(t){return e.handleSelectSize(t,r)}}}),a("div",{staticClass:"deleteButton"},[a("delete-icon",{staticClass:"icon",on:{click:function(t){return e.handleDeleteItem(r)}}})],1)])})),e.canAddItem?a("div",{staticClass:"phasePotential",on:{click:e.handleAddItem}},[a("p",[e._v("+")])]):e._e()],2)},Ee=[],qe=(a("25f0"),a("a9e3"),a("0647")),Te=n["a"].component("phase-form-block",{name:"PhaseFormBlock",props:["phase","renderKey"],components:{DeleteIcon:qe["a"]},computed:{dropdownOpts:function(){return[{value:"set",display:"Set"},{value:"run",display:"Run"},{value:"color",display:"One color"}]},canAddItem:function(){return 1===this.phase.length}},methods:{getMaxSize:function(e){var t=(e+1)%2,a=9;return this.phase[t]&&(a=9-this.phase[t].size),a.toString()},handleAddItem:function(){if(1===this.phase.length){var e=Object(B["a"])(this.phase);e.push(Q.a.cloneDeep(e[0]));var t=Number(e[0].size)+Number(e[1].size);t>9&&(e[0].size>=8&&(e[0].size=7),e[1].size=9-e[0].size),this.$emit("phase-data",e)}},handleSelectPattern:function(e,t){var a=Object(B["a"])(this.phase);a[t].pattern=e.target.value,this.$emit("phase-data",a)},handleSelectSize:function(e,t){var a=Number(e.target.value),r=(t+1)%2,s=Object(B["a"])(this.phase),n=this.phase[r]?Number(a)+Number(this.phase[r].size):Number(a);n>=1&&n<=9&&(s[t].size=a),this.$emit("phase-data",s)},handleDeleteItem:function(e){var t=Object(B["a"])(this.phase);e>0?t.pop():t.shift(),this.$emit("phase-data",t)},patternSelected:function(e,t){var a=this.phase[e];return a&&a.pattern===t?"selected":""},phaseItemSize:function(e){return this.phase[e].size}}}),Be=Te,Ae=(a("6e8a"),Object(v["a"])(Be,Ne,Ee,!1,null,"a5602560",null)),Ge=Ae.exports,He=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"presetWrapper"},[a("label",{attrs:{for:"presets"}},[e._v("Preset")]),a("select",{directives:[{name:"model",rawName:"v-model",value:e.presetName,expression:"presetName"}],attrs:{id:"presets"},on:{change:[function(t){var a=Array.prototype.filter.call(t.target.options,(function(e){return e.selected})).map((function(e){var t="_value"in e?e._value:e.value;return t}));e.presetName=t.target.multiple?a:a[0]},e.handleSelectPreset]}},[a("option",{attrs:{value:"classic"}},[e._v("Classic")]),a("option",{attrs:{value:"classic-odds"}},[e._v("Classic - odds")]),a("option",{attrs:{value:"classic-evens"}},[e._v("Classic - evens")]),a("option",{attrs:{value:"rj-special"}},[e._v("RJ special")])])])},Ue=[];function Ye(){var e=[];return e}var We=[[{pattern:"set",size:3,cards:Ye()},{pattern:"set",size:3,cards:Ye()}],[{pattern:"set",size:3,cards:Ye()},{pattern:"run",size:4,cards:Ye()}],[{pattern:"set",size:4,cards:Ye()},{pattern:"run",size:4,cards:Ye()}],[{pattern:"run",size:7,cards:Ye()}],[{pattern:"run",size:8,cards:Ye()}],[{pattern:"run",size:9,cards:Ye()}],[{pattern:"set",size:4,cards:Ye()},{pattern:"set",size:4,cards:Ye()}],[{pattern:"color",size:7,cards:Ye()}],[{pattern:"set",size:5,cards:Ye()},{pattern:"set",size:2,cards:Ye()}],[{pattern:"set",size:5,cards:Ye()},{pattern:"set",size:3,cards:Ye()}]],Je=[[{pattern:"color",size:5,cards:[]},{pattern:"run",size:3,cards:[]}],[{pattern:"run",size:6,cards:[]}],[{pattern:"color",size:4,cards:[]},{pattern:"color",size:4,cards:[]}],[{pattern:"set",size:5,cards:[]}]];function Le(){return Q.a.cloneDeep(We)}function Xe(){return Q.a.cloneDeep(Je)}var Fe=n["a"].component("preset-picker",{name:"PresetPicker",computed:{presetName:{get:function(){return this.$store.state.gameSettings.presetName},set:function(e){}}},methods:{handleSelectPreset:function(e){console.log("change",e.target.value);var t=e.target.value,a={presetName:t,phases:[]};switch(t){case"classic":a.phases=Le();break;case"classic-odds":a.phases=Le(),a.phases=a.phases.filter((function(e,t){return t%2==1}));break;case"classic-evens":a.phases=Le(),a.phases=a.phases.filter((function(e,t){return t%2==0}));break;case"rj-special":a.phases=Xe();break}this.$emit("preset-change",a)}}}),Ze=Fe,Qe=(a("41ab"),Object(v["a"])(Ze,He,Ue,!1,null,"605976a3",null)),Ve=Qe.exports,et=n["a"].component("game-settings",{name:"GameSettings",components:{PhaseFormBlock:Ge,PresetPicker:Ve},computed:{timeEstimate:function(){var e=this.$store.state.playersInRoom.length,t=1===e?"player":"players",a=this.phases.length,r=2,s=2.5,n=Math.floor(r*e*a),o=Math.floor(s*e*a);return"".concat(n," - ").concat(o," mins (").concat(e," ").concat(t,")")},phases:function(){return this.$store.state.gameSettings.phases},renderKey:function(){return this.$store.state.gameSettings.renderKey}},methods:{setPhaseData:function(e,t){var a=Q.a.cloneDeep(this.phases),r=this.$store.state.playerId;e.length?a[t]=e:a.splice(t,1),this.$socket.emit("gameSettings",{phases:a,playerId:r})},handlePresetChange:function(e){var t=this.$store.state.playerId;this.$socket.emit("gameSettings",Object(T["a"])(Object(T["a"])({},e),{},{playerId:t}))}}}),tt=et,at=(a("a746"),Object(v["a"])(tt,Ke,ze,!1,null,"b470a750",null)),rt=at.exports,st=l["a"].component("waiting-room",{name:"WaitingRoom",data:function(){return{socket:Object(c["a"])(),nameInput:"",prevNumPlayers:1}},components:{WaitingPersona:Re,ProctorBoard:y,GameSettings:rt},computed:{getRoomId:function(){return this.$store.state.roomId},playersInRoom:function(){return this.$store.state.playersInRoom},numPlayers:function(){return this.$store.state.playersInRoom.length},startIsDisabled:function(){var e=this.$store.state.playersInRoom,t=e.length<2||e.some((function(e){return""===e.gamename}));return t},confirmedName:function(){return""!==this.$store.state.gamename}},methods:{confirmName:function(){var e=function(e){return Object(B["a"])(e.toUpperCase()).every((function(e){return e>="A"&&e<="Z"}))};if(this.$store.commit("setProctorMessage",""),e(this.nameInput)){var t=this.$store.state.playerId;this.$socket.emit("setGamename",{gamename:this.nameInput,playerId:t})}},startGame:function(){var e=this.$store.state.playerId,t=this.$store.state.gameSettings.phases;this.$socket.emit("startGame",{playerId:e,phases:t})}},updated:function(){var e=this.$store.state,t=e.isCreator,a=e.playerId;if(this.numPlayers>this.prevNumPlayers&&t){this.prevNumPlayers=this.numPlayers;var r=this.$store.state.gameSettings,s=r.phases,n=r.presetName;console.log("sending settings...",s),this.$socket.emit("gameSettings",{phases:s,presetName:n,playerId:a})}}}),nt=st,ot=(a("5f7d"),Object(v["a"])(nt,$e,Pe,!1,null,"346af08f",null)),it=ot.exports,ct=l["a"].extend({components:{CreateJoin:_,WaitingRoom:it,Game:ge,GameResults:we},name:"Home",data:function(){return{socket:Object(c["a"])()}},computed:{notInRoom:function(){return""===this.$store.state.roomId},inRoom:function(){return""!==this.$store.state.roomId&&!this.$store.state.gameState},gameStarted:function(){var e=this.$store.state.gameState;return e&&!e.gameIsOver},gameOver:function(){var e=this.$store.state.gameState;return e&&e.gameIsOver}}}),lt=ct,ut=(a("5c0b"),Object(v["a"])(lt,o,i,!1,null,null,null)),dt=ut.exports;a("d81d");function mt(){var e=[];return e}var ht=a("2f62");n["a"].use(ht["a"]);var pt=new ht["a"].Store({state:{chats:mt(),discardCard:null,drawCard:null,gamename:"",hand:Ye(),isCreator:!1,playersInRoom:Oe(),playerId:"",points:0,proctorMessage:"",roomId:"",gameState:null,selectedCardKeys:vt(),gameSettings:{phases:Le(),presetName:"classic",renderKey:Math.random()}},mutations:{addPlayer:function(e,t){e.playersInRoom.push(t)},setSelectedCardKeys:function(e,t){e.selectedCardKeys=t},unSelectAllCards:function(e){e.selectedCardKeys=vt()},setGamename:function(e,t){e.gamename=t},setIsCreator:function(e,t){e.isCreator=t},setPlayersInRoom:function(e,t){e.playersInRoom=t},setRoomId:function(e,t){e.roomId=t},setDrawDiscard:function(e,t){e.drawCard=t.draw,e.discardCard=t.discard},setHand:function(e,t){e.hand=gt(e.hand,t)},setHandWithoutReorder:function(e,t){e.hand=t},setPoints:function(e,t){e.points=t},setPlayerId:function(e,t){e.playerId=t},setProctorMessage:function(e,t){e.proctorMessage=t},setGameState:function(e,t){t.roundIsOver&&(e.selectedCardKeys=vt()),e.gameState=t},setGameSettings:function(e,t){e.gameSettings=Object(T["a"])(Object(T["a"])(Object(T["a"])({},e.gameSettings),t),{},{renderKey:Math.random()})},addChatMessage:function(e,t){e.chats.push(t)},resetChats:function(e){e.chats=mt()}},actions:{SOCKET_chatMessage:function(e,t){var a=e.commit;a("addChatMessage",t)},SOCKET_drawDiscard:function(e,t){var a=e.commit;a("setDrawDiscard",t)},SOCKET_gamenameConfirmation:function(e,t){var a=e.commit;a("setGamename",t.gamename)},SOCKET_gameSettings:function(e,t){var a=e.commit;a("setGameSettings",t)},SOCKET_gameState:function(e,t){var a=e.commit;a("setGameState",t);var r=yt(this.state.gameState,this.state.gamename);a("setProctorMessage",r)},SOCKET_joinConfirmation:function(e,t){var a=e.commit;a("setRoomId",t.roomId);var r=ft(t.roomPlayerData);a("setPlayersInRoom",r)},SOCKET_ownPlayerData:function(e,t){var a=e.commit;a("setHand",t.hand),a("setPoints",t.points)},SOCKET_playerId:function(e,t){var a=e.commit;a("setPlayerId",t)},SOCKET_proctorMessage:function(e,t){var a=e.commit,r=yt(this.state.gameState,this.state.gamename);a("setProctorMessage",t+" "+r)},SOCKET_roomPlayerData:function(e,t){var a=e.commit,r=ft(t);a("setPlayersInRoom",r)}},modules:{}});function ft(e){var t=e.map((function(e){var t={gamename:e.gamename,phaseNumber:e.phaseNumber,phase:e.phase,points:e.points,key:Math.random()};return t})),a=t.map((function(e){return e.phaseNumber}));return console.log("current phasenums;",a),t}function vt(){var e={};return e}function gt(e,t){for(var a=[],r=function(r){var s=e[r],n=Q.a.findIndex(t,(function(e){return e.key===s.key}));-1!==n&&a.push.apply(a,Object(B["a"])(t.splice(n,1)))},s=0;s<e.length;s++)r(s);return a.push.apply(a,Object(B["a"])(t)),a}function yt(e,t){var a="";return e?(e.roundIsOver?a+="Round complete!":e.playerUp===t?(a+="You're up! ",e.drew?e.played?a+="Discard something to end your turn.":a+="Complete your phase or discard something.":a+="Take a card from the draw or discard pile."):(a+="Waiting for ".concat(e.playerUp," "),e.drew?e.played?a+="to discard.":a+="to play.":a+="to draw."),a):""}var bt=a("5132"),Ct=a.n(bt);n["a"].config.productionTip=!1;var St=Object(c["a"])("http://localhost:2105");n["a"].use(new Ct.a({debug:!0,connection:St,vuex:{store:pt,actionPrefix:"SOCKET_",mutationPrefix:"SOCKET_"}})),new n["a"]({store:pt,sockets:{connect:function(){console.log("websocket connected")}},render:function(e){return e(dt)}}).$mount("#app")},d92c:function(e,t,a){},e6ca:function(e,t,a){},eaaf:function(e,t,a){},fc03:function(e,t,a){}});
//# sourceMappingURL=app.80a88094.js.map