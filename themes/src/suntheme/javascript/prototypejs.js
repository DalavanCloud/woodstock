/**
 * The contents of this file are subject to the terms
 * of the Common Development and Distribution License
 * (the License).  You may not use this file except in
 * compliance with the License.
 * 
 * You can obtain a copy of the license at
 * https://woodstock.dev.java.net/public/CDDLv1.0.html.
 * See the License for the specific language governing
 * permissions and limitations under the License.
 * 
 * When distributing Covered Code, include this CDDL
 * Header Notice in each file and include the License file
 * at https://woodstock.dev.java.net/public/CDDLv1.0.html.
 * If applicable, add the following below the CDDL Header,
 * with the fields enclosed by brackets [] replaced by
 * you own identifying information:
 * "Portions Copyrighted [year] [name of copyright owner]"
 * 
 * Copyright 2008 Sun Microsystems, Inc. All rights reserved.
 */

webui.@THEME_JS@.dojo.provide("webui.@THEME_JS@.prototypejs");

//
// Prototype JavaScript framework, based on version 1.5.0_rc1 
// (c) 2005 Sam Stephenson <sam@conio.net> 
// 
//  Prototype is freely distributable under the terms of an MIT-style license. 
//  For details, see the Prototype web site: http://prototype.conio.net/ 
//

/**
 * @class This class contains functions from the Prototype JavaScript framework.
 * @name webui.@THEME_JS@.prototypejs
 * @static
 */

/**
 * @scope webui.@THEME_JS@.prototypejs
 */
webui.@THEME_JS@.prototypejs = {
    /** 
     * A RegExp pattern used to match scrip tags.
     * @private
     */
    _scriptFragment: '(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)',

    /**
     * This function is used to escape HTML in given string.
     *
     * @param {String} str The string to escape.
     * @return {boolean} The HTML escaped string.
     */
    escapeHTML: function(str) {
        var div = document.createElement('div');
        var text = document.createTextNode(str);
        div.appendChild(text);
        return div.innerHTML;
    },

    /**
     * This function is used to eval scripts from the given string.
     *
     * @param {String} str The string to extract script from.
     * @return {Object|boolean} The result of the evaluated script.
     */
    evalScripts: function(str) {
        var prototypejs = webui.@THEME_JS@.prototypejs;
        return prototypejs.map(prototypejs.extractScripts(str), function(script) { 
            return eval(script);
        });
    },

    /**
     * This function is used to extend the given object with Key-Value pairs of
     * properties. 
     * <p>
     * Note: If recursive is true, and the property is an object containing 
     * Key-Value pairs itself, this function is called recursively to preserve 
     * data which is not explicitly extended. If only top level properties must
     * be replaced, recursive may be null.
     * </p>
     *
     * @param {Object} obj The object to extend.
     * @param {Object} props Key-Value pairs of properties.
     * @param {Object} recursive If true, properties are extended recursively (default).
     * @return {boolean} true if successful; otherwise, false.
     */
    extend: function(obj, props, recursive) {
        if (obj == null || props == null) {
            return false;
        }      

        // If recursive is true and property is an non-null object, call this
        // function again.
        var prototypejs = webui.@THEME_JS@.prototypejs;
        for (var property in props) {
            if (obj[property] && typeof obj[property] == "object" 
                    && recursive != false) {
                prototypejs.extend(obj[property], props[property], recursive);
            } else {
                obj[property] = props[property];
            }
        }
        return true;
    },

    /**
     * This function is used to extract scripts from the given string.
     *
     * @param {String} str The string to extract script from.
     * @return {Object} The string containing only script.
     */
    extractScripts: function(str) {
        var prototypejs = webui.@THEME_JS@.prototypejs;
        var matchAll = new RegExp(prototypejs._scriptFragment, 'img');
        var matchOne = new RegExp(prototypejs._scriptFragment, 'im');

        return prototypejs.map(str.match(matchAll) || [], function(scriptTag) {
            return (scriptTag.match(matchOne) || ['', ''])[1];
        });
    },

    /**
     * Map functions on the given array.
     * <p>
     * Note: The Array.map function is not supported on IE 7 and Mozilla 1.7. 
     * The following function is a slight variation of the algorithm found at:
     * developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:map
     * </p>
     * @param {Array} array The array to map function on.
     * @param {Function} The function used to map array.
     */
    map: function(array, func) {
        var len = array.length;
        if (typeof func != "function") {
            throw new TypeError();
        }

        var result = new Array(len);
        var args = arguments[2];
        for (var i = 0; i < len; i++) {
            if (i in array) {
                result[i] = func.call(args, array[i], i, array);
            }
        }
        return result;
    },

    /**
     * This function is used to strip script tags from the given string.
     *
     * @param {String} str The string to strip tags from.
     * @return {Object} The string minus any script tags.
     */
    stripScripts: function(str) {
        return str.replace(new RegExp(webui.@THEME_JS@.prototypejs._scriptFragment, 'img'), ''); 
    },

    /**
     * This function is used to strip HTML tags from the given string.
     *
     * @param {String} str The string to strip tags from.
     * @return {Object} The string minus any HTML tags.
     */
    stripTags: function(str) {
        return str.replace(/<\/?[^>]+>/gi, '');
    },

    /**
     * This function is used to unescape HTML in given string.
     *
     * @param {String} str The string to unescape.
     * @return {boolean} The unescaped string.
     */
    unescapeHTML: function(str) {
        var div = document.createElement('div');
        div.innerHTML = webui.@THEME_JS@.prototypejs.stripTags(str);
        return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
    }
};
