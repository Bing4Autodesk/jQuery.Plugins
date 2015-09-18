
/**
 * Table.js
 *
 * @fileoverview  jQuery plugin that creates table.
 * @link          
 * @author        Cheng Bing (chengbing@eastmoney)
 * @version       1.0.0
 * @requires      jQuery 1.7+
 *
 * @license jQuery Table Plugin v1.0.0
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

///
/// Judge whether it is a positive integer
///
if ( typeof Object.isPositiveInt !== 'function' ){
	Object.isPositiveInt=function( obj ){
		if(/^\d+$/.test(obj.toString())){
			return true;
		}
		return false;
	}
	
};

(function($, window, document, undefined){
	
	///
	/// variables for fixing table
	///
	var varible4Fixing={
		layoutDiv:null,
		fixedDiv:null,
		headerDiv:null,
		columnDiv:null,
		dataDiv:null
	};
	
	///
	/// default setting options for this table plugin
	///
	var defaultOptions={
		fixedWidth:'1024px',
		fixedHeight:'568px',
		fixedColumnNumber:1
	};
	
	var jQTable={
		
		_fixedDomDiv:null,
		
		_placeholder:'',
		_div4Table:'',
		_tableDom:'',
		_tableHtml:'',
		
		initialize:function(placehoder,options){
			var self=this;
			
			self._tableHtml='';
			self._placeholder=placehoder;
			
			self._fixedDomDiv=Object.create(varible4Fixing);
			
			options=options||{};
			
			opts=$.extend({}, Object.create(defaultOptions), options, true);
			self._options=opts;
			
			console.log(self._options);
			return self;
		},
		
		dispose:function(){
			var self=this;
			
			///
			/// To do dispose operation
			///
			self._placeholder=null;
			self._options=null;
			
			return self;
		},
		
		///
		/// Create place holder for table
		///
		_createTableDiv:function(placeholder,options){
			var self=this;
			if(self._div4Table===null){
				self._div4Table='{0}_{1}'.format(placeholder,'div_table_main');
			}
			var $tableDiv=$('<div></div>');
			$tableDiv.attr('id',self._div4Table.substring(1)).addClass('div_table_main');
			if($(placeholder).length>0){
				$(placeholder).append($tableDiv);
			};
			
			
			return self;
		},
		
		_createTableDom:function(options){
			var self=this;
			if($('{0}'.format(self._placeholder)).length<=0){
				return self;
			}
			
			var $table=$('<table></table>');
			self._tableDom='{0}_{1}'.format(self._placeholder,'data_main');
			$table.attr('id',self._tableDom.substring(1)).addClass('table_main');
			
			$('{0}'.format(self._placeholder)).append($table);
			
			return self;
		},
		
		_createTableHeader:function(dataJson, options){
			
			var self=this;
			
			if(self._tableDom===null){
				self._tableDom='{0}_{1}'.format(self._placeholder,'data_main');
			}
			if($('{0}'.format(self._tableDom))<=0){
				return self;
			}
			
			var $tableTheader=$('<thead></thead>'),hData=[];
			for(var propery in dataJson.header){
				if(propery=='data'){
					hData=dataJson.header[propery];
					break;
				}
			}
			
			for(var index=0;index<hData.length;index++){
				var $headerTr=$('<th></th>');
				$headerTr.html(hData[index]);
				if(index==0){
					$headerTr.addClass('table_text_left').css('width','220px');
				}
				else{
					$headerTr.addClass('table_text_right').css('width','150px');;
				}
				$tableTheader.append($headerTr);
			
			}
			$tableTheader.append($('<th></th>'));
			
			
			$('{0}'.format(self._tableDom)).append($tableTheader);
			
			return self;
		},
		
		_createTableBody:function(dataJson, options){
			var self=this;
			
			if(self._tableDom===null){
				self._tableDom='{0}_{1}'.format(self._placeholder,'data_main');
			}
			if($('{0}'.format(self._tableDom))<=0){
				return self;
			}
			
			var $tableTbody=$('<tbody></tbody>');
			
			for(var propery in dataJson.body){
				var bData=[];
				//if(propery.isPositiveInt()){
					bData=dataJson.body[propery];
				//}
				if(!bData||bData.length<=0){
					continue;
				}
				var $bodyTr=$('<tr></tr>');
				
				for(var index=0;index<bData.length;index++){
					var $bodyTd=$('<td></td>');
					$bodyTd.html(bData[index]);
					if(index===0){
						$bodyTd.addClass('table_text_left').addClass('table_row_header')
							.attr('width','220px');
					}
					else{
						$bodyTd.addClass('table_text_right').attr('width','150px');
					}
					$bodyTr.append($bodyTd);
				}
				
				$bodyTr.append($('<td></td>')).appendTo($tableTbody);
			}
			$('{0}'.format(self._tableDom)).append($tableTbody);
			
			return self;
		},
		
		_createTableFooter:function(options){
		
			var self=this;
			
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
		
			var self=this;
			
			var $columnDom=$('<div></div>');
			$columnDom.attr('id',self._fixedDomDiv.columnDiv.substring(1));
			$columnDom.append(self._tableHtml);
			$('{0} {1}'.format(self._fixedDomDiv.columnDiv,self._tableDom)).attr('id', '{0}_{1}'.format(self._fixedDomDiv.columnDiv.substring(1),'clone'));
			
			$(self._fixedDomDiv.layoutDiv).append($columnDom);
			return self;
		
		},
		
		_cloneDataDiv:function(){
			var self=this;
			
			var $dataDom=$('<div></div>');
			$dataDom.attr('id',self._fixedDomDiv.dataDiv.substring(1));
			$dataDom.append(self._tableHtml);
			//$('{0} {1}'.format(self._fixedDomDiv.dataDiv,self._tableDom)).attr('id', '{0}_{1}'.format(self._fixedDomDiv.dataDiv,'clone'));
			
			$(self._fixedDomDiv.layoutDiv).append($dataDom);
			return self;
		},
		
		///
		/// Fixed row header and column header for table
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
				e.cancelBubble = true;
				$(self._fixedDomDiv.headerDiv).scrollLeft($(self._fixedDomDiv.dataDiv).scrollLeft());
				if (options.fixedColumnNumber > 0) {
					$(self._fixedDomDiv.columnDiv).scrollTop($(self._fixedDomDiv.dataDiv).scrollTop());
				}
			});
			
			$(self._fixedDomDiv.columnDiv).get(0).onmousewheel = function (e) {
				//阻止事件冒泡以防窗体滚动
				e.cancelBubble = true;
				e.preventDefault();
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
		
		render:function(data){
			var self=this;
			
			//self._createTableDiv(self._placeholder);
			self._createTableDom(self._options)._createTableHeader(data, self._options)
				._createTableBody(data, self._options)._createTableFooter(self._options);
				
			return self;
		},
		
		_options:null,
		
	};
	
	var jQTableWrapper=function(placeholder, data, options){
	
		if(placeholder===undefined||data===undefined){
			console.error('jQTable :: Constructor > argument is illegal.');
			return false;
		}
		var tableObj=Object.create(jQTable);
		
		tableObj.initialize(placeholder,options).render(data)
			.fixedTable(options).dispose();
		
		tableObj=null;
		
		return true;;
	};
	
	var _jQFixedTable=$.jQFixedTable;
	
	$.extend(
	{
		///
		/// 提供接口共外函数调用
		///
		jQFixedTable:jQTableWrapper
	});
	
	///
    /// noConflict api for jQFixedTable plugin
    ///
    $.jQFixedTable.noConflict = function () {
		
		$.jQFixedTable = _jQFixedTable;
		
        return jQTableWrapper;
    };
		
})(jQuery, window, document);
