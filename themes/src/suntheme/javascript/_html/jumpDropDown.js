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

webui.@THEME_JS@._dojo.provide("webui.@THEME_JS@._html.jumpDropDown");

webui.@THEME_JS@._dojo.require("webui.@THEME_JS@.widget.common");

/**
 * @class This class contains functions for jumpDropDown components.
 * @static
 *
 * @deprecated See webui.@THEME_JS@.widget.dropDown
 * @private
 */
webui.@THEME_JS@._html.jumpDropDown = {
    /**
     * This function is invoked by the jumpdropdown onchange action to set the
     * form action and then submit the form.
     *
     * Page authors should invoke this function if they set the selection using 
     * JavaScript.
     *
     * @param {String} elementId The component id of the JSF component (this id is
     * rendered in the div tag enclosing the HTML elements that make up
     * the list).
     * @return {boolean} true if successful; otherwise, false.
     * @deprecated Use document.getElementById(elementId).changed()
     */
    changed: function(elementId) {
        var widget = webui.@THEME_JS@.widget.common.getWidget(elementId);
        if (widget) {
            return widget.changed();
        }
        return false;
    }
};

// Extend for backward compatibility with JSF based components.
webui.@THEME_JS@.jumpDropDown = webui.@THEME_JS@._html.jumpDropDown;
