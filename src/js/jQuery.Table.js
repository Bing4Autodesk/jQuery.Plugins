/**
 * Dialog.js
 *
 * @fileoverview  jQuery plugin that creates table.
 * @link          
 * @author        Bing Cheng (bing.cheng@autodesk.com)
 * @version       1.0.0
 * @requires      jQuery 1.7+
 *
 * @license jQuery Table Plugin v1.0.0
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

(function($, window, document, undefines){
	
	///
	/// Cache some data for global usage
	///
	$.JqTableCache={
	
		data:null
	};
	
	var Table={
		
		__init:function(placehoder,opts){
			var self=this;
			self.placeholder=placehoder;
			opts=$.extend( {}, self.__options, opts );
			self.options=opts;
			
			self.headerOpts=$.extend({}, self.options.header, true);
			self.bodyOpts=$.extend({}, self.options.body, true);
			self.footerOpts=$.extend({}, self.options.footer, true);
			
			self.__populateHeader(self.headerOpts);
			self.__populateBody(self.bodyOpts);
			self.__populateFooter(self.footerOpts);
			
			return self;
		},
		
		__dispose:function(opts){
		
		},
		
		__populateHeader:function(opts){
		
			var self=this,data=opts.data||[];
			
			var $headerTable=$('<table></table>');
			$headerTable.addClass('data-table').addClass('table-header-bg')
				.css('cellpadding',0).css('cellspacing',0);
				
			var $tableTheader=$('<thead></thead>');
			
			var $headerTr=$('<tr></tr>');
			self.options.coloumWidth=[];
			
			for(var index=0;index<data.length;index++){
				var coloumnKey=data[index];
				var coloumnName=data[coloumnKey].displayName||'unKnown';
				var columnSize=data[coloumnKey].width||'60px';
				self.options.coloumWidth.push(columnSize);
				
				var $coloumn=$('<div></div>');
				var headerWidth=self.__extractNum(columnSize);
				
				if(index==0){
					$coloumn.addClass('table-sort-none-left').css('width','{0}px'.format(headerWidth-2));
				}
				else{
					$coloumn.addClass('table-sort-none').css('width','{0}px'.format(headerWidth-2));
				}
				var $pcoloumnDom=$('<p></p>');
				
				$pcoloumnDom.addClass('liner-text');
				$pcoloumnDom.html(coloumnName).appendTo($coloumn);
				
				var $headerTd=$('<td></td>');
				$headerTd.append($coloumn).appendTo($headerTr);
				//$headerTr.append($coloumn);
			}
			
			$headerTable.append($headerTr);
			$('#{0}'.format(self.placeholder)).append($headerTable);
			
			self.headerelem=$headerTable;
		},
		
		__populateBody:function(opts){
		
			var self=this,data=opts.data||[];
			
			var $bodyDom=$('<div></div>');
			$bodyDom.addClass('table-div');
			var $bodyTable=$('<table></table>'),$tableBody=$('<tbody></tbody>');
			
			$bodyTable.addClass('data-table');
			
			for(var rowIndex=0;rowIndex<data.length;rowIndex++){
				var rowName=data[rowIndex];
				var $rowDom=$('<tr></tr>');
				
				$rowDom.css('height',self.options.rowHeight);
				var $rowHeaderDom=$('<th></th>');
				$rowHeaderDom.html(rowName);
				//$rowDom.append($rowHeaderDom);
				
				for(var colIndex=0;colIndex<data[rowIndex].length;colIndex++){
					var $cellDom=$('<td></td>'),$cellDiv=$('<div><div>');
					var colName=data[rowIndex][colIndex].columnName;
					
					$cellDiv.html(data[rowIndex][colIndex].cellValue).css('width',self.options.coloumWidth[colIndex]);
						
					var cellClass=(function(ptClass){
						if(ptClass==null){
							return '';
						}
						
						return typeof ptClass==='function'?eval(ptClass($cellDiv)):eval(ptClass);
						
					})(self.options.header.data[colName].cellClass);
					
					var classArr=cellClass.split(',');
					for(var classIndex=0;classIndex<classArr.length;classIndex++){
						$cellDiv.addClass(classArr[classIndex].trim());
					}
					$cellDiv.appendTo($cellDom);
					
					(function(eventHandlers){
						if(eventHandlers==null||eventHandlers.length==0){
							return;
						}
						for(var index=0;index<self.options.bindHandlers.length;index++){
							var event = eventHandlers[self.options.bindHandlers[index]];
							if(event!==null&&typeof event==='function'){
								$cellDom.bind(self.options.bindHandlers[index],event);
							}
							
						}
					})(self.options.header.data[colName].handlers);
					
					$cellDom.addClass('table-cell-none');
					$rowDom.append($cellDom);
				}
				
				$tableBody.append($rowDom);
			}
			
			$bodyTable.append($tableBody).appendTo($bodyDom);
			
			$('#{0}'.format(self.placeholder)).append($bodyTable);
		},
		
		__populateFooter:function(opts){
		
			var self=this,data=opts.data;
			var footerWidth=self.__calculateTableWidth();
			
	
			var $footerDom=$('<div></div>');
			$footerDom.addClass('table-page-toolbar').css('width','{0}px'.format(footerWidth));
			
			
			
			var $startLink=$('<a></a>');
			$startLink.addClass('table-page-start');
			
			$startLink.html('&lt;&lt;');
			$footerDom.append($startLink);
			
			var $previousLink=$('<a></a>');
			$previousLink.html('&lt;');
			$previousLink.addClass('table-page-prev');
			$footerDom.append($previousLink);
			
			var $pageForm=$('<form></form>');
			var $formContent=$('<div></div>');
			$formContent.addClass('table-page-info');
			
			var $inputDom=$('<input type="text"/>');
			$inputDom.attr('value',1).addClass('table-page-input');
			$formContent.html('Page').append($inputDom).appendTo($pageForm);
			
			
			$footerDom.append($pageForm);
			
			var $nextLink=$('<a></a>');
			$nextLink.html('&gt;');
			$nextLink.addClass('table-page-next');
			
			$footerDom.append($nextLink);
			
			var $loadingDom=$('<div></div>').appendTo($footerDom);
			$loadingDom.addClass('table-page-loading').addClass('table-page-loading-done');
			
			$('#{0}'.format(self.placeholder)).append($footerDom);
		
		},
		
		__calculateTableWidth:function(){
		
			var self=this,totalWidth=0;
			var bodyTable=$('#{0}'.format(self.placeholder)).find('table')[1];
			var bodyWidth=$(bodyTable).width();
	
			return bodyWidth;
		},
		
		__covert2Vertical:function(srcString){
			
			var result=srcString[0];
			for(var index=1;index<srcString.length;index++){
				result+='</br>{0}'.format(srcString[index]);
			}
			
			return result;
		},
		
		__extractNum:function(srcString){
		
			var index=srcString.indexOf('px');
			var num=srcString.substring(0,index);
			return parseInt(num);
		},
		
		previousPage:function(){
		
		},
		
		nextPage:function(){
		
		},
		
		go2Page:function(index){
		
		},
		
		renderTable:function(data){
			//var headerOpts=S.extend({},)
			
		},
		
		__options:{
		
			pageSize:15,
			pageCount:1,
			coloumWidth:{
				column1:'100px',
				column2:'100px',
				column3:'100px'
			},
			rowHeight:'30px',
			bindHandlers:['click']
		},
		
	};
	
	///
	/// Common configuration of table
	///
	var Configuration4Table={
	
		configuration4Header:{
		
		},
		
		configuration4Boady:{
		
		},
		
		configuration4Tail:{
		
		}
	};
	
	function model4ColumnHeader(field,displayName,width){
		this.field=field;
		this.displayName=displayName;
		if(width){
			this.width=width;
		}
	};
	model4ColumnHeader.prototype.cellClass=null;
	model4ColumnHeader.prototype.handlers={
		'click':function(){}
	};
	

	
	function model4Cell(name,value){
		this.columnName=name;
		this.cellValue=value;
	};
	
	$.JqTable=function(placeholder,opts,debug){
	
		var tableObj=Object.create(Table);
		
		if(debug==true){
		
			InitDebugOptions();
			opts=DebugOptions;
		}
		
		tableObj.__init(placeholder,opts);
		return tableObj;
		
	};
	
	var InitDebugOptions=function(){
		var headerArr=new Array('column1','column2','column3','column4','column5','column6','column7');
		
		headerArr['column1']=new model4ColumnHeader('column1','column1','80px');
		headerArr['column2']=new model4ColumnHeader('column2','column2','80px');
		headerArr['column3']=new model4ColumnHeader('column3','column3','80px');
		headerArr['column4']=new model4ColumnHeader('column4','column4','80px');
		headerArr['column5']=new model4ColumnHeader('column5','column5','80px');
		headerArr['column6']=new model4ColumnHeader('column6','column6','80px');
		headerArr['column7']=new model4ColumnHeader('column7','column7','80px');

		DebugOptions.header={
			data:headerArr
		};
		
		var bodyArr=new Array();
		
		bodyArr[0]=new Array(new model4Cell('column1','1001'),new model4Cell('column2','1002'),new model4Cell('column3','1003'),
			new model4Cell('column4','1004'),new model4Cell('column5','1005'),new model4Cell('column6','1006'),new model4Cell('column7','1007'));
		bodyArr[1]=new Array(new model4Cell('column1','2001'),new model4Cell('column2','2002'),new model4Cell('column3','2003'),
			new model4Cell('column4','2004'),new model4Cell('column5','2005'),new model4Cell('column6','2006'),new model4Cell('column7','2007'));
		bodyArr[2]=new Array(new model4Cell('column1','3001'),new model4Cell('column2','3002'),new model4Cell('column3','3003'),
			new model4Cell('column4','3004'),new model4Cell('column5','3005'),new model4Cell('column6','3006'),new model4Cell('column7','3007'));
		bodyArr[3]=new Array(new model4Cell('column1','4001'),new model4Cell('column2','4002'),new model4Cell('column3','4003'),
			new model4Cell('column4','4004'),new model4Cell('column5','4005'),new model4Cell('column6','4006'),new model4Cell('column7','4007'));
		bodyArr[4]=new Array(new model4Cell('column1','5001'),new model4Cell('column2','5002'),new model4Cell('column3','5003'),
			new model4Cell('column4','5004'),new model4Cell('column5','5005'),new model4Cell('column6','5006'),new model4Cell('column7','5007'));
		bodyArr[5]=new Array(new model4Cell('column1','6001'),new model4Cell('column2','6002'),new model4Cell('column3','6003'),
			new model4Cell('column4','6004'),new model4Cell('column5','6005'),new model4Cell('column6','6006'),new model4Cell('column7','6007'));
		bodyArr[6]=new Array(new model4Cell('column1','7001'),new model4Cell('column2','7002'),new model4Cell('column3','7003'),
			new model4Cell('column4','7004'),new model4Cell('column5','7005'),new model4Cell('column6','7006'),new model4Cell('column7','7007'));
			
		DebugOptions.body={
			data:bodyArr
		};
		
	};
	
	var DebugOptions={
	
		header:null,
		body:null,
		footer:null
	}
	
	///
	/// Format String
	///
	String.prototype.format=function(){
		var args = arguments;
		return this.replace(/\{(\d+)\}/g,                
			function(m,i){
				return args[i];
			});
	};
	
})(jQuery, window, document)
