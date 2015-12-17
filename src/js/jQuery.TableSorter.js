///
/// 格式化字符串（如果为定义该函数则定义该函数）
///
if (typeof String.prototype.format !== 'function') {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/\{(\d+)\}/g,
            function (m, i) {
                return args[i];
            });
    };
};

///
/// 判断字符串是否为数值类型
///
if (typeof String.prototype.isNumerical !== 'function') {
    String.prototype.isNumerical = function () {
        return /^(-)?\d+(\.\d+)?$/.test(this);
    }
};

; (function ($, window, document, undefined) {

    var CLASS4SORTED = {
        // 默认样式
        normalClass: 'arrowSort',
        // 升序样式
        ascClass: 'arrowSort arrowSort-up',
        // 降序样式
        descClass: 'arrowSort arrowSort-down'
    };

    function getFunction(sourceObj, methodName, params) {
        /// <summary>
        /// 获取指定对象中函数
        /// </summary>
        /// <param name="sourceObj">指定对象</param>
        /// <param name="methodName">函数名称</param>
        /// <param name="params">调用函数的参数</param>
        return function () {
            if (sourceObj && sourceObj[methodName]) {
                sourceObj[methodName](params);
            }
        }
    };

    function jQTableSorter(id, options) {
        id = (id.indexOf('#') !== 0) ? '#{0}'.format(id) : id;
        
        this.tableElem = $(id).get(0);
        if (!this.tableElem || !this.tableElem.rows || !this.tableElem.rows.length) {
            return;
        }
        
        var args = [];
        if (arguments.length > 1) {
            for (var index = 0; index < arguments.length; index++) {
                args.push(arguments[index]);
            }
        }

    }

    jQTableSorter.prototype.initialize = function (params) {
        this.sortRows = []; this.exceptedRows = []; this.headerCells = [];
        this.viewState = []; this.lastSortedElem = null;

        for (var index = 0, length = this.tableElem.rows.length; index < length; index++) {
            this.sortRows.push(this.this.tableElem.rows[index]);
        }

        this.headerCells = this.sortRows.shift().cells;

        for (var colIndex = 0; colIndex < (params.length ? params.length : this.headerCells.length) ; colIndex++) {
            var rowIndex = params.length ? params[colIndex] : colIndex;

            if (rowIndex >= this.headerCells.length) {
                continue;
            }
            this.viewState[rowIndex] = false;
            this.headerCells[rowIndex].style.cursor = "pointer";
            this.headerCells[rowIndex].onclick = getFunction(this, "sortTable", rowIndex);
        }
        
        this.afterSort

    };

    jQTableSorter.prototype.sortTable = function (column) {
        for (var index = 0; index < this.headerCells.length; index++) {
            $(this.headerCells[index]).find('span:eq(1)').attr('class', CLASS4SORTED.normalClass);
        }
        if (this.lastSortedElem) {
            this.lastSortedElem.className = CLASS4SORTED.normalClass;
        }

        var sortAsNum = true;

        for (var rowIndex = 0, length = this.sortRows.length; rowIndex < length && sortAsNum; rowIndex++) {
            var cell = this.sortRows[rowIndex].cells[column].innerHTML.replace(/,/g, '').replace(/%$/, '');
            sortAsNum = cell.isNumerical();
        }

        this.sortRows.sort(function (previous, current) {
            var result, preval = previous.cells[column].innerHTML, currentval = current.cells[column].innerHTML;
            if (preval == currentval) {
                return 0;
            }
            if (sortAsNum) {
                var prenum = parseFloat(preval.replace(/,/g, '').replace(/%$/, '')),
                    currentnum = parseFloat(currentval.replace(/,/g, '').replace(/%$/, ''));

                return prenum - currentnum;
            }
            else {
                return preval > currentval;
            }

        });

        if (this.viewState[column]) {
            this.sortRows.reverse(); this.viewState[column] = false;

            $(this.headerCells[column]).find("span:eq(1)").attr("class", CLASS4SORTED.descClass);
        }
        else {
            this.viewState[column] = true;

            $(this.headerCells[column]).find("span:eq(1)").attr("class", CLASS4SORTED.ascClass);
        }

        this.lastSortedElem = $(this.headerCells[column]).find("span:eq(1)");

        var frag = document.createDocumentFragment(), cloneRows = this.sortRows.slice();

        for (index = 0; index < this.exceptedRows.length; index++) {
            if (this.exceptedRows[index].rowIndex >= cloneRows.length) {
                cloneRows.push(this.exceptedRows[index].rowElem);
            }
            else {
                cloneRows.splice(index, 0, this.ExpRows[index]);
            }
        }
        for (index = 0; index < cloneRows.length; index++) {
            frag.appendChild(cloneRows[index]);
        }

        this.tableElem.tBodies[0].appendChild(frag);

        this.OnSorted(this.headerCells[column], this.viewState[column]);

        return this;

    };

    jQTableSorter.prototype.onSorted = function (cell, isAsc) {
        return this;
    };

    jQTableSorter.prototype.exceptRows = function () {
        var expIndex = [], self = this;

        for (var index = 0; index < arguments.length; index++) {

            expIndex.push(arguments[index] >= 0 ? arguments[index] : self.sortRows.length + arguments[index]);
        }
        expIndex.sort();

        var toSortedArray = [], expRows = [], initRows = self.sortRows || [];

        for (var index2 = 0; index2 < initRows.length; index2++) {
            for (var index3 = 0; index3 < expIndex.length; index3++) {
                if (expIndex[index3] == index2) {
                    self.exceptedRows.push({ rowIndex: index2, rowElem: initRows[index2] });
                    break;
                }
            }
            if (index3 >= expIndex.length) {
                toSortedArray.push(initRows[index2]);
            }
        }

        self.sortRows = toSortedArray;
        return self;
    };

    // Root jQTableSorter object
    var _jQTableSorter = $.fn.jQTableSorter;

    var jQTableSorterWrapper = function (params) {

        var firstid = this.id || this[0].id;

        return new jQTableSorter(firstid, params || {});

    };


    $.fn.extend(
	{
	    ///
	    /// 提供接口供外函数调用
	    ///
	    jQTableSorter: jQPaginationWrapper
	});

    ///
    /// Noconflict api for jQTableSorter plugin
    ///
    $.fn.jQTableSorter.noConflict = function (aliasName) {

        $.fn[aliasName] = jQTableSorterWrapper;
        $.fn.jQTableSorter = _jQTableSorter;

        return true;
    };

}(jQuery, window, document));
