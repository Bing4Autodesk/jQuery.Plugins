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
			
			return self;		
		},
		
		_createTipDom:function(position){
			var self=this;
			var opts=(!self.insProperities)?self._properties:self.insProperities;

			var $tipdom=$('<div></div>');
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
				
			if(document.all){
				var ieversion = navigator["appVersion"].substr(22, 1);  
				if (ieversion == 6 || ieversion == 5) { 
				}  
			}
			else{
				//$mask.css('filter','alpha(opacity=20)')
			}
			
			//$mask.addClass('loading_mask').css('display','none');	
			
			self.$mask=$mask;
			
			return self;
		},
		
		_caculatePostion:function(){
			
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
			
		},
		
		showLoading: function(){
			var self=this;
			
			if(self.$mask){
				self.$mask.css('display','block');
			}
			if(self.$tipdom){
				self.$tipdom.css('display','block');
			}
			
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
				
				self.$tipdom.css('left','{0}px'.format(position.left)).css('top','{0}px'.format(position.top));
			}
			
			var maskSize=self._calculateMaskSize();
			if(self.$mask){
				self.$mask.css('left','{0}px'.format(maskSize.left)).css('top','{0}px'.format(maskSize.top))
					.css('width','{0}px'.format(maskSize.width)).css('height','{0}px'.format(maskSize.height));
			}
			return self;
		},
		
		///
		/// We should keep in mind that
		/// all loading instance share this object
		///
		_properties:{
			type:0,
			tipinfo:'正在加载,请等待...',
			tipWith:160,
			tipHeight:70,
		},
		
		_imagesName:['loading.gif','loading1.gif','loading2.gif','loading3.gif'],
		_template4tip:'<img src="src/skin/image/{0}"/>  <p><span class="loading_tip">{1}</span></p>'
		
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

