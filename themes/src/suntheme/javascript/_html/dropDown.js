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

webui.@THEME_JS@._dojo.provide("webui.@THEME_JS@._html.dropDown");

webui.@THEME_JS@._dojo.require("webui.@THEME_JS@.widget.common");

/**
 * @class This class contains functions for dropDown components.
 * @static
 * 
 * @deprecated See webui.@THEME_JS@.widget.dropDown
 * @private
 */
webui.@THEME_JS@._html.dropDown = {
    /**
     * This function is invoked by the choice onselect action to set the
     * selected, and disabled styles.
     *
     * Page authors should invoke this function if they set the 
     * selection using JavaScript.
     *
     * @param {String} elementId The component id of the JSF component (this id is
     * rendered in the div tag enclosing the HTML elements that make up
     * the list).
     * @return {boolean} true if successful; otherwise, false.
     * @deprecated
     */
    changed: function(elementId) {         
        var widget = webui.@THEME_JS@.widget.common.getWidget(elementId);
        if (widget) {
            return widget._changed();
        }
        return false;
    },

    /**
     * Use this function to access the HTML select element that makes up
     * the dropDown.
     *
     * @param {String} elementId The component id of the JSF component (this id is
     * assigned to the span tag enclosing the HTML elements that make up
     * the dropDown).
     * @return {Node} a reference to the select element. 
     * @deprecated Use document.getElementById(elementId).setSelectElement()
     */
    getSelectElement: function(elementId) { 
        var widget = webui.@THEME_JS@.widget.common.getWidget(elementId);
        if (widget) {
            return widget.getSelectElement();
        }
        return null;
    },

    /**
     * Invoke this JavaScript function to get the label of the first
     * selected option on the dropDown. If no option is selected, this
     * function returns null.
     * 
     * @param {String} elementId The component id of the JSF component (this id is
     * rendered in the div tag enclosing the HTML elements that make up
     * the list).
     * @return {String} The label of the selected option, or null if none is
     * selected. 
     * @deprecated Use document.getElementById(elementId).getSelectedLabel();
     */
    getSelectedLabel: function(elementId) { 
        var widget = webui.@THEME_JS@.widget.common.getWidget(elementId);
        if (widget) {
            return widget.getSelectedLabel();
        }
        return null;
    },

    /**
     * Invoke this JavaScript function to get the value of the first
     * selected option on the dropDown. If no option is selected, this
     * function returns null. 
     *
     * @param {String} elementId The component id of the JSF component (this id is
     * rendered in the div tag enclosing the HTML elements that make up
     * the list).
     * @return {String} The value of the selected option, or null if none is
     * selected. 
     * @deprecated Use document.getElementById(elementId).getSelectedValue();
     */
    getSelectedValue: function(elementId) { 
        var widget = webui.@THEME_JS@.widget.common.getWidget(elementId);
        if (widget) {
            return widget.getSelectedValue();
        }
        return null;
    },

    /**
     * Set the disabled state for given dropdown element Id. If the disabled 
     * state is set to true, the element is shown with disabled styles.
     *
     * Page authors should invoke this function if they dynamically
     * enable or disable a dropdown using JavaScript.
     * 
     * @param {String} elementId The component id of the JSF component (this id is
     * rendered in the div tag enclosing the HTML elements that make up
     * the list).
     * @param {boolean} disabled true or false
     * @return {boolean} true if successful; otherwise, false.
     * @deprecated Use document.getElementById(elementId).setProps({disabled: boolean});
     */
    setDisabled: function(elementId, disabled) { 
        var widget = webui.@THEME_JS@.widget.common.getWidget(elementId);
        if (widget) {
            return widget.setProps({ disabled: disabled});
        }
        return null;
    }
};

// Extend for backward compatibility.
webui.@THEME_JS@.dropDown = webui.@THEME_JS@._html.dropDown;
