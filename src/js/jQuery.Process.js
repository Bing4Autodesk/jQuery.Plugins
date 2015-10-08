/**
 * Process.js
 *
 * @fileoverview  jQuery plugin that creates loading mask dialog.
 * @link          
 * @author        Bing Cheng (bing.cheng@autodesk.com)
 * @version       1.0.0
 * @requires      jQuery 1.7+
 *
 * @license jQuery Process Plugin v1.0.0
 * 
 * Copyright 2015 Bing Cheng (bing.cheng@autodesk.com)
 * Released under the MIT license.
 * 
 */
 
 ///
 /// Clone a new object
 ///
;if ( typeof Object.create !== 'function' ) {
    Object.create = function( obj ) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
};

///
/// Format string
///
String.prototype.format = function()
{
	var args = arguments;
	return this.replace(/\{(\d+)\}/g,                
		function(m,i){
			return args[i];
		});
};

(function($, window, document, undefined){
	
	///
	/// jQuery loading plugin
	///
	var LoadingDialog={
		
		_selectorDom:'',
		
		_init: function(domID, opts){
			var self=this;
			
			self._selectorDom=(arguments.length<=1)?'body':domID;
			
			if(arguments.length<=1){
				opts=domID;
			}
<<<<<<< HEAD
			
			opts=$.extend( {}, self._properties, opts, true);
			self.insProperities=opts;
			self._selectorDom=domID;
			
			var position=self._caculatePostion();
			self._createTipDom(position)._createMaskDom();
			
			$(window).scroll(function(event){
				
				var position=self._caculatePostion();
				self.$tipdom.css('left','{0}px'.format(position.left)).css('top','{0}px'.format(position.top));
				
				position=self._calculateMaskSize();
				self.$mask.css('left','{0}px'.format(position.left)).css('top','{0}px'.format(position.top));
			});
=======
				
			var position=self._caculatePostion();
			console.log(position);
			
			opts=$.extend( {}, self._properties, opts, true);
			
			self.insProperities=opts;
			self._selectorDom=domID;
			
			self._createTipDom(position)._createMaskDom();
>>>>>>> a40d06f4d4c403098309f4f4724113c3f54ab48d
			
			return self;		
		},
		
		_createTipDom:function(position){
			var self=this;
			var opts=(!self.insProperities)?self._properties:self.insProperities;

			var $tipdom=$('<div></div>');
<<<<<<< HEAD
			//$tipdom.attr('id','tipbox').addClass('loading_box');
			$tipdom.addClass('loading_box');
			$tipdom.html(self._template4tip.format(self._imagesName[opts.type],opts.tipinfo));
			
			$(self._selectorDom).append($tipdom);
			
			$tipdom.css('float','none').css('z-index','9999999').css('display','none');
			$tipdom.css('left','{0}px'.format(position.left)).css('top','{0}px'.format(position.top));
			
			//self.$tipdom=$('#tipbox');
			self.$tipdom=$('{0} .loading_box'.format(self._selectorDom));
			
			return self;
		},
		
		_createMaskDom:function(){
			var self=this, $mask=$('<div></div>');
			
			//$mask.attr('id','tipmask').css('display','none');
			$mask.addClass('loading_mask').css('display','none');	
			//if($('#tipmask').length===0)
			if($('{0} .loading_mask'.format(self._selectorDom)).length===0)
			{
				$('{0}'.format((self._selectorDom&&self._selectorDom!='')?self._selectorDom:'body')).prepend($mask);
			}
			//$mask=$('#tipmask');
			
			var maskSize=self._calculateMaskSize();
			
			$mask=$('{0} .loading_mask'.format(self._selectorDom));
			$mask.css('left','{0}px'.format(maskSize.left)).css('top','{0}px'.format(maskSize.top)).css('position','absolute').css('zIndex','1')
				.css('width','{0}px'.format(maskSize.width)).css('height','{0}px'.format(maskSize.height));
=======
			$tipdom.attr('id','tipbox').addClass('loading-box');
			$tipdom.html(self._template4tip.format(self._imagesName[opts.type],opts.tipinfo));
			
			$(self._selectorDom).append($tipdom);
			
			var hleft=((position.cwidth-$tipdom.width())/2 + position.scrollleft)<0?$(self._selectorDom).scrollLeft():(position.cwidth-$tipdom.width())/2 + position.scrollleft;
			var vtop=((position.cheight-$tipdom.height())/2+ position.scrolltop)<0?$(self._selectorDom).scrollTop():(position.cheight-$tipdom.height())/2+ position.scrolltop;
			
			$tipdom.css('float','none').css('z-index','9999999').css('display','none');
			$tipdom.css('left','{0}px'.format(hleft)).css('top','{0}px'.format(vtop));
			
			self.$tipdom=$('#tipbox');
			
			return self;
		},
		
		_createMaskDom:function(){
			var self=this, $mask=$('<div></div>');
			
			$mask.attr('id','tipmask').css('display','none');
			if($('#tipmask').length===0){
				$('{0}'.format((self._selectorDom&&self._selectorDom!='')?self._selectorDom:'body')).prepend($mask);
			}
			$mask=$('#tipmask');
			$mask.css('left','{0}px'.format(0)).css('top','{0}px'.format(0)).css('position','absolute').css('zIndex','1');
>>>>>>> a40d06f4d4c403098309f4f4724113c3f54ab48d
				
			if(document.all){
				var ieversion = navigator["appVersion"].substr(22, 1);  
				if (ieversion == 6 || ieversion == 5) { 
				}  
			}
			else{
				//$mask.css('filter','alpha(opacity=20)')
			}
			
<<<<<<< HEAD
			//$mask.addClass('loading_mask').css('display','none');	
=======
			$mask.addClass('loading-mask').css('display','none');	
>>>>>>> a40d06f4d4c403098309f4f4724113c3f54ab48d
			
			self.$mask=$mask;
			
			return self;
		},
		
		_caculatePostion:function(){
<<<<<<< HEAD
			
			var self=this,position={};
			
			var scrollleft=$(self._selectorDom).scrollLeft(),
				scrolltop=$(self._selectorDom).scrollTop();
				
			var offset=$(self._selectorDom).offset(),iWidh=$(self._selectorDom).width(),iHeight=$(self._selectorDom).height();
			
			if(self._selectorDom=='body'||self._selectorDom=='html'){
				scrollleft=document.documentElement.scrollLeft  
							|| document.body.scrollLeft || 0;
				scrolltop=document.documentElement.scrollTop  
							|| document.body.scrollTop || 0;
				iHeight=document.documentElement.clientHeight  
					|| document.body.clientHeight || 0;
				iWidh=document.documentElement.clientWidth  
					|| document.body.clientWidth || 0;
			}				
						
			position={
				left:offset.left+scrollleft+iWidh/2-self.insProperities.tipWith/2,
				top:offset.top+scrolltop+iHeight/2-self.insProperities.tipHeight/2
			};
			
			return position;
		},
		
		_calculateMaskSize:function(){
			var self=this;
			var scrollleft=$(self._selectorDom).scrollLeft(),
				scrolltop=$(self._selectorDom).scrollTop();
				
							
			var offset=$(self._selectorDom).offset(), wmask=$(self._selectorDom).width(),hmask=$(self._selectorDom).height();
				
			if(self._selectorDom=='body'||self._selectorDom=='html'){
				scrollleft=document.documentElement.scrollLeft  
							|| document.body.scrollLeft || 0;
				scrolltop=document.documentElement.scrollTop  
							|| document.body.scrollTop || 0;
							
				hmask=document.documentElement.clientHeight  
							|| document.body.clientHeight || 0;
				wmask=document.documentElement.clientWidth  
							|| document.body.clientWidth || 0;
			}
				
			return{
				top:offset.top+scrolltop,
				left:offset.left+scrollleft,
				width:wmask,
				height:hmask
			};
			
=======
			var self=this,position={};
			
				
			if(self._selectorDom=='body'){
				var position={
					scrollleft:document.documentElement.scrollLeft  
							|| document.body.scrollLeft || 0,
					scrolltop:document.documentElement.scrollTop  
							|| document.body.scrollTop || 0,
					cheight:document.documentElement.clientHeight  
							|| document.body.clientHeight || 0,
					cwidth:document.documentElement.clientWidth  
							|| document.body.clientWidth || 0
				};
				return position;
			}
			
			position={
				scrollleft:$(self._selectorDom).scrollLeft(),
				scrolltop:$(self._selectorDom).scrollTop(),
				cheight:$(self._selectorDom).height(),
				cwidth:$(self._selectorDom).width()
			};
			
			return position;
>>>>>>> a40d06f4d4c403098309f4f4724113c3f54ab48d
		},
		
		showLoading: function(){
			var self=this;
			
			if(self.$mask){
				self.$mask.css('display','block');
<<<<<<< HEAD
			}
			if(self.$tipdom){
				self.$tipdom.css('display','block');
			}
=======
			}
			if(self.$tipdom){
				self.$tipdom.css('display','block');
			}
>>>>>>> a40d06f4d4c403098309f4f4724113c3f54ab48d
			
			$(window).on('resize', function(){
				self._autooffset();
			});
			
			return self;
		},
		
		closeLoading: function(){
			var self=this;
			
			if(self.$tipdom){
				self.$tipdom.remove();
			}
			if(self.$mask){
				self.$mask.remove();
			}
			
			return self;
		},
		
		_autooffset:function(){
			var self = this, $win=$(window);	
			
			var position=self._caculatePostion();
				
			if(self.$tipdom){
				
<<<<<<< HEAD
				self.$tipdom.css('left','{0}px'.format(position.left)).css('top','{0}px'.format(position.top));
			}
			
			var maskSize=self._calculateMaskSize();
			if(self.$mask){
				self.$mask.css('left','{0}px'.format(maskSize.left)).css('top','{0}px'.format(maskSize.top))
					.css('width','{0}px'.format(maskSize.width)).css('height','{0}px'.format(maskSize.height));
			}
			return self;
=======
				var hleft=((position.cwidth-self.$tipdom.width())/2 + position.scrollleft)<0?$(self._selectorDom).scrollLeft():(position.cwidth-self.$tipdom.width())/2 + position.scrollleft;
				var vtop=((position.cheight-self.$tipdom.height())/2+ position.scrolltop)<0?$(self._selectorDom).scrollTop():(position.cheight-self.$tipdom.height())/2+ position.scrolltop;
				
				self.$tipdom.css('left','{0}px'.format(hleft)).css('top','{0}px'.format(vtop));
				
				//self.$tipdom.css({top: vtop, left: hleft});
			}
>>>>>>> a40d06f4d4c403098309f4f4724113c3f54ab48d
		},
		
		///
		/// We should keep in mind that
		/// all loading instance share this object
		///
		_properties:{
			type:0,
<<<<<<< HEAD
			tipinfo:'正在加载,请等待...',
			tipWith:160,
			tipHeight:70,
		},
		
		_imagesName:['loading.gif','loading1.gif','loading2.gif','loading3.gif'],
		_template4tip:'<img src="src/skin/image/{0}"/>  <p><span class="loading_tip">{1}</span></p>'
=======
			tipinfo:'正在加载,请等待...'
		},
		
		_imagesName:['loading.gif','loading1.gif','loading2.gif','loading3.gif'],
		_template4tip:'<img src="src/skin/image/{0}"/>  <p><span class="loadingTip">{1}</span></p>'
>>>>>>> a40d06f4d4c403098309f4f4724113c3f54ab48d
		
	};
	
	
	// Root jQLoadingDialog object
    var _jQLoadingDialog = $.fn.jQLoadingDialog;

    var jQLoadingDialogWrapper = function (options) {
		var domID=this.selector=='body'?'body':'{0}'.format(this.selector);
        var dialogObj = Object.create( LoadingDialog );
		return dialogObj._init(domID, options);
    };


    $.fn.extend(
	{
	    ///
	    /// 提供接口供外函数调用
	    ///
	    jQLoadingDialog: jQLoadingDialogWrapper
	});

    ///
    /// Noconflict api for jQLoadingDialog plugin
    ///
    $.fn.jQLoadingDialog.noConflict = function (aliasName) {

        $.fn[aliasName] = jQLoadingDialogWrapper;
        $.fn.jQLoadingDialog = _jQLoadingDialog;

        return true;
    };
	
})(jQuery, window, document)

