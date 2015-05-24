/**
 * Tool Tip.js
 *
 * @fileoverview  jQuery plugin that creates tool tip dialog.
 * @link          
 * @author        Bing Cheng (bing.cheng@autodesk.com)
 * @version       1.0.0
 * @requires      jQuery 1.7+
 *
 * @license jQuery Tool Tip Plugin v1.0.0
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
	var ToolTipcache={
		
		///
		/// Tool tip instance id
		///
		singleton:null
	};
	
	var ToolTip={
	
		__init: function(message){
			var self=this;
			
			var $toolTip=$('#{0}'.format(ToolTipcache.singleton));
			
			if($toolTip==null||$toolTip[0]==null){
				self.__create(message);
			}
			else{
			
				$toolTip.html('<pre>{0}</pre>'.format(message)).css('display','none');
			}
			
			return self;
		},
		
		__create: function(message){
			
			var self=this;
			
			var $toolTip=$('#{0}'.format(ToolTipcache.singleton));
			
			if($toolTip==null||$toolTip[0]==null){
				
				var $tipDom=$('<span></span>');
				$tipDom.attr('id',ToolTipcache.singleton).css('position','absolute').css('display','none').css('font','12px');
				var $contentDom=$('<pre></pre>').html(message).appendTo($tipDom);
				$('body').append($tipDom);
			}
			else{
				$toolTip.html('<pre>{0}</pre>'.format(message)).css('display','none');
			}
			
			return self;
		
		},
		
		show: function(event,message){
			var self=this;
			self.__create(message);
			
			var $toolTip=$('#{0}'.format(ToolTipcache.singleton))
			
			var left=event.clientX,top=event.clientY;
			$toolTip.css('left',left).css('top',top).css('display','');

		},
		
		hide:function(){
			var self=this;
			
			var $toolTip=$('#{0}'.format(ToolTipcache.singleton));
			
			if($toolTip==null||$toolTip[0]==null){
				return;
			}
			$toolTip.css('display','none');
			
			return self;
		},
		
		__close: function(){
			var self=this;
			
			// To improve in the near feature
			
			return self;
			
		},
		
		__auotsize: function(){
			var self = this, config = self.__configuration;
			
			// To improve in the near feature
				
			return self;
		
		},
		
		__autooffset: function(){
			
			var self=this;
			
			// To improve in the near feature
			
			return self;
		},
		
		__configuration:{
			
			///
			/// Unique key for tooltip
			///
			toolTipID:'tool-tip-abc345kyx'
		}
	};
	
	$.ToolTip=function(options){
		///
		/// make sure there is only one message dialog instance 
		/// appeared on the web page
		///
		
		var toolTipObj = Object.create( ToolTip );
		
		return toolTipObj;
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
	
	/****************************************************************Module to create GUID for global tool tip start*****************************************************************************/
	
	function Guid(g) {
		var arr = new Array();
		if (typeof (g) == "string") {
			InitByString(arr, g);
		}
		else {
			InitByOther(arr);
		}


		this.Equals = function (o) {
			if (o && o.IsGuid) {
				return this.ToString() == o.ToString();
			}
			else {
				return false;
			}
		}


		this.IsGuid = function () { }

		this.ToString = function (format) {
			if (typeof (format) == "string") {
				if (format == "N" || format == "D" || format == "B" || format == "P") {
					return ToStringWithFormat(arr, format);
				}
				else {
					return ToStringWithFormat(arr, "D");
				}
			}
			else {
				return ToStringWithFormat(arr, "D");
			}
		}

		function InitByString(arr, g) {
			g = g.replace(/\{|\(|\)|\}|-/g, "");
			g = g.toLowerCase();
			if (g.length != 32 || g.search(/[^0-9,a-f]/i) != -1) {
				InitByOther(arr);
			}
			else {
				for (var i = 0; i < g.length; i++) {
					arr.push(g[i]);
				}
			}
		}


		function InitByOther(arr) {
			var i = 32;
			while (i--) {
				arr.push("0");
			}
		}

		////
		/// Guid String Format
		/// N  32 bits： xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
		/// D  Splited By - 32 bits xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx 
		/// B  Contained In {} Splited By - 32 bits：{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx} 
		/// P  Containded In ()、Splited By - 32 bits：(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) 
		///

		function ToStringWithFormat(arr, format) {
			switch (format) {
				case "N":
					return arr.toString().replace(/,/g, "");
				case "D":
					var str = arr.slice(0, 8) + "-" + arr.slice(8, 12) + "-" + arr.slice(12, 16) + "-" + arr.slice(16, 20) + "-" + arr.slice(20, 32);
					str = str.replace(/,/g, "");
					return str;
				case "B":
					var str = ToStringWithFormat(arr, "D");
					str = "{" + str + "}";
					return str;
				case "P":
					var str = ToStringWithFormat(arr, "D");
					str = "(" + str + ")";
					return str;
				default:
					return new Guid();
			}
		}
	}

	Guid.Empty = new Guid();

	Guid.NewGuid = function () {
		var g = "";
		var i = 32;
		while (i--) {
			g += Math.floor(Math.random() * 16.0).toString(16);
		}
		return new Guid(g);

	}
	
	
	/****************************************************************Module to create GUID for global tool tip end*****************************************************************************/
	
	var guid = Guid.NewGuid();
	ToolTipcache.singleton = guid.ToString('D');
	guid=null;
	
})(jQuery, window, document,undefined)


