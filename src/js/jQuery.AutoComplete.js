/**
 * AutoComplete.js
 *
 * @fileoverview  自动完成控件.
 * @link          
 * @author        Cheng Bing (chengbing@eastmoney.com)
 * @requires      jQuery 1.7+
 * 
 * 
 */

// 格式化字符串（如果为定义该函数则定义该函数）
; if (typeof String.prototype.format !== 'function') {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/\{(\d+)\}/g,
            function (m, i) {
                return args[i];
            });
    };
};

// 阻止分享功能模块内部Dom元素冒泡
if (typeof stopBubble !== 'function') {
    function stopBubble(event) {
        if (event && event.stopPropagation) {
            // 针对其他浏览器
            event.stopPropagation();
        }
        else {
            // 针对IE浏览器
            window.event.cancelBubble = true;
        }
    }
};

// 阻止分享控件内部Dom元素默认行为 (W3C)
if (typeof stopDefault !== 'function') {
    function stopDefault(event) {
        if (event && event.preventDefault) {
            // 针对其他浏览器
            event.preventDefault();
        }
        else {
            // 针对IE浏览器
            window.event.returnValue = false;
        }

        return false;
    }
};

// 为中文编码
if (typeof fEncodeChinese !== 'function') {

    function fEncodeChinese(srcString) {
        return encodeURIComponent(encodeURIComponent(srcString));
    }
};

; (function ($, window, document, undefined) {
	
    ///
    /// Choice终端只能从全局window查找回调函数
    /// 只能将对象也设置全局的，对此我也很无奈。。。
    ///
    var $currentUl = null, $currentTarget = null;

    // 键值
    var KEY = { UP: 38, DOWN: 40, ENTER: 13, ESC: 27, TAB: 9 };

    ///
    /// 是否现代浏览器
    ///
    var isModern = typeof window.screenX === "number",
        visibility = "visibility";

    function asynAccessData(source, callback) {
        /// <summary>
        /// 异步请求数据
        /// </summary>
        /// <param name="source"></param>
        /// <param name="options"></param>
        /// <param name="callback"></param>

        if (typeof source === 'function') {
            var result = source();
            callback(result);
            return;
        }

        if (typeof source === 'string') {
            $.ajax({
                type: "GET",
                url: source,
                data: null,
                dataType: "json",
                success: function (data) {
                    callback(data);
                }
            });
        }
        else {
            callback(source);
        }
    };

    function createDropDownList(params) {
        /// <summary>
        /// 组装下拉html代码
        /// </summary>
        /// <param name="input"></param>

        var htmlDropList = '', data = [], ownProperties = [];

        if (params && params.data && params.data.length > 0) {
            var dataObj = params.data[0];
            for (var property in dataObj) {
                if (dataObj.hasOwnProperty(property)) {
                    ownProperties.push(property);
                }
            }
        };
        if (params.cloumnsName && params.cloumnsName.length > 0) {
            ownProperties = params.cloumnsName;
        }

        data = params.data;

        var currentKey = ($currentTarget && $currentTarget.params && $currentTarget.params.key) ? $currentTarget.params.key : 'id';

        if (data && data.length > 0) {
            $.each(data, function (index, source) {

                var liHtml = '';
                for (var index2 = 0; index2 < ownProperties.length; index2++) {
                    var temp = source[ownProperties[index2]];
                    if ($currentTarget && $($currentTarget).val().trim()) {
                        var regex = new RegExp('({0})'.format($($currentTarget).val().trim()), 'gi');
                        temp = temp.replace(regex, '<strong>$1</strong>');
                    }
                    liHtml += '<span>{0}</span>'.format(temp);
                }

                htmlDropList += '<li class="{0}" key="{1}" data="{2}">{3}</li>'.format((0 === index ? 'on' : ''),
                    (source['id'] ? source['id'] : ""), (source[currentKey] ? source[currentKey] : ""), liHtml);
            });
        }


        return htmlDropList;
    };

    function showDropDownList($ulElem, params, isIndexChange) {
        /// <summary>
        /// 显示或者隐藏
        /// </summary>
        /// <param name="$ulElem"></param>
        /// <param name="params"></param>
        /// <param name="isIndexChange"></param>

        var self = this, value = $.trim(self.value), htmlList = '';

        params = self.params;

        if (value === "") {
            $ulElem.css(visibility, "hidden");
            return;
        }
        if (params.isChoice) {
            
            window.open(params.apiKey + ':{"callbackFunName":"' + "globalCallback" + '","key":"' + fEncodeChinese(self.value) + '","ranges":[' + params.ranges + ']}', '_self');
        }
        else {
            asynAccessData(params.source, window.globalCallback);

        }
    };

    function fnHandKeyDown(e) {
        if (!$currentUl) {
            return;
        }
        var eleLi = $currentUl.find("li");

        if ($currentUl.css(visibility) === "visible") {
            switch (e.keyCode) {
                case KEY.UP: {
                    $currentTarget.indexSelected--;

                    if ($currentTarget.indexSelected < 0) {
                        $currentTarget.indexSelected = -1 + eleLi.length;
                    } 
                    for (var index = 0; index < eleLi.length; index++) {
                        if (index != $currentTarget.indexSelected) {
                            $(eleLi[index]).removeClass('on');
                        }
                        else {
                            $(eleLi[index]).addClass('on');
                        }
                    }

                    stopDefault(e); return;
                }
                case KEY.DOWN: {
                    $currentTarget.indexSelected++;

                    if ($currentTarget.indexSelected >= eleLi.length) {
                        $currentTarget.indexSelected = 0;
                    }
                    for (var index = 0; index < eleLi.length; index++) {
                        if (index != $currentTarget.indexSelected) {
                            $(eleLi[index]).removeClass('on');
                        }
                        else {
                            $(eleLi[index]).addClass('on');
                        }
                    }

                    stopDefault(e); return;
                }
                case KEY.ENTER: {
                    var $selectedLi = eleLi.eq($currentTarget.indexSelected);
                    var currentData = $selectedLi.attr('data'), currentKey = $selectedLi.attr('key')
                    var $span = $selectedLi.children('span').first();
                    eleLi.get($currentTarget.indexSelected) && $($currentTarget).val(currentData).attr('data-key', currentKey);

                    $currentUl.css("visibility", "hidden");


                    stopDefault(e); return;
                }
                case KEY.TAB: case KEY.ESC: {

                    $currentUl.css("visibility", "hidden"); return;
                }
            }
            if ($currentTarget.indexSelected !== -1) {
                if (params.isChoice) {

                    window.open(params.apiKey + ':{"callbackFunName":"' + "globalCallback" + '","key":"' + $currentTarget.value + '","ranges":[' + params.ranges + ']}', '_self');
                }
                else {
                    asynAccessData(params.source, window.globalCallback);
                }
            }
        }
    };

    $.fn.autoComplete = function (options) {

        var _self = this;

        function fnCallback(data) {
            if (!$currentUl) {
                return;
            }
            var currentParams = ($currentTarget.params && $currentTarget.params) ? $currentTarget.params : params;
            currentParams.data = data;
            var htmlList = createDropDownList(currentParams)
            $currentUl.html(htmlList);

            if (htmlList && htmlList != '' && $.trim($currentTarget.value) != '') {
                $currentUl.css(visibility, "visible");

            }
            else {
                $currentUl.css(visibility, "hidden");
            }

        };

        window.globalCallback = fnCallback;

        var defaults = {
            className: "em_auto_droplist",
            source: null,
            data: null,
            zIndex: 16,
            isChoice: true,         //是否为Choice终端
            apiKey: 'keyWizard',
            key:'id',               //选中项后在input标签内填入的值
            ranges: ["\"HS\"", "\"GG\"", "\"SB\"", "\"JJ\"", "\"MGGP\""],
            cloumnsName:[]
        };
        // 覆盖当前默认参数
        var params = $.extend({}, defaults, options || {});
       
        $(_self).each(function () {

            var self = this; self.indexSelected = 0, self.params = params;

            var $ulElem = $('<ul></ul>').html(createDropDownList(params));

            $ulElem.css({
                position: "absolute",
                marginTop: 1,
                left: $(self).position().left,
				minWidth: self.offsetWidth - 2,
                visibility: "hidden",
                zIndex: params.zIndex
            });

            $ulElem.addClass(params.className).bind("click", function (e) {
                var target = e && e.target, $selTarget = null, $currentUl = null;
                if (target) {

                    $selTarget = (target.tagName.toLowerCase() === 'li') ? $(target).children('span').first() : (target.tagName.toLowerCase() === 'span') ?
                        $(target).parent().children('span').first() : $(target).parent().parent().children('span').first();

                    $currentUl = (target.tagName.toLowerCase() === 'li') ? $(target) : (target.tagName.toLowerCase() === 'span') ?
                        $(target).parent() : $(target).parent().parent();

                }
                if ($selTarget) {

                    $(self).val($currentUl.attr('data')).attr('data-key', $currentUl.attr('key'));
                    
                }

            }).css(visibility, "hidden");

            self.$ulElem = $ulElem;

            $(self).before($ulElem).focus(function (e) {
                if ($currentUl) {
                    $currentUl.css(visibility, "hidden");
                }
                $currentUl = self.$ulElem;
                $currentTarget = self;
                showDropDownList.call(self, $currentUl, params, true);
            });

            if (!window.XMLHttpRequest) {
                // IE6的宽度
                $ulElem.width(self.offsetWidth - 2);
            };

            // 不同浏览器的不同事件
            isModern ? $(self).bind("input", function () {

                showDropDownList.call(this, $ulElem, params, true);

            }) : self.attachEvent("onpropertychange", function (e) {
                if (e.propertyName !== "value") {
                    return;
                }

                showDropDownList.call(this, $ulElem, params, true);
            });

            $(document).bind({
                "click": function (e) {
                    var target = e && e.target;
                    if (target == self && self.value) {
                        if (params.isChoice) {
                            console.log(params.apiKey + ':{"callbackFunName":"' + "globalCallback" + '","key":"' + fEncodeChinese(self.value) + '","ranges":[' + params.ranges + ']}');
                            window.open(params.apiKey + ':{"callbackFunName":"' + "globalCallback" + '","key":"' + fEncodeChinese(self.value) + '","ranges":[' + params.ranges + ']}', '_self');
                        }
                        else {
                            asynAccessData(params.source, window.globalCallback);
                        }

                    }
                    else if (target != self.$ulElem.get(0) && target.parentNode != self.$ulElem.get(0) && self.$ulElem.css(visibility) === "visible") {
                        $currentUl.css(visibility, "hidden");
                        stopDefault(e);
                    }

                }
            });
        });

        $(document).unbind("keydown", fnHandKeyDown).bind("keydown", fnHandKeyDown);

    };


})(jQuery, window, document);