/**
 * Dialog.js
 *
 * @fileoverview  jQuery plugin that creates processing mask dialog.
 * @link          
 * @author        Bing Cheng (bing.cheng@autodesk.com)
 * @version       1.0.0
 * @requires      jQuery 1.7+
 *
 * @license jQuery Dialog Plugin v1.0.0
 * 
 * Copyright 2015 Bing Cheng (bing.cheng@autodesk.com)
 * Released under the MIT license.
 * 
 */
if ( typeof Object.create !== 'function' ) {
    Object.create = function( obj ) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
};

(function($, window, document, undefined){
	
	$.Dialogcahe={
	
		singletonLoading:null
	};
	
	///
	/// jQuery component for dev to express loading process
	///
	var LoadingDialog={
	
		__init: function(opts){
		
			var self=this;
			opts=$.extend( {}, self.options, opts );
			self.options=opts;
			
			var $tipdom=$('<div></div>');
			
			$tipdom.attr('id','tipbox').removeClass().addClass('loading-box');
				
			if(document.body.scrollTop){
				opts.scrollleft=document.body.scrollLeft;
				opts.scrolltop=document.body.scrollTop;
				opts.cheight=document.body.clientHeight;
				opts.cwidth=document.body.clientWidth;
			}
			else{
				opts.scrollleft=document.documentElement.scrollLeft;
				opts.scrolltop=document.documentElement.scrollTop;
				opts.cheight=document.documentElement.clientHeight;
				opts.cwidth=document.documentElement.clientWidth;
			}
			
			opts.iHeight=$tipdom.height();
			
			var hleft=(opts.cwidth-opts.iHeight)/2 + opts.scrollleft;
			var vtop=(opts.cheight-opts.iHeight)/2+ opts.scrolltop;
			
			$tipdom.css('left','{0}px'.format(hleft)).css('top','{0}px'.format(vtop));
			$tipdom.html(self.__template4tip.format(opts.tipinfo));
			
			$tipdom.css('float','none').css('z-index','99');
			
			self.$tipElem=$tipdom;
					
		},
		show: function(){
			var self=this;
			if($('#tipbox').length==0){
				$('body').append(self.$tipElem);
			}
			self.$tipElem.show(); 
			self.__showmask();
			
			return self;
		},
		
		close: function(){
			var self=this;
			
			if($('#tipbox').length!=0){
				self.$tipElem.hide(); 
			}
			
			self.__hidemask();
			
			return self;
		},
		
		__showmask: function(){
			if($('#tipmask').length==0){
				$('body').prepend('<div id="tipmask" style="display:none;"></div>');
			}
			
			var $mask=$('#tipmask');
			$mask.css('left','{0}px'.format(0)).css('top','{0}px'.format(0)).css('position','absolute').css('zIndex','1');
				
			if(document.all){
				var ieversion = navigator["appVersion"].substr(22, 1);  
				if (ieversion == 6 || ieversion == 5) { 
					hideSelectBoxes(); 
				}  
			}
			else{
				//$mask.css('filter','alpha(opacity=20)')
			}
			
			$mask.removeClass().addClass('loading-mask').css('display','block');
			
		},
		
		__hidemask: function(){
			var $mask=$('#tipmask');
			$mask.css('display','none');
			
			var ieversion = navigator["appVersion"].substr(22, 1);  
			if (ieversion == 6 || ieversion == 5) { 
				showSelectBoxes(); 
			}  
		},
		
		__options:{
			iwidth:120,iheight:0,
			scrolltop:0,scrollleft:0,
			cheight:0,cwidth:0,
			
			tipinfo:'loading...'
		},
		
		__template4tip:'<img src=\'skin/image/loading.gif\'/>  <p><span class=\'loading-tip\'>{0}</span></p>'
		
	};
	
	
	$.LoadingDialog=function(options){
		///
		/// make sure the webpage to create loading instance only one time
		///
		if($.Dialogcahe.singletonLoading!=null){
			return $.Dialogcahe.singletonLoading;
		}
		var dialogObj = Object.create( LoadingDialog );
		dialogObj.__init( options);
		
		return dialogObj;
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
	
})(jQuery, window, document)

