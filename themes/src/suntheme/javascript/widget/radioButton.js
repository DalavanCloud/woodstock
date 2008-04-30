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

@JS_NS@._dojo.provide("@JS_NS@.widget.radioButton");

@JS_NS@._dojo.require("@JS_NS@.widget._base.checkedBase");
@JS_NS@._dojo.require("@JS_NS@.widget._base.refreshBase");
@JS_NS@._dojo.require("@JS_NS@.widget._base.stateBase");
@JS_NS@._dojo.require("@JS_NS@.widget._base.submitBase");

/**
 * This function is used to construct a radioButton widget.
 *
 * @name @JS_NS@.widget.radioButton
 * @extends @JS_NS@.widget._base.checkedBase
 * @extends @JS_NS@.widget._base.refreshBase
 * @extends @JS_NS@.widget._base.stateBase
 * @extends @JS_NS@.widget._base.submitBase
 * @class This class contains functions for the radioButton widget.
 * @constructor
 * @param {Object} props Key-Value pairs of properties.
 * @config {String} alt Alternate text for image input.
 * @config {String} align Alignment of image input.
 * @config {boolean} checked 
 * @config {String} className CSS selector.
 * @config {String} dir Specifies the directionality of text.
 * @config {boolean} disabled Disable element.
 * @config {String} id Uniquely identifies an element within a document.
 * @config {Object} image 
 * @config {String} label 
 * @config {String} lang Specifies the language of attribute values and content.
 * @config {String} name 
 * @config {String} onBlur Element lost focus.
 * @config {String} onClick Mouse button is clicked on element.
 * @config {String} onDblClick Mouse button is double-clicked on element.
 * @config {String} onFocus Element received focus.
 * @config {String} onKeyDown Key is pressed down over element.
 * @config {String} onKeyPress Key is pressed and released over element.
 * @config {String} onKeyUp Key is released over element.
 * @config {String} onMouseDown Mouse button is pressed over element.
 * @config {String} onMouseOut Mouse is moved away from element.
 * @config {String} onMouseOver Mouse is moved onto element.
 * @config {String} onMouseUp Mouse button is released over element.
 * @config {String} onMouseMove Mouse is moved while over element.
 * @config {String} onSelect 
 * @config {boolean} readOnly 
 * @config {String} style Specify style rules inline.
 * @config {int} tabIndex Position in tabbing order.
 * @config {String} title Provides a title for element.
 * @config {String} value Value of input.
 * @config {boolean} visible Hide or show element.
 */
@JS_NS@._dojo.declare("@JS_NS@.widget.radioButton", [
        @JS_NS@.widget._base.checkedBase,
        @JS_NS@.widget._base.refreshBase, 
        @JS_NS@.widget._base.stateBase,
        @JS_NS@.widget._base.submitBase], {
    // Set defaults.
    _idSuffix: "_rb",
    _widgetType: "radioButton" // Required for theme properties.
});

/**
 * This object contains event topics.
 * <p>
 * Note: Event topics must be prototyped for inherited functions. However, these
 * topics must also be available statically so that developers may subscribe to
 * events.
 * </p>
 * @ignore
 */
@JS_NS@.widget.radioButton.event =
        @JS_NS@.widget.radioButton.prototype.event = {
    /**
     * This object contains refresh event topics.
     * @ignore
     */
    refresh: {
        /** Refresh event topic for custom AJAX implementations to listen for. */
        beginTopic: "@JS_NS@_widget_radioButton_event_refresh_begin",

        /** Refresh event topic for custom AJAX implementations to listen for. */
        endTopic: "@JS_NS@_widget_radioButton_event_refresh_end"
    },

    /**
     * This object contains state event topics.
     * @ignore
     */
    state: {
        /** State event topic for custom AJAX implementations to listen for. */
        beginTopic: "@JS_NS@_widget_radioButton_event_state_begin",

        /** State event topic for custom AJAX implementations to listen for. */
        endTopic: "@JS_NS@_widget_radioButton_event_state_end"
    },

    /**
     * This object contains submit event topics.
     * @ignore
     */
    submit: {
        /** Submit event topic for custom AJAX implementations to listen for. */
        beginTopic: "@JS_NS@_widget_radioButton_event_submit_begin",

        /** Submit event topic for custom AJAX implementations to listen for. */
        endTopic: "@JS_NS@_widget_radioButton_event_submit_end"
    }
};

/**
 * This function is used to obtain the outermost HTML element class name.
 * <p>
 * Note: Selectors should be concatinated in order of precedence (e.g., the 
 * user's className property is always appended last).
 * </p>
 * @return {String} The outermost HTML element class name.
 * @private
 */
@JS_NS@.widget.radioButton.prototype._getClassName = function() {
    // Set default style.
    var className = (this.disabled == true)
        ? this._theme.getClassName("RADIOBUTTON_SPAN_DISABLED", "")
        : this._theme.getClassName("RADIOBUTTON_SPAN", "");

    return (this.className)
        ? className + " " + this.className
        : className;
};

/**
 * Helper function to obtain image class names.
 *
 * @return {String} The HTML image element class name.
 * @private
 */
@JS_NS@.widget.radioButton.prototype._getImageClassName = function() {
    return (this.disabled == true)
        ? this._theme.getClassName("RADIOBUTTON_IMAGE_DISABLED", "")
        : this._theme.getClassName("RADIOBUTTON_IMAGE", "");  
};

/**
 * Helper function to obtain input class names.
 *
 * @return {String} The HTML input element class name.
 * @private
 */
@JS_NS@.widget.radioButton.prototype._getInputClassName = function() {
    // Set readOnly style.
    if (this.readOnly == true) {
        return this._theme.getClassName("RADIOBUTTON_READONLY", "");
    }

    // Disabled style.
    return (this.disabled == true)
        ? this._theme.getClassName("RADIOBUTTON_DISABLED", "")
        : this._theme.getClassName("RADIOBUTTON", "");  
};

/**
 * Helper function to obtain label class names.
 *
 * @return {String} The HTML label element class name.
 * @private
 */
@JS_NS@.widget.radioButton.prototype._getLabelDisabledClassName = function(disabled) {
    return (disabled == true)
        ? this._theme.getClassName("RADIOBUTTON_LABEL_DISABLED", "")
        : this._theme.getClassName("RADIOBUTTON_LABEL", "");  
};

/**
 * Return an Object Literal of label properties desired
 * by the radioButton widget.
 * <p>
 * This implementation sets
 * the <code>radioButton.labelLevel</code> 
 * theme values from the <code>messages</code> and <code>styles</code>
 * theme categories to the
 * label's <code>level</code> and <code>className</code> properties 
 * respectively.
 * </p>
 * <p>
 * These properties are extended with <code>this.label</code> and the
 * resulting properties are returned.
 * </p>
 * @return {Object} label properties.
 * @private
 */
@JS_NS@.widget.radioButton.prototype._getLabelProps = function() {

    // First see if the super class wants to contribute to the props.
    // Let selectBase add the htmlFor property
    //
    var props = this.inherited("_getLabelProps", arguments);
    props.level = this._theme.getMessage("radioButton.labelLevel", null, 3);
    return props;
};
