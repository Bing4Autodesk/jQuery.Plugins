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
			opts=$.extend( {}, self.__options, opts );
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
			
			$tipdom.css('float','none').css('z-index','9999999');
			
			self.$tipElem=$tipdom;
			
					
		},
		show: function(){
			var self=this,$tipDom;
			
			if($('#tipbox').length==0){
				$('body').append(self.$tipElem);
			}
			$tipDom=$('#tipbox');
			
			self.__showmask();
			$tipDom.css('display','block'); 
			
			$(window).on('resize', function(){
					self.__autooffset();
			});
			
			return self;
		},
		
		close: function(){
			var self=this,$tipDom=$('#tipbox');
			
			if($tipDom.length!=0){
				$tipDom.css('display','none'); 
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
		
		__autooffset:function(){
		
			var self = this, $win=$(window),
				config = self.__configuration,
				$tipdom=$('#tipbox');
				
			if($tipdom.length!=0){
			
				var area = [$tipdom.outerWidth(), $tipdom.outerHeight()];
			
				self.offsetTop = ($win.height() - area[1])/2;
				self.offsetLeft = ($win.width() - area[0])/2;
		
				$tipdom.css({top: self.offsetTop, left: self.offsetLeft});
			}
		},
		
		__options:{
			iwidth:120,iheight:0,
			scrolltop:0,scrollleft:0,
			cheight:0,cwidth:0,
			
			tipinfo:'loading...'
		},
		
		__template4tip:'<img src=\'src/skin/image/loading.gif\'/>  <p><span class=\'loadingTip\'>{0}</span></p>'
		
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
		
		$.Dialogcahe.singletonLoading=dialogObj;
		
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

