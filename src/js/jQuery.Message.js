/**
 * Message.js
 *
 * @fileoverview  jQuery plugin that creates message dialog.
 * @link          
 * @author        Bing Cheng (bing.cheng@autodesk.com)
 * @version       1.0.0
 * @requires      jQuery 1.7+
 *
 * @license jQuery Message Plugin v1.0.0
 * 
 * Copyright 2015 Bing Cheng (bing.cheng@autodesk.com)
 * 
 * 
 */
if ( typeof Object.create !== 'function' ) {
    Object.create = function( obj ) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
};

(function($, window, document,undefined){

	///
	/// make sure there is only one message dialog instance 
	/// appeared on the web page
	///
	$.Messagecache={
		
		singleton:null
	};
	
	var MessageDialog={
	
		__init: function(opts){
			var self=this;
			
			self.__create(opts).__auotsize().__autooffset();
		},
		
		__create: function(opts){
			
			var self=this;
			opts=$.extend( {}, self.__options, opts, true );
			self.__options=opts;
			
			
			var zIndex = self.__configuration.zIndex + 1;
			
			var $titledom=$('<div></div>');
			//$titledom.attr('id','message-title').addClass('message-title').text(self.__options.title);
			
			$titledom.attr('id','message-title').addClass('message-title').html(self.__options.title);
			
			var $winboxdom=$('<span></span>');
			$winboxdom.addClass('message-winbox');
			
			var $closelink=$('<a></a>');
			$closelink.addClass('message-winbox-ico').addClass('message-winbox-close').addClass('message-winbox-close1')
				.attr('id','message-winbox-close').attr('href','javascript:;');
			$winboxdom.append($closelink);
			
			var $contentdom=$('<div></div>');
			$contentdom.attr('id','message-content').addClass('message-content');
			
			$contentdom.html(self.__options.content||'');
			
			
			var $msgboxdom=$('<div></div>');
			
			$msgboxdom.attr('id','messagebox').css('z-index',zIndex).css('width',self.__options.area[0]).css('height',self.__options.area[1]);
			$msgboxdom.addClass('message-box');
			
			$msgboxdom.append($titledom).append($contentdom).append($winboxdom);
			
			var $closedom=$msgboxdom.find('#message-winbox-close');
			$closedom.on('click', self.__close);
			
			if(self.__configuration.fix){
				$(window).on('resize', function(){
					self.__autooffset();
					(/^\d+%$/.test(self.__options.area[0]) || /^\d+%$/.test(self.__options.area[1])) && self.__autosize();
				});
			}
			self.$messageElem=$msgboxdom;
			
			return self;
		
		},
		
		prompt: function(){
			var self=this;
			
			self.__showmask();
			
			if($('#messagebox').length==0){
				$('body').append(self.$messageElem);
			}
			
			
			self.$messageElem.show(); 
			
			self.__attachmove();
			
			//self.__init();
		},
		
		__close: function(){
			var self=this;
			
			var $msgdom=$('#messagebox');
			if($msgdom!=null||$msgdom.length>0) {
				$msgdom.html('').remove();
			}
			
			
			var $movedom=$('#messagemove');
			if($movedom!=null&&$movedom.length>0){
				$movedom.html('').remove();
			}
			
			var $maskdom=$('#tipmask');
			if($maskdom!=null&&$maskdom.length>0){
				$maskdom.html('').remove();
			}
		},
		
		__auotsize: function(){
			var self = this, config = self.__configuration;
			var options=self.__options;
			var $msgboxdom = self.$messageElem;
			
			var area = [$msgboxdom.innerWidth(), $msgboxdom.innerHeight()];
			var titHeight = $msgboxdom.find('#{0}'.format('message-title')).outerHeight() || 0;
		
			$contentdom=$msgboxdom.find('#{0}'.format('message-content'));
			if($contentdom!=null||$contentdom.length>0){
				$contentdom.height(area[1] - titHeight - 2*(parseFloat($contentdom.css('padding'))|0))
			}
			
			return self;
		
		},
		
		__autooffset: function(){
			
			var self=this;
			
			var win=$(window);
			
			var self = this, config = self.__configuration, $messagedom = self.$messageElem;
			var area = [$messagedom.outerWidth(), $messagedom.outerHeight()];
			
			self.offsetTop = (win.height() - area[1])/2;
			self.offsetLeft = (win.width() - area[0])/2;
	
			$messagedom.css({top: self.offsetTop, left: self.offsetLeft});
		
			return self;
		},
		
		__attachmove: function(){
		
			var self=this, config=self.__configuration;
			
			var $messagedom=$('#messagebox'),$titledom;
			if($messagedom!=null||$messagedom.length>0){
				$titledom=$messagedom.find('#{0}'.format(config.movedomid));
			}
			
			if($titledom==null||$titledom.length==0){
				return;
			}
			
			$titledom.attr('move', 'ok').css({cursor: config.movedomid ? 'move' : 'auto'});
			
			$titledom.on('mousedown',function(e){
				
				e.stopPropagation();
				e.preventDefault();
				
				var $this=$(this);
				if($this.attr('move') === 'ok'){
					MoveSetting.ismove = true;
					MoveSetting.$msgbox = $(this).parents('#{0}'.format('messagebox'));
					var xx = MoveSetting.$msgbox.offset().left, yy = MoveSetting.$msgbox.offset().top;
					var ww = MoveSetting.$msgbox.width() - 6, hh = MoveSetting.$msgbox.height() - 6;
					
					if($('#messagebox-moves')==null||$('#messagebox-moves').length==0){
						var $msgmovedom=$('<div></div>');
						$msgmovedom.attr('id','messagebox-moves').addClass('message-move')
							.css({left:'{0}px'.format(xx),top:'{0}px'.format(yy),width:'{0}px'.format(ww),height:'{0}px'.format(hh)})
							.css('z-index','2147483584');
							
						$('body').append($msgmovedom);
					}
					
					MoveSetting.$movebox = $('#messagebox-moves');
					MoveSetting.moveType && MoveSetting.$movebox.css({visibility: 'hidden'});
				   
					MoveSetting.moveX = e.pageX - MoveSetting.$movebox.position().left;
					MoveSetting.moveY = e.pageY - MoveSetting.$movebox.position().top;
					MoveSetting.$msgbox.css('position') !== 'fixed' || (MoveSetting.$movebox.setY = $(window).scrollTop());
				}
			});
			
			$(document).on('mousemove',function(e){
				if(!MoveSetting.ismove){
					return;
				}
				var offsetX = e.pageX - MoveSetting.moveX, offsetY = e.pageY - MoveSetting.moveY;
				e.preventDefault();

				//make sure the dialog cannot be drag out the window rectancle
				if(!config.moveOut){
					MoveSetting.setY = $(window).scrollTop();
					var rEdge = $(window).width() - MoveSetting.$movebox.outerWidth(), tEdge = MoveSetting.setY;               
					offsetX < 0 && (offsetX = 0);
					offsetX > rEdge && (offsetX = rEdge); 
					offsetY < tEdge && (offsetY = tEdge);
					offsetY > $(window).height() - MoveSetting.$movebox.outerHeight() + MoveSetting.setY && (offsetY = $(window).height() - MoveSetting.$movebox.outerHeight() + MoveSetting.setY);
				}
				
				MoveSetting.$movebox.css({left: offsetX, top: offsetY});    
				config.moveType && MoveSetting.moveLayer();
				
				offsetX = offsetY = rEdge = tEdge = null;
				
			}).on('mouseup',function(e){
				try{
					if(MoveSetting.ismove){
						MoveSetting.moveLayer();
						MoveSetting.$movebox.remove();
					}
					MoveSetting.ismove = false;
				}catch(ex){
					MoveSetting.ismove = false;
				}
			
			});
			
			return self;
		},
		__showmask: function(){
		
			if($('#tipmask').length==0){
				var $maskdom=$('<div></div>');
		
				$maskdom.attr('id','tipmask').attr('times','1').css('position','absolute').css('zIndex','19891014');
				$maskdom.css('display','none');
				
				$('body').prepend($maskdom);
				//$('body').prepend('<div id="tipmask" style="display:none;"></div>');
			}
			
			var $maskdom=$('#tipmask');
				
			if(document.all){
				var ieversion = navigator["appVersion"].substr(22, 1);  
				if (ieversion == 6 || ieversion == 5) { 
					hideSelectBoxes(); 
				}  
			}
			else{
				//$mask.css('filter','alpha(opacity=20)')
			}
			
			$maskdom.removeClass().addClass('message-mask').css('display','block');
		
		},
		
		__hidemask: function(){
		
			var $mask=$('#tipmask');
			$mask.css('display','none');
			
			var ieversion = navigator["appVersion"].substr(22, 1);  
			if (ieversion == 6 || ieversion == 5) { 
				showSelectBoxes(); 
			}  
		},
		
		__configuration:{
			movedomid:'message-title',
			shade: 0.3,
			fix: true,
			offset: 'auto',
			closeBtn: 1,
			zIndex: 19891014,
			maxWidth: 360,
			scrollbar: true //enable web browser's scroll bar
		},
		
		__options:{
			title: 'message',
			content: 'this is content',
			area: ['420px','340px']
		},
		
		__template4msgBox:{
			template4Title:'',
			template4Content:'',
			template4Winbtn:''
		}
	};
	
	var MoveSetting={
		setY:0,ismove:false,
		$msgbox:null,$movebox:null,
		
		moveX:null,moveY:null,
		
		moveLayer: function(){
			var mgleft = parseInt(this.$msgbox.css('margin-left'));
			var lefts = parseInt(this.$movebox.css('left'));
			mgleft === 0 || (lefts = lefts - mgleft);
			if(this.$msgbox.css('position') !== 'fixed'){
				lefts = lefts - this.$msgbox.parent().offset().left;
				this.setY = 0;
				
			}
			this.$msgbox.css({left: lefts, top: parseInt(this.$movebox.css('top')) - this.setY});
		}
	};
	
	$.MessageDialog=function(options){
		///
		/// make sure there is only one message dialog instance 
		/// appeared on the web page
		///
		if($.Messagecache.singleton!=null){
			return $.Dialogcahe.singleton;
		}
		var dialogObj = Object.create( MessageDialog );
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
	
})(jQuery, window, document,undefined)


