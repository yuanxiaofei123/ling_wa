(function($,window){var defaults={direction:"vertical",currentClass:"current",gestureFollowing:false,hasDot:false,rememberLastVisited:false,preventDefault:true,animationPlayOnce:false,dev:false,onSwipeUp:function(){},onSwipeDown:function(){},onSwipeLeft:function(){},onSwipeRight:function(){},oninit:function(){},onbeforechange:function(){},onchange:function(){},};var pageWidth=document.documentElement.clientWidth,pageHeight=document.documentElement.clientHeight,state="end",lockNext,lockPrev,startPos,isGestureFollowing,offset,pageScrollTop;function PageSlider(options){$.extend(this,defaults,options);if(this.pages.length<=0){throw new Error("target para not pass")}this.target=this.pages.eq(0).parent();this.length=this.pages.length;this.moveTo=PageSlider.prototype.moveTo;this.index=0;this.curPage=this.pages.eq(this.index);this.timer=null;isGestureFollowing=this.gestureFollowing;if(this.direction==="vertical"||this.direction==="v"){this.direction="v"}if(this.direction==="horizontal"||this.direction==="h"){this.direction="h"}if(this.length<=1){return}this._init()}PageSlider.prototype={_init:function(){var self=this;this.target.css("-webkit-transition","-webkit-transform 0.5s ease");this.pages.each(function(){var $this=$(this),$PageSliderWraper=$this.wrapInner('<div class="PageSlider__wraper"></div>').find(".PageSlider__wraper"),height=$PageSliderWraper.height();if(height>pageHeight){$this.data("height",height);$this.css("overflow","auto")}$PageSliderWraper.children().unwrap()});if(this.direction==="h"){this.target.css("position","relative");this.pages.each(function(index){$(this).css({position:"absolute",left:index*100+"%",top:0})})}if(this.hasDot){this._createDot()}self._bindAnimation();this.target.on("touchstart",function(e){self._startHandle(e)});this.target.on("touchmove",function(e){self._moveHandle(e)});this.target.on("touchend",function(e){self._endHandle(e)});if(this.rememberLastVisited){this.lastVisitedIndex=this._getLastVisited()}this.target.css("-webkit-transform","translate3d(0, 0,0)");this.pages.eq(0).addClass(this.currentClass);this.oninit.call(this);this._dev()},_startHandle:function(e){var touch=e.touches[0];lockNext=this.curPage.data("lock-next");lockPrev=this.curPage.data("lock-prev");if(state==="running"){e.preventDefault();return}startPos=this.direction==="v"?touch.clientY:touch.clientX;this.curPage[0].pageScrollHeight=this.curPage.data("height");if(this.curPage[0].pageScrollHeight){isGestureFollowing&&(this.gestureFollowing=false);this.preventDefault=false;pageScrollTop=pageHeight+this.curPage.scrollTop()}if(this.gestureFollowing){offset=-this.index*(this.direction==="v"?pageHeight:pageWidth)}},_moveHandle:function(e){var touch=e.changedTouches[0],distance,endPos;if(state==="running"){e.preventDefault();return}endPos=this.direction==="v"?touch.clientY:touch.clientX;distance=endPos-startPos;if(this.curPage[0].pageScrollHeight){if(distance>0&&pageScrollTop===pageHeight){e.preventDefault()}if(distance<0&&pageScrollTop===this.curPage[0].pageScrollHeight){e.preventDefault()}}if(!this.gestureFollowing){this._preventDefault(e);return}if((this.index<=0&&endPos>startPos)||(this.index>=this.length-1&&endPos<startPos)){e.preventDefault();return}if((distance>0&&lockPrev)||distance<0&&lockNext){e.preventDefault();return}distance=offset+distance+"px";this._removeTransition();if(this.direction==="v"){this.target.css("-webkit-transform","translate3d(0, "+distance+",0)")}else{this.target.css("-webkit-transform","translate("+distance+", 0)")}this._preventDefault(e)},_endHandle:function(e){var touch=e.changedTouches[0],distance,endPos;if(state==="running"){e.preventDefault();return}endPos=this.direction==="v"?touch.clientY:touch.clientX;distance=endPos-startPos;this._setTransition();if(distance>0){this.direction==="v"?this.onSwipeDown.call(this):this.onSwipeRight.call(this);if(!lockPrev){if(this.curPage[0].pageScrollHeight&&pageScrollTop>pageHeight){return}else{if(distance>20){this.prev()}else{this.moveTo(this.index)}}}}if(distance<0){this.direction==="v"?this.onSwipeUp.call(this):this.onSwipeLeft.call(this);if(!lockNext){if(this.curPage[0].pageScrollHeight&&pageScrollTop<this.curPage[0].pageScrollHeight){return}else{if(distance<-20){this.next()}else{this.moveTo(this.index)}}}}},moveTo:function(index,direct){var distance,self=this;state="running";direct=direct||false;index=parseInt(index);if(index>=this.length||index<0){state="end";return}direct&&this._removeTransition();this.onbeforechange.call(this);if(this.direction==="v"){distance=-index*100+"%";this.target.css("-webkit-transform","translate3d(0, "+distance+",0)")}if(this.direction==="h"){distance=-index*100+"%";this.target.css("-webkit-transform","translate("+distance+", 0)")}if(self.curPage&&self.curPage[0].pageScrollHeight){isGestureFollowing&&(self.gestureFollowing=true);self.preventDefault=true}clearTimeout(this.timer);this.timer=setTimeout(function(){self._currentClass(index);self.prevIndex=self.index;self.index=index;self.onchange.call(self);direct&&self._setTransition();
self.curPage=self.pages.eq(self.index);self.rememberLastVisited&&self._saveLastVisited();state="end";clearTimeout(self.timer)},100)},prev:function(){this.moveTo(this.index-1)},next:function(){this.moveTo(this.index+1)},_setTransition:function(){this.target.css("-webkit-transition","-webkit-transform 0.5s ease")},_removeTransition:function(){this.target.css("-webkit-transition","none")},_currentClass:function(index){var currentClass=this.currentClass;this.pages.eq(index).addClass(currentClass);if(index!==this.index&&!this.animationPlayOnce){this.pages.eq(this.index).removeClass(currentClass)}},_createDot:function(){var dots="";for(var i=0;i<this.length;i++){dots+="<li>"+(i+1)+"</li>"}$(dots).appendTo(this.target).wrapAll('<ul class="dot-list">')},_saveLastVisited:function(){var storage=window.localStorage;if(storage){storage.setItem("pageSliderIndex",this.index)}},_getLastVisited:function(){var storage=window.localStorage;if(storage){this.cacheIndex=storage.getItem("pageSliderIndex");return parseInt(this.cacheIndex)}},_bindAnimation:function(){var self=this,styleText="<style>";$("[data-animation]").each(function(index){var $this=$(this),dataAnimation=$this.data("animation"),animationName=dataAnimation["name"],animationDuration=dataAnimation["duration"]||500,animationDelay=dataAnimation["delay"]||0,animationTimeFunction=dataAnimation["timing-function"]||"ease",animationFillMode=dataAnimation["fill-mode"]||"both",animationIterationCount=dataAnimation["iteration-count"]||1;$this.data("animationid",++index);styleText+="."+self.currentClass+" "+'[data-animationid="'+index+'"]'+"{"+"-webkit-animation-name: "+animationName+";"+"-webkit-animation-duration: "+animationDuration+"ms;"+"-webkit-animation-delay: "+animationDelay+"ms;"+"-webkit-animation-timing-function: "+animationTimeFunction+";"+"-webkit-animation-fill-mode: "+animationFillMode+";"+"-webkit-animation-iteration-count: "+animationIterationCount+";"+"}"});styleText+"</style>";$("head").eq(0).append(styleText)},_preventDefault:function(e){this.preventDefault&&e.preventDefault()},_dev:function(){if(this.dev!==false){this.moveTo(this.dev,true)}}};window.PageSlider=PageSlider})(Zepto,window);if(typeof define==="function"&&define.amd){define("PageSlider",[],function(){return PageSlider})};