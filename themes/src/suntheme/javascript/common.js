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

webui.@THEME@.dojo.provide("webui.@THEME@.common");

webui.@THEME@.dojo.require("webui.@THEME@.theme.common");

/**
 * @class This class contains functions common to HTML elements.
 * @static
 */
webui.@THEME@.common = {
    /**
     * Variables needed when submitting form so timeout will work properly.
     * @private
     */
    _formToSubmit: null,
    _submissionComponentId: null,

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // String functions
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    /**
     * Replace occurences of delimiter with the escapeChar and the
     * delimiter. For example replace "," with "/," if delimiter == "," and
     * escapeChar is "/".
     *
     * @param {String} s The string to escape.
     * @param {String} delimiter The character to replace.
     * @param {String} escapeChar The character used for the escape.
     * @return {String} The escaped string.
     */
    escapeString: function(s, delimiter, escapeChar) {
        if (s == null) {
            return null;
        }
        if (delimiter == null) {
            return s;
        }
        if (escapeChar == null) {
            return null;
        }
        
        // Escape occurrences of delimiter with 
        // escapeChar and the delimiter.
        //
        // First escape the escape char.
        //
        var escape_escapeChar = escapeChar;
        if (escapeChar == "\\") {
            escape_escapeChar = escapeChar + escapeChar;
        }
        
        var rx = new RegExp(escape_escapeChar, "g");
        var s1 = s.replace(rx, escapeChar + escapeChar);
        
        rx = new RegExp(delimiter, "g");
        return s1.replace(rx, escapeChar + delimiter);
    },
    
    /**
     * Replace occurences of a sequence of 2 instances of delimiter 
     * with 1 instance of the delimiter. For example replace ",," with "," if delimiter == ","
     *
     * @param {String} s The string to escape.
     * @param {String} delimiter The character to replace.
     * @param {String} escapeChar The character used for the escape.
     * @return {String} The unescaped string.
     */
    unescapeString: function(s, delimiter, escapeChar) {
        if (s == null) {
            return null;
        }
        if (delimiter == null) {
            return s;
        }
        if (escapeChar == null) {
            return null;
        }
        
        // UnEscape occurrences of delimiter with 
        // single instance of the delimiter
        //
        var escape_escapeChar = escapeChar;
        if (escapeChar == "\\") {
            escape_escapeChar = escapeChar + escapeChar;
        }
        
        // First unescape the escape char.
        //
        var rx = new RegExp(escape_escapeChar + escape_escapeChar, "g");
        var s1 = s.replace(rx, escapeChar);
        
        // Now replace escaped delimters
        //
        rx = new RegExp(escape_escapeChar + delimiter, "g");
        return s1.replace(rx, delimiter);
    },
    
    /**
     * Return an array of unescaped strings from escapedString
     * where the escaped character is delimiter.
     * If delimiter is "," escapedString might have the form
     * <p><pre>
     * XX\,XX,MM\,MM
     *
     * where "\" is the escape char.
     * 
     * and is returned as an array
     * array[0] == "XX,XX"
     * array[1] == "MM,MM"
     * </pre><p>
     *
     * @param {String} escapedString The string to escape.
     * @param {String} delimiter The character to replace.
     * @param {String} escapeChar The character used for the escape.
     * @return {Array} An array of unescaped strings.
     */
    unescapeStrings: function(escapedString, delimiter, escapeChar) {
        if (escapedString == null || escapedString == "") {
            return null;
        }
        if (delimiter == null || delimiter == "") {
            return escapedString;
        }
        if (escapeChar == null || escapeChar == "") {
            return null;
        }
        
        // Need to do this character by character.
        var selections = new Array();
        var index = 0;
        var escseen = 0;
        var j = 0;
        
        for (var i = 0; i < escapedString.length; ++i) {
            if (escapedString.charAt(i) == delimiter) {
                if (escseen % 2 == 0) {
                    selections[index++] = escapedString.slice(j, i);
                    j = i + 1;
                }
            }
            if (escapedString.charAt(i) == escapeChar) {
                ++escseen;
                continue;
            } else {
                escseen = 0;
            }
        }
        
        // Capture the last split.
        selections[index] = escapedString.slice(j);
        
        // Now unescape each selection
        var unescapedArray = new Array();
        
        // Now replace escaped delimiters
        // i.e.  "\," with ","
        for (i = 0; i < selections.length; ++i) {
            unescapedArray[i] = webui.@THEME@.common.unescapeString(
            selections[i], delimiter, escapeChar);
        }
        return unescapedArray;
    },
    
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Style functions
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    /**
     * Use this function add any styleClass to an html tag
     *
     * @param {Node} element the dom html tag element
     * @param {String} styleClass the name of the class to add
     * @return {boolean} true if successful; otherwise, false.
     */
    addStyleClass: function(element, styleClass) {
        // routine protection in javascript
        if (element == null || styleClass == null) {
            return false;
        }
        
        // handle easy case first
        if (element.className == null) {
            element.className = styleClass;
            return true;
        }
        
        // break out style classes into an array  
        var classes = webui.@THEME@.common.splitStyleClasses(element);
        if (classes == null) {
            return false;
        }
        
        // For each styleClass, check if it's hidden and remove otherwise write 
        // it back out to the class
        for (var i = 0; i < classes.length; i++) {
            if (classes[i] != null && classes[i] == styleClass) {
                return true;
            }
        }
        element.className = element.className + " " + styleClass;
        return true;
    },
    
    /**
     * Use this function to check if an array has a style class
     *
     * @param {Array} styleArray of style classes to check
     * @param {String} styleClass the styleClass to check
     * @return {Array} An array of classes.
     */
    checkStyleClasses: function(styleArray, styleClass) {
        if (styleArray == null || styleClass == null) {
            return false;
        }
        for (var i = 0; i < styleArray.length; i++) {
            if (styleArray[i] != null && styleArray[i] == styleClass) {
                return true;
            }
        }   
        return false;
    },
    
    /**
     * Use this function to get array of style classes
     *
     * @param {Node} element the dom html tag element
     * @return {Array} An array of classes.
     */
    splitStyleClasses: function(element) {
        if (element != null && element.className != null) {
            return element.className.split(" ");
        } else {
            return null;
        }
    },
    
    /**
     * Use this function remove any styleClass for an html tag
     *
     * @param {Node} element the dom html tag element
     * @param {String} styleClass the name of the class to remove
     * @return {boolean} true if successful; otherwise, false.
     */
    stripStyleClass: function(element, styleClass) {
        // routine protection in javascript
        if (element == null || styleClass == null || element.className == null) {
            return false;
        }
        
        // break out style classes into an array  
        var classes = webui.@THEME@.common.splitStyleClasses(element);
        if (classes == null) {
            return false;
        }
        
        // For each styleClass, check if it's hidden and remove otherwise write
        // it back out to the class
        for (var i = 0; i < classes.length; i++) {
            if (classes[i] != null && classes[i] == styleClass) {
                classes.splice(i,1);  	
            }
        }
        element.className = classes.join(" ");
        return true;
    },
    
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Submit functions
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    /**
     * Use this function to insert a hidden field element in the page.
     *
     * @param {String} elementId The element ID of the html tag 
     * @param {String} elementValue The value of the html tag.
     * @param {Node} parentForm The parent form of the html tag.
     * @return {boolean} true if successful; otherwise, false.
     */
    insertHiddenField: function(elementId, elementValue, parentForm) {
        // We have to assume that there is only one element
        // with elementId. document.getElementById, returns
        // the first one it finds, which appears to be the 
        // first one created dynamically, if more than one 
        // element is created dynamically with the same id.
        //
        // appendChild just appends even if there is an element
        // with the same id that exists.
        //
        // The assumption is that there should only be 
        // one element in the document with such an id.
        //
        // If the elementId exists just modifiy its value
        // instead of creating and appending.
        //
        var element = document.getElementById(elementId);
        if (element != null) {
            element.value = elementValue;
            return true;
        }
        
        var newElement = document.createElement('input');
        newElement.type = 'hidden';
        newElement.id = elementId;
        newElement.value = elementValue;
        newElement.name = elementId;
        parentForm.appendChild(newElement);

        return true;
    },
    
    /**
     * Use this function to submit a virtual form.
     *
     * @return {boolean} true if successful; otherwise, false.
     * @private
     */
    submitForm: function() {
        // "formToSubmit" is a literal (not virtual) form.
        // "submissionComponentId" is a component id (not client id).
        // the virtual form implementation uses _submissionComponentId
        // to determine which virtual form (if any) was submitted.
        if (webui.@THEME@.common._formToSubmit == null) {
            return false;
        }
        if (webui.@THEME@.common._submissionComponentId != null &&
                webui.@THEME@.common._submissionComponentId.length > 0) {
            webui.@THEME@.common.insertHiddenField('_submissionComponentId', 
                webui.@THEME@.common._submissionComponentId,
                webui.@THEME@.common._formToSubmit);
        }
        webui.@THEME@.common._formToSubmit.submit();
        return false;
    },
    
    /**
     * Helper function to submit a virtual form.
     *
     * @param {Node} form The HTML form element to submit.
     * @param {String} submissionComponentId The Id of the component submitting the form.
     * @return {boolean} true if successful; otherwise, false.
     * @private
     */
    timeoutSubmitForm: function(form, submissionComponentId) {
        webui.@THEME@.common._formToSubmit = form;
        webui.@THEME@.common._submissionComponentId = submissionComponentId;
        setTimeout('webui.@THEME@.common.submitForm()', 0);
        return true;
    },
    
    /**
     * Helper function to submit a virtual form.
     *
     * @param {Node} form The HTML form element to submit.
     * @param {String} submissionComponentId The Id of the component submitting the form.
     * @return {boolean} true if successful; otherwise, false.
     * @private
     */
    leaveSubmitterTrace: function(form, submissionComponentId) {
        // This function only needs to be called in the onclick handler of 
        // an ActionSource component that appears within a -standard- table.
        // Under those circumstances, if this function is not called, then when
        // the component is clicked, the virtual form implementation will have 
        // no way of knowing that a virtual form was submitted.
        if (form != null && submissionComponentId != null && 
                submissionComponentId.length > 0) {
            webui.@THEME@.common.insertHiddenField('_submissionComponentId',
            submissionComponentId, form);
        }
        return true;
    },
    
    /**
     * delete a previously created element by createSubmittableArray.
     *
     * @param {String} name The element ID of the html tag 
     * @param {Node} form The HTML form element to submit.
     * @return {boolean} true if successful; otherwise, false.
     * @private
     */
    deleteSubmittableArray: function(name, parentForm) {
        try {
            var submittableArray  = document.getElementById(name);
            if (submittableArray != null) {
                parentForm.removeChild(submittableArray);
            }
        } catch (e) {}
        return true;
    },
    
    /**
     * This method creates a hidden "select" element with id 
     * and name attributes set name, values taken from the values
     * array argument, and display labels from the labels array.
     * It adds the element to the parentForm argument.
     * <p>
     * The pupose of this method is to create an array of values
     * that can be decoded using "name" as the key from a FacesContext
     * external context's "getRequestParameterValuesMap" as an
     * array of Strings. This reduces the need of rendering hidden input
     * field and delimiting several strings so that a multiple selection
     * can be returned.
     * </p><p>
     * The labels array provides an additional piece of data
     * for use on the client, but it is not contained in the submit.
     * All values added to the select are selected so that the
     * values will be submitted.
     * </p>
     *
     * @param {String} name The element ID of the html tag 
     * @param {Node} form The HTML form element to submit.
     * @param {Array} labels
     * @param {Array} values
     * @return {Node} The newly created select element.
     * @private
     */
    createSubmittableArray: function(name, parentForm, labels, values) {
        // An attempt is made to remove a possibly previously created element
        // by this name. It always deletes an element of name from parentForm.
        webui.@THEME@.common.deleteSubmittableArray(name, parentForm);
        
        if (values == null || values.length <= 0) {
            return;
        }
        
        var selections = document.createElement('select');
        selections.className = webui.@THEME@.theme.common.getClassName("HIDDEN");
        selections.name = name;
        selections.id = name;
        selections.multiple = true;
        
        // Start from the end of the array because
        // add puts things in at the head.
        //
        for (var i = 0; i < values.length; ++i) {
            var opt = document.createElement('option');
            opt.value = values[i];
            if (labels != null) {
                opt.label = labels[i];
            }
            opt.defaultSelected = true;
            selections.add(opt, null);
        }
        parentForm.appendChild(selections);
        return selections;
    },
    
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Visible functions
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    /**
     * Use this function to test if the specified element is visible (i.e., it
     * does not contain the hidden className).
     *
     * @param {String} elementId The element ID of the html tag 
     * @return {boolean} true if visible; otherwise, false
     */
    isVisible: function(elementId) {
        if (elementId == null) {
            return false;
        }
        // Get element.
        var element = document.getElementById(elementId);
        return webui.@THEME@.common.isVisibleElement(element);
    },
    
    /**
     * Use this function to test if the given element is visible (i.e., it
     * does not contain the hidden className).
     *
     * @param {Node} element The HTML element
     * @return {boolean} true if visible; otherwise, false
     */
    isVisibleElement: function(element) {
        if (element == null) {
            return false;
        }
        // Test for the hidden style class.
        var styleClasses = webui.@THEME@.common.splitStyleClasses(element); 
        return !webui.@THEME@.common.checkStyleClasses(styleClasses,
            webui.@THEME@.theme.common.getClassName("HIDDEN"));
    },
    
    /**
     * Use this function to show or hide any html element in the page
     *
     * @param {String} elementId The element ID of the html tag 
     * @param {boolean} visible true to make the element visible, false to hide the element
     * @return {boolean} true if successful; otherwise, false.
     */
    setVisible: function(elementId, visible) {
        if (elementId == null || visible == null ) {
            return false;
        }
        // Get element.
        var element = document.getElementById(elementId);
        return webui.@THEME@.common.setVisibleElement(element, visible);
    },
    
    /**
     * Use this function to show or hide any html element in the page
     *
     * @param {Node} element The HTML element
     * @param {boolean} visible true to make the element visible, false to hide the element
     * @return {boolean} true if successful; otherwise, false.
     */
    setVisibleElement: function(element, visible) {
        if (element == null || visible == null) {
            return false;
        }
        if (visible) {
            return webui.@THEME@.common.stripStyleClass(element,
                webui.@THEME@.theme.common.getClassName("HIDDEN"));
        } else {
            return webui.@THEME@.common.addStyleClass(element,
                webui.@THEME@.theme.common.getClassName("HIDDEN"));
        }
    }
}
