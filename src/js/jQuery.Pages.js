
/**
 * Pagination.js
 *
 * @fileoverview  jQuery plugin that creates pagination.
 * @link          
 * @author        Cheng Bing (824203428@qq.com)
 * @version       1.0.0
 * @requires      jQuery 1.7+
 *
 * @license jQuery Pagination Plugin v1.0.0
 * 
 * Copyright 2015 Cheng Bing (824203428@qq.com)
 * Released under the MIT license.
 * 
 */

///
/// Format String
///
;if (typeof String.prototype.format !== 'function') {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/\{(\d+)\}/g,
            function (m, i) {
                return args[i];
            });
    };
}

///
/// Judge whether it is a positive integer
///
if (typeof Object.isPositiveInt !== 'function') {
    Object.isPositiveInt = function (obj) {
        if (/^\d+$/.test(obj.toString())) {
            return true;
        }
        return false;
    };

}


(function ($, window, document, undefined) {

    ///
    /// Judge whether the source object is an array
    ///
    function isArray(obj) {

        return Object.prototype.toString.call(obj) === '[object Array]';
    }

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
        if (event && event.preventDefault){
            // For other browsers
            event.preventDefault();
        }   
        else{
            // For IE browser
            window.event.returnValue = false;
        }
            
        return false;
    } 

    var _debug = false;

    function Pagination(selectorID, options, params) {

        this.domID = isArray(selectorID) ? selectorID : [selectorID];

        this.defaultOptions = {

            // 为了方便把这两个属性也放在 options 中 
            pageIndex: 1,
            pageCount: 6,
            totalCount: 300,

            baseUrl: '',
            pageSize: 50,
            pageList: [20, 50, 100, 200, 500],

            method: 'GET',
            ///
            /// To do some initialized work in this function before calling ajax in get method
            ///
            beforeHttpGet: function () {

            },
            ///
            /// To do some uninitialized work in this function after calling ajax in get method 
            ///
            afterHttpGet: function () {

            },

            ///
            /// To do some initialized worlk in this function before calling ajax in post method
            ///
            beforeHttpPost: function () {

            },

            ///
            /// To do some unintialized work in this fucntion after calling ajax in post method
            ///
            afterHttpPost: function () {

            }
        };

        this.options = {};

        this.qparams = {

            types: 'S999001',
            securitycodes: '',
            date: '2015-9-16T00:00:00Z TO 2015-9-16T99:99:99Z',
            title: '',
            text: '',
            columnType: '',
            pageIndex: 1,
            limit: 50,
            sort: 'datetime',
            order: 'desc'
        };

        this.changeOptions = function (opts) {
			var self=this;
            self.options = $.extend({}, self.options, opts, true);
			self.options.pageCount=Math.ceil(self.options.totalCount / self.options.pageSize);
			
			if (self.options.pageCount !== undefined && self.options.pageCount !== null) {
				for (var index = 0; index < self.domID.length; index++) {
                    $('{0} .span_pagination_total'.format(self.domID[index])).html('');
                    $('{0} .span_pagination_total'.format(self.domID[index])).html(' (共{0}页) '.format(self.options.pageCount));
                }
			}
			if (self.options.pageIndex !== undefined && self.options.pageIndex !== null) {
                for (var index = 0; index < self.domID.length; index++) {
                    $('{0} .li_pagination_pageindex'.format(self.domID[index])).attr('value', self.options.pageIndex);
					
					$('{0} .disabled'.format(self.domID[index])).removeClass('disabled');
					if (self.options.pageIndex <= 1) {
						$('{0} .li_pagination_prepage'.format(self.domID[index])).addClass('disabled');
						$('{0} .li_pagination_firstpage'.format(self.domID[index])).addClass('disabled');
					}

					if (self.options.pageIndex >= self.options.pageCount) {
						$('{0} .li_pagination_nextpage'.format(self.domID[index])).addClass('disabled');
						$('{0} .li_pagination_lastpage'.format(self.domID[index])).addClass('disabled');
					}
                }
            }
            //console.log('The changeOptions function needed to be realized.');
        };

        ///
        /// Call httpGet function from other moudle
        ///
        this.triggerHttpGet = function (params) {
            this.changeOptions({ pageIndex: 1 });

            this.httpGet(params);
        };

        ///
        /// Call httpPost function from other moudle
        ///
        this.triggerHttpPost = function () {
            this.changeOptions({ pageIndex: 1 });

            this.httpPost(params);
        };

        this.initialize(options, params);

        function refreshData(self) {
            var params = {};

            if (self.options.method == 'GET') {
                params = $.extend({}, self.qparams, { pageIndex: self.options.pageIndex, limit: self.options.pageSize }, true);
                self.httpGet(params);

                self.qparams = params;
            }
            else if (self.options.method == 'POST') {
                params = $.extend({}, self.qparams, { pageIndex: self.options.pageIndex, limit: self.options.pageSize }, true);
                self.httpPost(params);

                self.qparams = params;
            }

            for (var index = 0; index < self.domID.length; index++) {

                //$('{0} .li_pagination_pageindex'.format(self.domID[index])).attr('value', self.options.pageIndex);
                $('{0} .li_pagination_pageindex'.format(self.domID[index])).val(self.options.pageIndex);

                $('{0} .disabled'.format(self.domID[index])).removeClass('disabled');
                if (self.options.pageIndex <= 1) {
                    $('{0} .li_pagination_prepage'.format(self.domID[index])).addClass('disabled');
                    $('{0} .li_pagination_firstpage'.format(self.domID[index])).addClass('disabled');
                }

                if (self.options.pageIndex >= self.options.pageCount) {
                    $('{0} .li_pagination_nextpage'.format(self.domID[index])).addClass('disabled');
                    $('{0} .li_pagination_lastpage'.format(self.domID[index])).addClass('disabled');
                }
            }

            return self;
        }

        (function createDom(self, opts) {

            for (var index = 0; index < self.domID.length; index++) {

                var $pageBox = $('<div></div>');
                $pageBox.addClass('pagination_box');

                $(self.domID[index]).append($pageBox);

                var $pageUl = $('<ul></ul>');
                $pageUl.addClass('ul_pagination').addClass('clearFix');
                $pageBox.append($pageUl);

                // page number per page
                var $pageLi = $('<li></li>'), $selectDom = $('<select></select>');

                $selectDom.addClass('select_index');
                for (var opsindex = 0; opsindex < self.options.pageList.length; opsindex++) {

                    if (self.options.pageList[opsindex] ==self.options.pageSize) {
                        $selectDom.append('<option selected="selected" value="{0}">{1}</option>'.format(self.options.pageList[opsindex], self.options.pageList[opsindex]));
                    }
                    else {
                        $selectDom.append('<option value="{0}">{1}</option>'.format(self.options.pageList[opsindex], self.options.pageList[opsindex]));
                    }
                }

                $pageLi.append('每页 ').append($selectDom).append(' 条');
                $pageUl.append($pageLi);

                // first page button
                $pageLi = $('<li></li>');

                var $btnInput = $('<input></input>');
                $btnInput.attr('type', 'button').attr('value', '首页').addClass('disabled').addClass('li_pagination_firstpage');
                $pageLi.append($btnInput);

                $pageUl.append($pageLi);

                // previous page button
                $pageLi = $('<li></li>');

                $btnInput = $('<input></input>');
                $btnInput.attr('type', 'button').attr('value', '上页').addClass('disabled').addClass('li_pagination_prepage');
                $pageLi.append($btnInput);

                $pageUl.append($pageLi);

                // next page button
                $pageLi = $('<li></li>');

                $btnInput = $('<input></input>');
                $btnInput.attr('type', 'button').attr('value', '下页').addClass('li_pagination_nextpage');
                $pageLi.append($btnInput);

                $pageUl.append($pageLi);

                // last page button
                $pageLi = $('<li></li>');

                $btnInput = $('<input></input>');
                $btnInput.attr('type', 'button').attr('value', '尾页').addClass('li_pagination_lastpage');
                $pageLi.append($btnInput);

                $pageUl.append($pageLi);

                // goto page button
                $pageLi = $('<li></li>');
                $pageLi.addClass('spancolor');

                var $txtInput = $('<input></input>');
                $txtInput.attr('type', 'text').attr('value', '1').addClass('text').addClass('li_pagination_pageindex');

                var $spanDom = $('<span></span>');
                $spanDom.addClass('span_pagination_total');
                $spanDom.html(' (共{0}页) '.format(self.options.pageCount));

                $btnInput = $('<input></input>');

                $btnInput.attr('type', 'button').attr('value', '确定').addClass('li_pagination_gotopage');
                $pageLi.append('转到第 ').append($txtInput).append(' 页').append($spanDom).append($btnInput);

                $pageUl.append($pageLi);
                //$(self.domID[index]).append($pageBox);

            }

            //console.log('The createDom function has been called successfully.');

        })(this);

        var self = this;
        var targetIDs = self.domID;

        for (var index1 = 0; index1 < self.domID.length; index1++) {

            $('{0} .select_index'.format(self.domID[index1])).change(function (event) {
                stopBubble(event); stopDefault(event);

                //var totalCount = self.options.pageSize * self.options.pageCount;
                var pageSize = self.options.pageSize = $(this).val();
                self.options.pageCount = Math.ceil(self.options.totalCount / self.options.pageSize);

                var params = {};

                if (self.options.method == 'GET') {
                    params = $.extend({}, self.qparams, { pageIndex: self.options.pageIndex, limit: self.options.pageSize }, true);
                    self.httpGet(params);

                    self.qparams = params;
                }
                else if (self.options.method == 'POST') {
                    params = $.extend({}, self.qparams, { pageIndex: self.options.pageIndex, limit: self.options.pageSize }, true);
                    self.httpPost(params);

                    self.qparams = params;
                }

                for (var targetIndex = 0; targetIndex < targetIDs.length; targetIndex++) {

                    $('{0} .select_index'.format(targetIDs[targetIndex])).val(pageSize);

                    $('{0} .span_pagination_total'.format(targetIDs[targetIndex])).html('');
                    $('{0} .span_pagination_total'.format(targetIDs[targetIndex])).html(' (共{0}页) '.format(self.options.pageCount));

                    $('{0} .disabled'.format(targetIDs[targetIndex])).removeClass('disabled');
                    if (self.options.pageIndex <= 1) {
                        $('{0} .li_pagination_prepage'.format(targetIDs[targetIndex])).addClass('disabled');
                        $('{0} .li_pagination_firstpage'.format(targetIDs[targetIndex])).addClass('disabled');
                    }

                    if (self.options.pageIndex >= self.options.pageCount) {
                        $('{0} .li_pagination_nextpage'.format(targetIDs[targetIndex])).addClass('disabled');
                        $('{0} .li_pagination_lastpage'.format(targetIDs[targetIndex])).addClass('disabled');
                    }
                }

                //console.log('Paging size function has been called.');

            });
        }


        for (var index = 0; index < self.domID.length; index++) {

            $('{0} .li_pagination_firstpage'.format(self.domID[index])).click(function (event) {
                stopBubble(event); stopDefault(event);

                if (self.options.pageIndex == 1) {
                    return;
                }

                self.options.pageIndex = 1;
                refreshData(self);

                //console.log('First page function has been called.');

            });

            $('{0} .li_pagination_prepage'.format(self.domID[index])).click(function (event) {
                stopBubble(event); stopDefault(event);

                if (self.options.pageIndex <= 1) {
                    return;
                }
                self.options.pageIndex--;
                refreshData(self);

                //console.log('Previous page function has been called.');

            });

            $('{0} .li_pagination_nextpage'.format(self.domID[index])).click(function (event) {
                stopBubble(event); stopDefault(event);

                if (self.options.pageIndex >= self.options.pageCount) {
                    return;
                }

                self.options.pageIndex++;
                refreshData(self);

                //console.log('Next page function has been called.');
            });

            $('{0} .li_pagination_lastpage'.format(self.domID[index])).click(function (event) {
                stopBubble(event); stopDefault(event);

                if (self.options.pageIndex == self.options.pageCount) {
                    return;
                }

                self.options.pageIndex = self.options.pageCount;
                refreshData(self);

                //console.log('Last page function has been called.');
            });


            $('{0} .li_pagination_pageindex'.format(self.domID[index])).blur(function (event) {
                stopBubble(event); stopDefault(event);

                self.options.pageIndex = $(this).val();

                for (var targetIndex = 0; targetIndex < targetIDs.length; targetIndex++) {

                    $('{0} .li_pagination_pageindex'.format(targetIDs[targetIndex])).attr('value', self.options.pageIndex);
                }

                //console.log('Last page function has been called.');
            });

            var currentID = self.domID[index];

            $('{0} .li_pagination_gotopage'.format(self.domID[index])).click(function (event) {
                stopBubble(event); stopDefault(event);

                //测试版本,不调用ajax请求
                if (_debug) {
                    return;
                }

                self.options.pageIndex = $('{0} .li_pagination_pageindex'.format(currentID)).val();
                //self.options.pageIndex = $(this).val();
                refreshData(self);

                //console.log('Goto page function has been called.');
            });
        }

    }

    Pagination.prototype.initialize = function (opts, params) {

        this.options = $.extend({}, this.defaultOptions, opts, true);
        this.qparams = $.extend({}, this.qparams, params || {}, true);
        if (this.options.pageIndex) {
            for (var index = 0; index < this.domID.length; index++) {

                $('{0} .li_pagination_pageindex'.format(this.domID[index])).attr('value', this.options.pageIndex);
            }

        }

        //console.log('The prototype initialize function needed to be realized.');

    };

    Pagination.prototype.httpGet = function (params) {

        // 测试版本不调研ajax请求
        if (_debug) {
            return;
        }

        var self = this;

        if (params && typeof params !== 'object') {
            console.warn('Pagination :: httpGet > argument is illegal.');
            return self;
        }


        if (!params) {
            params = self.qparams;
        }

        self.qparams = params;

        if (params.pageIndex && Object.isPositiveInt(params.pageIndex)) {
            //this.options.pageIndex=params.pageIndex;
            //$('{0} .li_pagination_pageindex'.format(self.domID)).attr('value',self.options.pageIndex);
        }

        var paramsdata = $.extend({}, { pageIndex: self.options.pageIndex, limit: self.options.pageSize }, params, true);


        if (typeof self.options.beforeHttpGet === 'function') {
            self.options.beforeHttpGet();
        }

        //console.log('httpGet params are: {0}'.format(JSON.stringify(paramsdata)));

        $.ajax({
            type: 'GET',
            url: self.options.baseUrl,
            data: paramsdata,
            dataType: 'json',
            success: function (data) {
                if (typeof self.options.afterHttpGet === 'function') {
                    self.options.afterHttpGet(data, true);
                }
            },
            error: function (data) {
                if (typeof self.options.afterHttpGet === 'function') {
                    self.options.afterHttpGet(data, false);
                }
            }

        });

        //console.log('The prototype httpGet function needed to be realized.');
        return self;

    };

    //var queryUrl = "pageIndex=" + this.options.pageIndex + "&limit=" + this.options.limit + "&sort=" + encodeURI(this.options.sort) + "&order=" + this.options.order;

    Pagination.prototype.httPost = function (params) {

        // 测试版本不调研ajax请求
        if (_debug) {
            return;
        }

        var self = this;

        if (params && typeof params !== 'object') {
            console.warn('Pagination :: httPost > argument is illegal.');
            return self;
        }

        if (!params) {
            params = self.qparams;
        }

        self.qparams = params;

        if (params.pageIndex && Object.isPositiveInt(params.pageIndex)) {
            //this.options.pageIndex=params.pageIndex;
            //$('{0} .li_pagination_pageindex'.format(self.domID)).attr('value',self.options.pageIndex);
        }



        var paramsdata = $.extend({}, { pageIndex: self.options.pageIndex, limit: self.options.pageSize }, params, true);

        if (typeof self.options.beforeHttpPost === 'function') {
            self.options.beforeHttpPost();
        }

        //console.log('httPost params are: {0}'.format(JSON.stringify(paramsdata)));

        $.ajax({
            type: 'POST',
            url: '',
            data: paramsdata,
            dataType: 'json',
            success: function (data) {
                if (typeof self.options.afterHttpGet === 'function') {
                    self.options.afterHttpGet(data, true);
                }
            },
            error: function (data) {
                if (typeof self.options.afterHttpGet === 'function') {
                    self.options.afterHttpGet(data, false);
                }
            }

        });

        //console.log('The prototype httPost function needed to be realized.');

        return self;

    };

    Pagination.prototype.dispose = function () {

        var self = this;

        return self;

    };

    // Root jQPagination object
    var _jQPagination = $.fn.jQPagination;

    var jQPaginationWrapper = function (options, params) {

        var selectorIDs = [];

        for (var index = 0; index < this.length; index++) {
            selectorIDs.push('#{0}'.format(this[index].id));
        }
        //console.log(selectorIDs);

        if ($(selectorIDs.join(',')).length <= 0) {
            console.warn('jQPagination :: Constructor > Target element is not existed.');
            return null;
        }

        return new Pagination(selectorIDs, options, params || {});

    };


    $.fn.extend(
	{
	    ///
	    /// 提供接口供外函数调用
	    ///
	    jQPagination: jQPaginationWrapper
	});

    ///
    /// Noconflict api for jQPagination plugin
    ///
    $.fn.jQPagination.noConflict = function (aliasName) {

        $.fn[aliasName] = jQPaginationWrapper;
        $.fn.jQPagination = _jQPagination;

        return true;
    };

})(jQuery, window, document);
