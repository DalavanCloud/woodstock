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

@JS_NS@._dojo.provide("@JS_NS@.widget._xhr.rating");

@JS_NS@._dojo.require("@JS_NS@.json");
@JS_NS@._dojo.require("@JS_NS@.xhr");
@JS_NS@._dojo.require("@JS_NS@.widget.common");
@JS_NS@._dojo.require("@JS_NS@.widget._xhr.common");
@JS_NS@._dojo.require("@JS_NS@.widget.rating");

/**
 * @class This class contains functions to obtain data asynchronously using JSF
 * Extensions as the underlying transfer protocol.
 * @static
 * @private
 */
@JS_NS@.widget._xhr.rating = {
    /**
     * This function is used to process submit events with Object literals. 
     * <p>
     * Note: Cannot use the _processSubmitEvent() function in the common.js file
     * as we need to override "replaceElement" with a callback functiont o receive
     * the response.
     * </p>
     *
     * @param props Key-Value pairs of properties.
     * @config {String} id The HTML element Id.
     * @config {String} endTopic The event topic to publish.
     * @config {String} execute The string containing a comma separated list 
     * of client ids against which the execute portion of the request 
     * processing lifecycle must be run.
     * @return {boolean} true if successful; otherwise, false.
     * @private
     */
    _processSubmitEvent: function(props) {
        if (props == null) {
            return false;
        }

        // Ensure URL has been provided.
        if (@JS_NS@._base.config.ajax.url == null) {
            console.error("URL for Ajax transaction not provided.");
            return false
        }

        // Get form.
        var form = @JS_NS@.widget.common._getForm(
            document.getElementById(props.id));
        if (form == null) {
            form = document.forms[0];
        }

        // Pass through variables.
        var _id = props.id;
        var closure = {
            endTopic: props.endTopic
        };
        var xjson = {
            id: props.id,
            event: "submit",
            execute: (props.execute) ? props.execute : "none"
        };

        // Generate AJAX request.
        @JS_NS@.xhr.get({
            error: function(content, ioArgs) {
                console.error("HTTP status code: ", ioArgs.xhr.status);
                return content;
            },
            form: form,
            headers: {
                "X-JSON": @JS_NS@.json.stringify(xjson)
            },
            load: function(content, ioArgs) {
                @JS_NS@.widget._xhr.rating._submitCallback(_id, content, closure, xjson);
                return content;
            },
            timeout: 5000, // Time in milliseconds
            url: @JS_NS@._base.config.ajax.url
        });
        return true;
    },

    /**
     * This function is a callback to respond to the end of submit request.
     *
     * @param {String} id The HTML widget Id.
     * @param {String} content The content returned by the AJAX response.
     * @param {Object} closure The closure argument provided to the Ajax transaction.
     * @param {Object} xjson The xjson header provided to the Ajax transaction.
     * @return {boolean} true if successful; otherwise, false.
     * @private
     */
    _submitCallback: function(id, content, closure, xjson) {
        if (id == null || content == null) {
            return false;
        }

        // Parse JSON text.
        var props = @JS_NS@.json.parse(content);

        // Update rating widget
        var widget = @JS_NS@.widget.common.getWidget(id);
        widget.setProps(props);
            
        // Publish an event for custom AJAX implementations to listen for.
        if (closure.endTopic) {
            @JS_NS@._dojo.publish(closure.endTopic, [props]);
        }
        return true;
    }
}

// Listen for Widget events.
@JS_NS@._dojo.subscribe(@JS_NS@.widget.rating.event.refresh.beginTopic,
    @JS_NS@.widget._xhr.common, "_processRefreshEvent");
@JS_NS@._dojo.subscribe(@JS_NS@.widget.rating.event.submit.beginTopic,
    @JS_NS@.widget._xhr.rating, "_processSubmitEvent");
