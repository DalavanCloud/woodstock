//
// The contents of this file are subject to the terms
// of the Common Development and Distribution License
// (the License).  You may not use this file except in
// compliance with the License.
// 
// You can obtain a copy of the license at
// https://woodstock.dev.java.net/public/CDDLv1.0.html.
// See the License for the specific language governing
// permissions and limitations under the License.
// 
// When distributing Covered Code, include this CDDL
// Header Notice in each file and include the License file
// at https://woodstock.dev.java.net/public/CDDLv1.0.html.
// If applicable, add the following below the CDDL Header,
// with the fields enclosed by brackets [] replaced by
// you own identifying information:
// "Portions Copyrighted [year] [name of copyright owner]"
// 
// Copyright 2007 Sun Microsystems, Inc. All rights reserved.
//

dojo.provide("webui.@THEME@.widget.dropDown");

dojo.require("dojo.widget.*");
dojo.require("webui.@THEME@.widget.*");
dojo.require("webui.@THEME@.widget.listbox");

/**
 * This function is used to generate a template based widget.
 *
 * Note: This is considered a private API, do not use.
 */
webui.@THEME@.widget.dropDown = function() {
    // Register widget.
    dojo.widget.HtmlWidget.call(this);
}

/**
 * Helper function called by onChange event to set the proper
 * selected, and disabled styles.
 */
webui.@THEME@.widget.dropDown.changed = function() {
    if (this.submitForm != true) {
        // Drop down changed.
        return webui.@THEME@.widget.dropDown.superclass.changed.call(this);
    } else {
        // Jump drop down changed.
        var jumpDropdown = this.listContainer; 

        // Find the <form> for this drop down
        var form = jumpDropdown; 
        while (form != null) { 
            form = form.parentNode; 
            if (form.tagName == "FORM") { 
                break;
            }
        }

        if (form != null) { 
            this.submitterHiddenNode.value = "true";

            // Set style classes.
            var options = jumpDropdown.options;
            for (var i = 0; i < options.length; i++) { 
                options[i].className = this.getOptionClassName(options[i]);
            }
            form.submit();
        }
    }
    return true; 
}

/**
 * This closure is used to process widget events.
 */
webui.@THEME@.widget.dropDown.event = {
    /**
     * This closure is used to process refresh events.
     */
    refresh: {
        /**
         * Event topics for custom AJAX implementations to listen for.
         */
        beginTopic: "webui_@THEME@_widget_dropDown_event_refresh_begin",
        endTopic: "webui_@THEME@_widget_dropDown_event_refresh_end"
    },

    /**
     * This closure is used to process state change events.
     */
    state: {
        /**
         * Event topics for custom AJAX implementations to listen for.
         */
        beginTopic: "webui_@THEME@_widget_dropDown_event_state_begin",
        endTopic: "webui_@THEME@_widget_dropDown_event_state_end"
    },

    /**
     * This closure is used to process submit events.
     */
    submit: {
        /**
         * Event topics for custom AJAX implementations to listen for.
         */
        beginTopic: "webui_@THEME@_widget_dropDown_event_submit_begin",
        endTopic: "webui_@THEME@_widget_dropDown_event_submit_end"
    }
}

/**
 * This function is used to fill in template properties.
 *
 * Note: This is called after the buildRendering() function. Anything to be set 
 * only once should be added here; otherwise, use the _setProps() function.
 *
 * @param props Key-Value pairs of properties.
 * @param frag HTML fragment.
 */
webui.@THEME@.widget.dropDown.fillInTemplate = function(props, frag) {
    webui.@THEME@.widget.dropDown.superclass.fillInTemplate.call(this, props, frag);

    // Set ids.
    if (this.id) {
        this.submitterHiddenNode.id = this.id + "_submitter";
    }
    return true;
}

/**
 * This function is used to get widget properties. Please see the 
 * _setProps() function for a list of supported properties.
 */
webui.@THEME@.widget.dropDown.getProps = function() {
    var props = webui.@THEME@.widget.dropDown.superclass.getProps.call(this);

    // Get properties.
    if (this.submitForm != null) { props.submitForm = this.submitForm; }

    return props;
}

/**
 * This function is used to initialize the widget.
 *
 * Note: This is called after the fillInTemplate() function.
 *
 * @param props Key-Value pairs of properties.
 * @param frag HTML fragment.
 * @param parent The parent of this widget.
 */
webui.@THEME@.widget.dropDown.initialize = function (props, frag, parent) {
    webui.@THEME@.widget.dropDown.superclass.initialize.call(this, props, frag, parent);

    // Set style classes
    if (this.submitForm) {
        if (new Boolean(this.submitForm).valueOf() == true) {
            this.selectClassName = webui.@THEME@.widget.props.jumpDropDown.className;
            this.selectDisabledClassName = webui.@THEME@.widget.props.jumpDropDown.disabledClassName;
            this.optionClassName = webui.@THEME@.widget.props.jumpDropDown.optionClassName;
            this.optionSeparatorClassName = webui.@THEME@.widget.props.jumpDropDown.optionSeparatorClassName;
            this.optionGroupClassName = webui.@THEME@.widget.props.jumpDropDown.optionGroupClassName;
            this.optionDisabledClassName = webui.@THEME@.widget.props.jumpDropDown.optionDisabledClassName;
            this.optionSelectedClassName = webui.@THEME@.widget.props.jumpDropDown.optionSelectedClassName;
        } else {
            this.selectClassName = webui.@THEME@.widget.props.dropDown.className;
            this.selectDisabledClassName = webui.@THEME@.widget.props.dropDown.disabledClassName;
            this.optionClassName = webui.@THEME@.widget.props.dropDown.optionClassName;
            this.optionSeparatorClassName = webui.@THEME@.widget.props.dropDown.optionSeparatorClassName;
            this.optionGroupClassName = webui.@THEME@.widget.props.dropDown.optionGroupClassName;
            this.optionDisabledClassName = webui.@THEME@.widget.props.dropDown.optionDisabledClassName;
            this.optionSelectedClassName = webui.@THEME@.widget.props.dropDown.optionSelectedClassName;
        }
    }
    return true;
}

/**
 * This function is used to set widget properties with the following 
 * Object literals.
 *
 * <ul>
 *  <li>id</li>
 *  <li>dir</li>
 *  <li>disabled</li>
 *  <li>label</li>
 *  <li>lang</li>
 *  <li>multiple</li>
 *  <li>onBlur</li>
 *  <li>onChange</li>
 *  <li>onClick</li>
 *  <li>onDblClick</li>
 *  <li>onFocus</li>
 *  <li>onMouseDown</li>
 *  <li>onMouseOut</li>
 *  <li>onMouseOver</li>
 *  <li>onMouseUp</li>
 *  <li>onMouseMove</li>
 *  <li>onKeyPress</li>
 *  <li>onKeyUp</li>
 *  <li>onSelect</li>
 *  <li>options</li>
 *  <li>size</li>
 *  <li>style</li>
 *  <li>submitForm</li>
 *  <li>tabIndex</li>
 *  <li>title</li>
 *  <li>visible</li>
 * </ul>
 *
 * Note: This is considered a private API, do not use. This function should only
 * be invoked through postInitialize() and setProps(). Further, the widget shall
 * be updated only for the given key-value pairs.
 *
 * @param props Key-Value pairs of properties.
 */
webui.@THEME@.widget.dropDown._setProps = function(props) {
    if (props == null) {
        return false;
    }

    // Add attributes to the hidden input for jump drop down.
    if (props.submitForm != null && props.submitForm == true) {
        this.submitterHiddenNode.name = this.submitterHiddenNode.id;
        this.submitterHiddenNode.value = "false";
    }

    // Set remaining properties.
    return webui.@THEME@.widget.dropDown.superclass._setProps.call(this, props);
}

// Inherit base widget properties.
dojo.inherits(webui.@THEME@.widget.dropDown, webui.@THEME@.widget.listbox);

// Override base widget by assigning properties to class prototype.
dojo.lang.extend(webui.@THEME@.widget.dropDown, {
    // Set private functions.
    changed: webui.@THEME@.widget.dropDown.changed,
    fillInTemplate: webui.@THEME@.widget.dropDown.fillInTemplate,
    getProps: webui.@THEME@.widget.dropDown.getProps,
    initialize: webui.@THEME@.widget.dropDown.initialize,
    _setProps: webui.@THEME@.widget.dropDown._setProps,
    submit: webui.@THEME@.widget.widgetBase.event.submit.processEvent,

    // Set defaults.
    event: webui.@THEME@.widget.dropDown.event,
    submitForm: false,
    widgetType: "dropDown"
});