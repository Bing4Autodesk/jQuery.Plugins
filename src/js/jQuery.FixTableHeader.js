
 /**
 * FixTableHeader.js
 *
 * @fileoverview  jQuery plugin that fixes table column header and line header.
 * @link          
 * @author        Cheng Bing (chengbing@eastmoney)
 * @version       1.0.0
 * @requires      jQuery 1.7+
 *
 * @license jQuery fix table header Plugin v1.0.0
 * 
 * Copyright 2015 Cheng Bing (chengbing@eastmoney.com)
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
/// Format String
///
if ( typeof String.prototype.format !== 'function' ){
	String.prototype.format=function(){
	var args = arguments;
	return this.replace(/\{(\d+)\}/g,                
		function(m,i){
			return args[i];
		});
	};
};

(function($, window, document, undefined){
	
	///
    /// Stop event bubble to parent dom element
    ///
    function stopBubble(event) {
        if (event && event.stopPropagation) {
            // For other browsers
            event.stopPropagation();
        }
        else {
            // For IE browser
            window.event.cancelBubble = true;
        }
    }
	
    ///
    /// Prevent browser's default behavior (W3C)
    ///
    function stopDefault(event) {
        if (event && event.preventDefault) {
            // For other browsers
            event.preventDefault();
        }
        else {
            // For IE browser
            window.event.returnValue = false;
        }

        return false;
    }
	
	// Default options
	var defaultOptions={
		fixedWidth:'1024px',
		fixedHeight:'768px',
		fixedColumnNumber:1
	};
	
	var jQFixHeader={
		
		_fixedDomDiv:{
			
			layoutDiv:null,
			fixedDiv:null,
			headerDiv:null,
			columnDiv:null,
			dataDiv:null
		},
		
		_tableDom:'',
		_tableHtml:'',
		
		initialize:function(tableID,options){
			var self=this,
				opts=$.extend({}, Object.create(defaultOptions), options||{}, true);
			
			self._tableDom=tableID;
			self._options=opts;
			
			return self;
		},
		
		dispose:function(){
			
			var self=this;
			// To do dispose operation
			self._options=null;
			self._tableDom = self._tableHtml = null;;
			
			return self;
		},
		
		_allocateVariables4Fixing:function(){
			
			var self=this;
			
			self._fixedDomDiv.layoutDiv='{0}_layout'.format(self._tableDom);
			self._fixedDomDiv.fixedDiv='{0}_fixed'.format(self._tableDom);
			self._fixedDomDiv.headerDiv='{0}_header'.format(self._tableDom);
			self._fixedDomDiv.columnDiv='{0}_coloumn'.format(self._tableDom);
			self._fixedDomDiv.dataDiv='{0}_data'.format(self._tableDom);
			
			return self;
		
		},
		
		_createLayoutDom:function(options){
			var self=this;
			
			if ($(self._fixedDomDiv.layoutDiv).length > 0) {
				$(self._fixedDomDiv.layoutDiv).before($(self._tableDom));
				$(self._fixedDomDiv.layoutDiv).remove();
			}
			
			var $layoutDiv=$('<div></div>');
			$layoutDiv.attr('id',self._fixedDomDiv.layoutDiv.substring(1)).css('overflow','visible').css('height',options.fixedHeight)
				.css('width',options.fixedWidth);
			
			$(self._tableDom).after($layoutDiv);
			
			self._tableHtml=document.getElementById(self._tableDom.substring(1)).outerHTML;
			document.getElementById(self._tableDom.substring(1)).outerHTML='';
			
			return self;
		},
		
		_cloneFixedDivDom:function(){
			var self=this;
			var $fixedDom=$('<div></div>');
			$fixedDom.attr('id',self._fixedDomDiv.fixedDiv.substring(1));
			$fixedDom.html(self._tableHtml);
			
			$(self._fixedDomDiv.layoutDiv).append($fixedDom);
			
			$('{0} {1}'.format(self._fixedDomDiv.fixedDiv,self._tableDom)).attr('id', '{0}_{1}'.format(self._fixedDomDiv.fixedDiv.substring(1),'clone'));
			return self;
			
		},
		
		_cloneHeaderDivDom:function(){
		
			var self=this;
			
			var $headerDom=$('<div></div>');
			$headerDom.attr('id',self._fixedDomDiv.headerDiv.substring(1));
			$headerDom.append(self._tableHtml);
			$('{0} {1}'.format(self._fixedDomDiv.headerDiv,self._tableDom)).attr('id', '{0}_{1}'.format(self._fixedDomDiv.headerDiv.substring(1),'clone'));
			
			$(self._fixedDomDiv.layoutDiv).append($headerDom);
			return self;
		},
		
		_cloneColumnDivDom:function(){
		
			var self=this,$columnDom=$('<div></div>');
			$columnDom.attr('id',self._fixedDomDiv.columnDiv.substring(1));
			$columnDom.append(self._tableHtml);
			$('{0} {1}'.format(self._fixedDomDiv.columnDiv,self._tableDom)).attr('id', '{0}_{1}'.format(self._fixedDomDiv.columnDiv.substring(1),'clone'));
			
			$(self._fixedDomDiv.layoutDiv).append($columnDom);
			return self;
		
		},
		
		_cloneDataDiv:function(){
			var self=this,$dataDom=$('<div></div>');
			$dataDom.attr('id',self._fixedDomDiv.dataDiv.substring(1));
			$dataDom.append(self._tableHtml);
			//$('{0} {1}'.format(self._fixedDomDiv.dataDiv,self._tableDom)).attr('id', '{0}_{1}'.format(self._fixedDomDiv.dataDiv,'clone'));
			
			$(self._fixedDomDiv.layoutDiv).append($dataDom);
			return self;
		},
		
		///
		/// Fix table's column header and line header
		///
		fixedTable:function(options){
			
			var self=this;
			
			options=options||{};
			options=$.extend({}, self._options, options, true);
			
			self._allocateVariables4Fixing();
			
			self._createLayoutDom(options)._cloneFixedDivDom()._cloneHeaderDivDom()
				._cloneColumnDivDom()._cloneDataDiv();
			
			var scrollSize=18,
				scrollLeft = ($(self._fixedDomDiv.layoutDiv).length !== 0)?$(self._fixedDomDiv.dataDiv).scrollLeft():0;
		
			$('{0} table'.format(self._fixedDomDiv.layoutDiv)).each(function () {
				$(this).css('margin', '0px');
			});
			
			var headerHeight=$('{0} thead'.format(self._fixedDomDiv.headerDiv)).height()
			headerHeight += 2;
			
			var columnsWidth = 0,columnsNumber = 0;
			
			$('{0} tr:last td:lt({1})'.format(self._fixedDomDiv.columnDiv,options.fixedColumnNumber)).each(function () {
				columnsWidth += $(this).outerWidth(true);
				columnsNumber++;
			});
			columnsWidth += 2;
			
			/*
			 *
			 * 当前不考虑IE版本的支持
			 * 后期修复该bug
			 *
			if ($.browser.msie) {
				switch ($.browser.version) {
					case "7.0":
						if (columnsNumber >= 3) columnsWidth--;
						break;
					case "8.0":
						if (columnsNumber >= 2) columnsWidth--;
						break;
				}
			}
			*/

			$(self._fixedDomDiv.headerDiv).css('height', '{0}px'.format(headerHeight));

			if (options.fixedColumnNumber > 0) {
			
				$(self._fixedDomDiv.fixedDiv).css('height', '{0}px'.format(headerHeight)).css('width','{0}px'.format(columnsWidth));
				$(self._fixedDomDiv.columnDiv).css('width', '{0}px'.format(columnsWidth));
			}

			$(self._fixedDomDiv.dataDiv).scroll(function (e) {
				stopBubble(e); stopDefault(e);
				$(self._fixedDomDiv.headerDiv).scrollLeft($(self._fixedDomDiv.dataDiv).scrollLeft());
				if (options.fixedColumnNumber > 0) {
					$(self._fixedDomDiv.columnDiv).scrollTop($(self._fixedDomDiv.dataDiv).scrollTop());
				}
			});
			
			$(self._fixedDomDiv.columnDiv).get(0).onmousewheel = function (e) {
				//阻止事件冒泡以防窗体滚动
				stopBubble(e); stopDefault(e);
				$(self._fixedDomDiv.dataDiv).scrollTop($(self._fixedDomDiv.dataDiv).scrollTop() - e.wheelDelta);
			};
			$(self._fixedDomDiv.headerDiv).css({ 'overflow': 'hidden', 'width': parseInt(options.fixedWidth) - scrollSize, 'position': 'relative', 'z-index': '45' });
			$(self._fixedDomDiv.dataDiv).css({ "overflow": 'auto', 'width': options.fixedWidth, 'height': options.fixedHeight, 'position': 'relative', 'z-index': '35' });


			var offLayout = $(self._fixedDomDiv.layoutDiv).offset();
			
			if (options.fixedColumnNumber > 0) {
				$(self._fixedDomDiv.fixedDiv).css({ 'overflow': 'hidden', 'position': 'relative', 'z-index': '50' });
				$(self._fixedDomDiv.columnDiv).css({ 'overflow': 'hidden', 'height': options.fixedHeight - scrollSize, 'position': 'relative', 'z-index': '40' });

				if ($(self._fixedDomDiv.headerDiv).width() > $('{0} table'.format(self._fixedDomDiv.fixedDiv)).width()) {
					
					$(self._fixedDomDiv.headerDiv).css('width', $('{0} table'.format(self._fixedDomDiv.fixedDiv)).width());
					$(self._fixedDomDiv.dataDiv).css('width', $('{0} table'.format(self._fixedDomDiv.fixedDiv)).width() + scrollSize);
				}
				if ($(self._fixedDomDiv.columnDiv).height() >= $("{0} table".format(self._fixedDomDiv.columnDiv)).height()) {
					
					var dataHeight = $(self._fixedDomDiv.layoutDiv).height();
					var columnHeight = $(self._fixedDomDiv.layoutDiv).height() - 18;
					$(self._fixedDomDiv.columnDiv).css('height', '{0}px'.format(columnHeight));
					$(self._fixedDomDiv.dataDiv).css('height', '{0}px'.format(dataHeight));
				}
				
				$(self._fixedDomDiv.fixedDiv).offset(offLayout);
				$(self._fixedDomDiv.columnDiv).offset(offLayout);
			}
			if ($(self._fixedDomDiv.layoutDiv).length !== 0) {
				
				$(self._fixedDomDiv.dataDiv).scrollLeft(scrollLeft);
			}
			
			$(self._fixedDomDiv.headerDiv).offset(offLayout);
			
			//offLayout = $(self._fixedDomDiv.headerDiv).offset();
			$(self._fixedDomDiv.dataDiv).offset(offLayout);
			
			return self;
		},
		
		_options:null,
		
	};
	
	var jQFixWrapper=function(tableDom, options){
	
		if(!tableDom){
			console.error('jQFixHeader :: constructor > argument is illegal.');
			return false;
		}
		var fixHandler=Object.create(jQFixHeader);
		
		fixHandler.initialize(tableDom,options).fixedTable(options).dispose();	
		fixHandler=null;
		
		return true;;
	};
	
	// Original jQFixHeader object
	var _jQFixHeader=$.jQFixHeader;
	
	$.extend(
	{
		// Public API
		jQFixHeader:jQFixWrapper
	});
	
    ///
    /// no conflict api for jQFixHeader plugin
    ///
    $.jQFixHeader.noConflict = function () {
		
		$.jQFixHeader = _jQFixHeader;
        return jQFixWrapper;
    };
		
})(jQuery, window, document);
