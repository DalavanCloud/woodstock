/**
 * The contents of this file are subject to the terms
 * of the Common Development and Distribution License
 * (the License). You may not use this file except in
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

webui.@THEME_JS@._dojo.provide("webui.@THEME_JS@.widget._jsfx.popupMenu");

webui.@THEME_JS@._dojo.require("webui.@THEME_JS@.widget._jsfx.common");
webui.@THEME_JS@._dojo.require("webui.@THEME_JS@.widget._jsfx.dynaFaces");
webui.@THEME_JS@._dojo.require("webui.@THEME_JS@.widget.popupMenu");

/**
 * @class This class contains functions to obtain data asynchronously using JSF
 * Extensions as the underlying transfer protocol.
 * @static
 * @private
 */
webui.@THEME_JS@.widget._jsfx.popupMenu = {
    /**
     * This function is used to process submit events with Object literals. 
     * <p>
     * Note: Cannot use the _processSubmitEvent() function in the common.js file
     * as we need an extra attribute called value to be submitted for every request.
     * </p>
     *
     * @param props Key-Value pairs of properties.
     * @config {String} id The HTML element Id.
     * @config {String} endTopic The event topic to publish.
     * @config {String} execute The string containing a comma separated list 
     * of client ids against which the execute portion of the request 
     * processing lifecycle must be run.
     * @config {String} value The selected menu option value.
     * @return {boolean} true if successful; otherwise, false.
     * @private
     */
    _processSubmitEvent: function(props) {
        if (props == null) {
            return false;
        }

        // Dynamic Faces requires a DOM node as the source property.
        var domNode = document.getElementById(props.id);

        // Generate AJAX request using the JSF Extensions library.
        DynaFaces.fireAjaxTransaction(
            (domNode) ? domNode : document.forms[0], {
            execute: (props.execute) ? props.execute : props.id,
            render: props.id,
            replaceElement: webui.@THEME_JS@.widget._jsfx.common._submitCallback,
            xjson: {
                id: props.id,
                endTopic: props.endTopic,
                value: props.value,
                event: "submit"
            }
        });
        return true;
    }
};

// Listen for Dojo Widget events.
webui.@THEME_JS@._dojo.subscribe(webui.@THEME_JS@.widget.popupMenu.event.refresh.beginTopic,
    webui.@THEME_JS@.widget._jsfx.common, "_processRefreshEvent");
webui.@THEME_JS@._dojo.subscribe(webui.@THEME_JS@.widget.popupMenu.event.submit.beginTopic,
    webui.@THEME_JS@.widget._jsfx.popupMenu, "_processSubmitEvent");
