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
				
			var position=self._caculatePostion();
			console.log(position);
			
			opts=$.extend( {}, self._properties, opts, true);
			
			self.insProperities=opts;
			self._selectorDom=domID;
			
			self._createTipDom(position)._createMaskDom();
			
			return self;		
		},
		
		_createTipDom:function(position){
			var self=this;
			var opts=(!self.insProperities)?self._properties:self.insProperities;

			var $tipdom=$('<div></div>');
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
				
			if(document.all){
				var ieversion = navigator["appVersion"].substr(22, 1);  
				if (ieversion == 6 || ieversion == 5) { 
				}  
			}
			else{
				//$mask.css('filter','alpha(opacity=20)')
			}
			
			$mask.addClass('loading-mask').css('display','none');	
			
			self.$mask=$mask;
			
			return self;
		},
		
		_caculatePostion:function(){
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
				
				var hleft=((position.cwidth-self.$tipdom.width())/2 + position.scrollleft)<0?$(self._selectorDom).scrollLeft():(position.cwidth-self.$tipdom.width())/2 + position.scrollleft;
				var vtop=((position.cheight-self.$tipdom.height())/2+ position.scrolltop)<0?$(self._selectorDom).scrollTop():(position.cheight-self.$tipdom.height())/2+ position.scrolltop;
				
				self.$tipdom.css('left','{0}px'.format(hleft)).css('top','{0}px'.format(vtop));
				
				//self.$tipdom.css({top: vtop, left: hleft});
			}
		},
		
		///
		/// We should keep in mind that
		/// all loading instance share this object
		///
		_properties:{
			type:0,
			tipinfo:'正在加载,请等待...'
		},
		
		_imagesName:['loading.gif','loading1.gif','loading2.gif','loading3.gif'],
		_template4tip:'<img src="src/skin/image/{0}"/>  <p><span class="loadingTip">{1}</span></p>'
		
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

