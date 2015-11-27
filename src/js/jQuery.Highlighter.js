/**
 * Highlighter.js
 *
 * @fileoverview  jQuery plugin that highlights key words.
 * @link          
 * @author        Bing Cheng (chengbing@eastmoney.com)
 * @version       1.0.0
 * @requires      jQuery 1.7+
 *
 * @license jQuery Highlighter Plugin v1.0.0
 * 
 * Copyright 2015 Bing Cheng (chengbing@eastmoney.com)
 * 
 * 
 */

// Format string
;if (typeof String.prototype.format !== 'function') {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/\{(\d+)\}/g,
            function (m, i) {
                return args[i];
            });
    };
};

// Enumeration of html element
if (typeof Node == "undefined") {
    var Node = {
        ELEMENT_NODE: 1,
        ATTRIBUTE_NODE: 2,
        TEXT_NODE: 3,
        CDATA_SECTION_NODE: 4,
        ENTITY_REFERENCE_NODE: 5,
        ENTITY_NODE: 6,
        PROCESSING_INSTRUCTION_NODE: 7,
        COMMENT_NODE: 8,
        DOCUMENT_NODE: 9,
        DOCUMENT_TYPE_NODE: 10,
        DOCUMENT_FRAGEMENT_NODE: 11,
        NOTATION_NODE: 12
    }
}

; (function ($, window, document, undefined) {

    // default colors for hight-lighting key words
    var _defaultColors = ['#ffff00,#000000', '#dae9d1,#000000', '#eabcf4,#000000',
        '#c8e5ef,#000000', '#f3e3cb, #000000', '#e7cfe0,#000000',
        '#c5d1f1,#000000', '#deeee4, #000000', '#b55ed2,#000000',
        '#dcb7a0,#333333', '#7983ab,#000000', '#6894b5, #000000'];



    /**
    * High light keywords: constructor
    * @param {} colors array of colors, 
    * each element is 'fontColor,backgoundColor'
    */
    var Highlighter = function(colors) {
        this.colors = colors;
        this.colors = this.colors || _defaultColors;
    };

    /**
	* Hight light key-words
	* @param {} node    html element
	* @param {} keywords  key words， multiple key words split by space character
    * every keyword high light by one specified color  
	* 
	* usage：
	* var hl = new Highlighter();
	* hl.highlight(document.body, 'Hello world');
	*/
    Highlighter.prototype.highlight = function (node, keywords) {
        if (!keywords || !node || !node.nodeType || node.nodeType != Node.ELEMENT_NODE) {
            return;
        }

        keywords = this.parsewords(keywords);

        if (keywords == null) {
            return;
        }

        for (var index = 0; index < keywords.length; index++) {
            this.colorword(node, keywords[index]);
        }
    }

    /**
	* High light key word of every node specified 
	* @param {} node element
	* @param {} keyword struct of key word, include key-word、background color and forecolor
	*/
    Highlighter.prototype.colorword = function (node, keyword) {
        for (var i = 0; i < node.childNodes.length; i++) {
            var childNode = node.childNodes[i];

            if (childNode.nodeType == Node.TEXT_NODE) {
                //child node is #text
                var regex = new RegExp(keyword.word.replace('.', '\\.'), 'i');
                if (childNode.data.search(regex) == -1) {
                    continue;
                }
                regex = new RegExp('({0})'.format(keyword.word.replace('.', '\\.')), 'igm');

                var span4Hlighter = document.createElement('span'),
                    spanHtml = keyword.bgColor ? '<span style="background-color:{0};color:{1}" mce_style="background-color:{2};color:{3}">$1</span>'.format(keyword.bgColor, keyword.foreColor, keyword.bgColor, keyword.foreColor)
                                : '<span style="color:{0}" mce_style="color:{1}">$1</span>'.format(keyword.foreColor, keyword.foreColor);

                span4Hlighter.innerHTML = childNode.data.replace(regex, spanHtml);
                node.replaceChild(span4Hlighter, childNode);
            }
            else if (childNode.nodeType == Node.ELEMENT_NODE) {
                //child node is element
                this.colorword(childNode, keyword);
            }
        }
    }

    /**
    * Convert key words that splited by space charater into array 
	* @param {} keywords
	* @return {}
	*/
    Highlighter.prototype.parsewords = function (keywords) {

        keywords = keywords.replace(/\s+/g, ' ');
        keywords = keywords.split(' ');
        if (keywords == null || keywords.length == 0) {
            return null;
        }
        var results = [];

        for (var index = 0; index < keywords.length; index++) {
            var keyword = {},
                color = this.colors[index % this.colors.length].split(',');
            keyword.word = keywords[index];
            keyword.foreColor = color[0];
            keyword.bgColor = color.length > 1 ? color[1] : null;
            results.push(keyword);
        }
        return results;
    }

    window.Highlighter = Highlighter;

})(jQuery, window, document);