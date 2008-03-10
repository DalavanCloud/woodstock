// widget/rating.js
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
// Copyright 2008 Sun Microsystems, Inc. All rights reserved.
//

webui.@THEME@.dojo.provide("webui.@THEME@.widget.rating");

webui.@THEME@.dojo.require("webui.@THEME@.browser");
webui.@THEME@.dojo.require("webui.@THEME@.common");
webui.@THEME@.dojo.require("webui.@THEME@.widget.widgetBase");


/**
 * @name webui.@THEME@.widget.rating
 * @extends webui.@THEME@.widget.widgetBase
 * @class This class contains functions for the rating widget.
 * @constructor This function is used to construct a rating widget.
 */
webui.@THEME@.dojo.declare("webui.@THEME@.widget.rating", webui.@THEME@.widget.widgetBase, {

    browser: webui.@THEME@.browser, // Browser utils

    // Set defaults for public properties that can be modified.
    autoSubmit: false,
    includeText: true,
    includeNotInterested: true,
    includeClear: true,
    includeModeToggle: false,
    inAverageMode: false,
    grade: this.CODE_CLEAR,
    averageGrade: 0.0,
    maxGrade: 0,
    gradeReadOnly: false,
    modeReadOnly: false,
    tabIndex: -1,

    // Class constants - must have different values and must be <= 0
    CODE_NOTINTERESTED: -1, // Must match NOT_INTERESTED_GRADE in component/Rating.java
    CODE_MODETOGGLE: -2,
    CODE_CLEAR: 0,    // Need not be 0, but must match CLEAR_GRADE in component/Rating.java

    // Set defaults for private data used internally by the widget.
    currentText: null,
    clicked: false,
    mousedover: false,
    oldMaxGrade: 0,
    gradeNodes: null,

    widgetName: "rating" // Required for theme properties.

}); // constructor

/**
 * This object contains event topics.
 * <p>
 * Note: Event topics must be prototyped for inherited functions. However, these
 * topics must also be available statically so that developers may subscribe to
 * events.
 * </p>
 * @ignore
 */
webui.@THEME@.widget.rating.event =
        webui.@THEME@.widget.rating.prototype.event = {

    /** 
     * This closure is used to process refresh events.
     * @ignore
     */
    refresh: {
        /**
         * Refresh event topics for custom AJAX implementations to listen for.
         */
        beginTopic: "webui_@THEME@_widget_rating_event_refresh_begin",

        /**
         * Refresh event topics for custom AJAX implementations to listen for.
         */
        endTopic: "webui_@THEME@_widget_rating_event_refresh_end"
    },

    /**
     * This object contains submit event topics.
     * @ignore
     */
    submit: {
        /** Submit event topic for custom AJAX implementations to listen for. */
        beginTopic: "webui_@THEME@_widget_rating_event_submit_begin",

        /** Submit event topic for custom AJAX implementations to listen for. */
        endTopic: "webui_@THEME@_widget_rating_event_submit_end"
    },

    /**
     * This object contains state event topics.
     * @ignore
     */
    state: {
        /** State event topic for custom AJAX implementations to listen for. */
        beginTopic: "webui_@THEME@_widget_rating_event_state_begin",

        /** State event topic for custom AJAX implementations to listen for. */
        endTopic: "webui_@THEME@_widget_rating_event_state_end"
    }

};

/**
 * This function is used to get widget properties. Please see the 
 * setProps() function for a list of supported properties.
 *
 * @return {Object} Key-Value pairs of properties.
 */
webui.@THEME@.widget.rating.prototype.getProps = function() {

    var props = this.inherited("getProps", arguments);

    if (this.autoSubmit != null)
        props.autoSubmit = this.autoSubmit;
    if (this.includeText != null)
        props.includeText = this.includeText;
    if (this.includeNotInterested != null)
        props.includeNotInterested = this.includeNotInterested;
    if (this.includeClear != null)
        props.includeClear = this.includeClear;
    if (this.includeModeToggle != null)
        props.includeModeToggle = this.includeModeToggle;
    if (this.inAverageMode != null)
        props.inAverageMode = this.inAverageMode;
    if (this.grade != null)
        props.grade = this.grade;
    if (this.averageGrade != null)
        props.averageGrade = this.averageGrade;
    if (this.maxGrade != null)
        props.maxGrade = this.maxGrade;
    if (this.gradeReadOnly != null)
        props.gradeReadOnly = this.gradeReadOnly;
    if (this.modeReadOnly != null)
        props.modeReadOnly = this.modeReadOnly;
    if (this.notInterestedHoverText != null)
        props.notInterestedHoverText = this.notInterestedHoverText;
    if (this.gradeHoverTexts != null)
        props.gradeHoverTexts = this.gradeHoverTexts;
    if (this.clearHoverText != null)
        props.clearHoverText = this.clearHoverText;
    if (this.modeToggleHoverTexts != null)
        props.modeToggleHoverTexts = this.modeToggleHoverTexts;
    if (this.notInterestedAcknowledgedText != null)
        props.notInterestedAcknowledgedText = this.notInterestedAcknowledgedText;
    if (this.gradeAcknowledgedText != null)
        props.gradeAcknowledgedText = this.gradeAcknowledgedText;
    if (this.clearAcknowledgedText != null)
        props.clearAcknowledgedText = this.clearAcknowledgedText;
    if (this.modeToggleAcknowledgedTexts != null)
        props.modeToggleAcknowledgedTexts = this.modeToggleAcknowledgedTexts;
    if (this.tabIndex != null)
        props.tabIndex = this.tabIndex;

    return props;

}; // getProps

/**
 * Set the text to be displayed in the textContainer.  If the specified text
 * is null or empty, then display a non-breaking space character.
 *
 * @param {String} text  the text to be displayed
 * @return {boolean} true if successful; otherwise, false.
 * @private
 */
webui.@THEME@.widget.rating.prototype._setText = function(text) {

    if (this.textContainer != null) {
        if (text != null && (text.replace(/^\s+/g, '').replace(/\s+$/g, '') == "" ))
            text = null;
        this.textContainer.innerHTML = (text == null ? "&nbsp;" : text);
        this.currentText = this.textContainer.innerHTML;
    }
    return true;

}; // _setText

/**
 * Get the image info associated with a given grade control for a given grade.
 *
 * @param {boolean} averageMode true if the image info to be returned is within
 *           the context of the widget displaying average mode;  false if within
 *           the context of displaying in normal mode.
 * @param {int} grade the grade of the widget.  This should be the average grade (if
 *           averageMode is true), otherwise the user's grade.
 * @param {int} rank the grade rank assigned to the control whose image info is
 *           being returned.
 * @return {Array} array containing the image info.  The 1st element is the className
 *           the 2nd element is the image width.
 * @private
 */
webui.@THEME@.widget.rating.prototype._getGradeImageInfo = function(averageMode, grade, rank) {

        var className = null;
        var width = null;

        if (averageMode == true) {

            // Compute the difference between the grade being displayed and the grade rank
            // associated with this image.
            var diff = grade - rank;

            // Show correct image based on diff
            if (diff < (0 -.5)) {
                // Difference is more than half-grade below zero.
                // Show empty grade.
                className = this.theme.getClassName("RATING_GRADE_EMPTY_IMAGE");
                width = parseInt(this.theme.getProperty("images", "RATING_GRADE_EMPTY_WIDTH"));
            }
            else if (diff < 0) {
                // Difference is less than a half-grade below 0.
                // Show average half-full grade
                className = this.theme.getClassName("RATING_GRADE_AVG_HALF_IMAGE");
                width = parseInt(this.theme.getProperty("images", "RATING_AVG_GRADE_HALF_WIDTH"));
            }
            else {
                // Difference is 0 or higher.
                // Show average full grade
                className = this.theme.getClassName("RATING_GRADE_AVG_FULL_IMAGE");
                width = parseInt(this.theme.getProperty("images", "RATING_AVG_GRADE_FULL_WIDTH"));
            }

        } else {
            if (rank <= grade) {
                // Show full user's grade
                className = this.theme.getClassName("RATING_GRADE_FULL_IMAGE");
                width = parseInt(this.theme.getProperty("images", "RATING_GRADE_FULL_WIDTH"));
            } else {
                // Show empty grade
                className = this.theme.getClassName("RATING_GRADE_EMPTY_IMAGE");
                width = parseInt(this.theme.getProperty("images", "RATING_GRADE_EMPTY_WIDTH"));
            }
        }

        return [className, width];

}; // _getGradeImageInfo

/**
 * Preview component state based on mouse hover.
 *
 * @param {int} code indicates on which image the event occurs.
 *              Can be one of the widget constants:
 *                  CODE_NOTINTERESTED, CODE_MODETOGGLE, or CODE_CLEAR
 *              or 1->maxGrade
 * @param {boolean} isMouseOver  true if mouseover event, otherwise false.
 *                  false implies an "undo" of the preview state.
 * @return {boolean} true if successful; otherwise, false.
 * @private
 */
webui.@THEME@.widget.rating.prototype._previewState = function(code, isMouseOver) {

    // Determine if we will be displaying average grade.
    //
    var displayingAvg = false;
    if ((code == this.CODE_MODETOGGLE) && isMouseOver)
        // Moused over modeToggle control, so we will preview the inverse mode of
        // current display mode.
        displayingAvg = !this.inAverageMode;
    else {
        // If mouseout from any control then we will preview what the
        // current display mode is.  This is akin to an "undo" of the preview state
        // from a previous mouseover of the modeToggle control.  Otherwise on a
        // mouseover of any control BUT modeToggle, we will not preview the
        // average grade.
        displayingAvg = (!isMouseOver ? this.inAverageMode : false);
    }
    
    // Determine which grade to display.
    //
    var displayingGrade;
    if (!isMouseOver) {
        // Mouseout from any control.  Then we will preview that the
        // current display grade is.  This is akin to an "undo" of the preview state
        // from a previous mouseover.  The grade is either the average grade (if
        // in average mode) or the user's grade (if in normal mode).
        displayingGrade = this.inAverageMode ? this.averageGrade : this.grade;
    }

    else if (code == this.CODE_MODETOGGLE)
        // Mouseover modeToggle.  Display either the average grade or the user's grade.
        displayingGrade = displayingAvg ? this.averageGrade : this.grade;

    else if (code == this.CODE_CLEAR)
        // Mouseover clear, so no grade to display.
        displayingGrade = 0;
    else
        // Display the grade associated with the control on which the event occurred.
        displayingGrade = code;
    

    var hoverText = null;

    // ModeToggle image
    if ((this.includeModeToggle == true) && (this.modeToggleNode != null)) {
        // Set style class for this image
        if (displayingAvg)
            this.modeToggleNode.className = this.theme.getClassName("RATING_MODE_AVERAGE_IMAGE");
        else
            this.modeToggleNode.className = this.theme.getClassName("RATING_MODE_NORMAL_IMAGE");

        // If mouseover on modeToggle, set the hover text to display
        if ((code == this.CODE_MODETOGGLE) && isMouseOver && (this.modeToggleHoverTexts != null)) {
            hoverText = (displayingAvg
                ? (this.modeToggleHoverTexts.length == 2 ? this.modeToggleHoverTexts[1] : null)
                : this.modeToggleHoverTexts[0]);
        }
    }

    // Not interested image
    if ((this.includeNotInterested == true) && (this.notInterestedNode != null)) {
        // Set style class for this image
        if (displayingGrade == this.CODE_NOTINTERESTED)
            this.notInterestedNode.className = this.theme.getClassName("RATING_NOT_INTERESTED_ON_IMAGE");
        else
            this.notInterestedNode.className = this.theme.getClassName("RATING_NOT_INTERESTED_OFF_IMAGE");

        // If mouseover on notInterested, set the hover text to display
        if (code == this.CODE_NOTINTERESTED && isMouseOver && this.notInterestedHoverText != null)
            hoverText = this.notInterestedHoverText;
    }

    // Clear image
    if ((this.includeClear == true) && (this.clearNode != null)) {
        // Set style class and hover text for this image.  It will always be off unless mouseover
        // of the clear control.
        if (code == this.CODE_CLEAR && isMouseOver) {
            this.clearNode.className = this.theme.getClassName("RATING_CLEAR_ON_IMAGE");
            if (this.clearHoverText != null)
                hoverText = this.clearHoverText;
        }
        else
            this.clearNode.className = this.theme.getClassName("RATING_CLEAR_OFF_IMAGE");
    }

    // Grade images
    for (var i = 1; i <= this.maxGrade; i++) {
        if (i > this.gradeNodes.length)
            break;

        // If this grade image is the one moused over, then get it's hover text.
        if (isMouseOver && (code != this.CODE_MODETOGGLE) && (i == displayingGrade)) {
            if ((this.gradeHoverTexts != null) && (i <= this.gradeHoverTexts.length))
                hoverText = this.gradeHoverTexts[i-1];
        }

        // Set appropriate class for this grade image
        var imageInfo = this._getGradeImageInfo(displayingAvg, displayingGrade, i);
        this.gradeNodes[i-1].className = imageInfo[0];
    }

    // Set hover text in textContainer
    this._setText(hoverText);

    return true;

}; // _previewState

/**
 * Modify component state based on mouse click, basically updating our
 * state based on the current preview.
 *
 * @param {int} code indicates on which image the event occurs.
 *              Can be one of the object constants:
 *                  CODE_NOTINTERESTED, CODE_MODETOGGLE, or CODE_CLEAR
 *              or 1->maxGrade
 * @return {boolean} true if successful; otherwise, false.
 * @private
 */
webui.@THEME@.widget.rating.prototype._modifyState = function(code) {

    if (code == this.CODE_MODETOGGLE) {
        // Toggle mode
        this.inAverageMode = !this.inAverageMode;

        // If acknowledgement text configured for when toggling mode, then render it for the new mode.
        var acknowledgedText = null;
        if (this.modeToggleAcknowledgedTexts != null) {
            acknowledgedText = (this.inAverageMode
                ? (this.modeToggleAcknowledgedTexts.length == 2 ? this.modeToggleAcknowledgedTexts[1] : null)
                : this.modeToggleAcknowledgedTexts[0]);
        }
        this._setText(acknowledgedText);

    }
    else {
        // Normal (not average) mode
        this.inAverageMode = false;

        // Update the widget grade, as well as post it to the hidden input
        // field so it's available to be submitted if the page is submitted.
        this.grade = code;
        this.hiddenFieldNode.value = this.grade;

        // Render acknowledged text for image clicked
        var acknowledgedText = null;
        if (code == this.CODE_CLEAR)
            acknowledgedText = this.clearAcknowledgedText;
        else if (code == this.CODE_NOTINTERESTED)
            acknowledgedText = this.notInterestedAcknowledgedText;
        else
            acknowledgedText = this.gradeAcknowledgedText;
        this._setText(acknowledgedText);

        if (this.autoSubmit)
            this.submit();
    }

    return true;

}; // _modifyState

/**
 * Handler for mouseout and mouseover events.
 *
 * @param {int} code indicates on which image the event occurs.
 *              Can be one of the object constants:
 *                  CODE_NOTINTERESTED, CODE_MODETOGGLE, or CODE_CLEAR
 *              or 1->maxGrade
 * @param {boolean} isMouseOver  true if mouseover event, otherwise false
 * @return {boolean} true if successful; otherwise, false.
 * @private
 */
webui.@THEME@.widget.rating.prototype._onMouseCallback = function(code, isMouseOver) {

    // Return if either:
    //   1. this is a mouse over, or
    //   2. this is a mouse out, and the component is not considered in a "mousedover" state.
    //      (this occurs if we moused in to a grade control, but gradeReadOnly was true,
    //       or if we moused into the modeToggle control, but modeReadOnly was true)
    if ( (this.gradeReadOnly && (code != this.CODE_MODETOGGLE))
        || (this.modeReadOnly && (code == this.CODE_MODETOGGLE)) ) {
        if (isMouseOver || !this.mousedover)
            return true;
    }

    // Show a preview of the component state if the mouse would be clicked.
    this._previewState(code, isMouseOver);
    
    // Remember we just processed a mouseover/mouseout (ie., non-click) event
    this.mousedover = isMouseOver; 
    this.clicked = false; 

    return true;

}; // _onMouseCallback

/**
 * Handler for click events.
 *
 * @param {int} code indicates on which image the event occurs:
 *              Can be one of the object constants:
 *                  CODE_NOTINTERESTED, CODE_MODETOGGLE, or CODE_CLEAR
 *              or 1->maxGrade
 * @return {boolean} true if successful; otherwise, false.
 * @private
 */
webui.@THEME@.widget.rating.prototype._onClickCallback = function(code) {

    // Return if either:
    //   1. clicked on a grade control when gradeReadOnly is true, or
    //   2. clicked on modeTogglecontrol, but modeReadOnly is true, or
    //   3. We just processed a click and there's been no new mouse event
    if ( (this.gradeReadOnly && (code != this.CODE_MODETOGGLE)) 
        || (this.modeReadOnly && (code == this.CODE_MODETOGGLE))
        || this.clicked)
        return true;

    // Publish event prior to changing widget state.
    this.publish(webui.@THEME@.widget.rating.event.state.beginTopic, [{
        id: this.id
    }]);

    // Modify the component state permanently
    this._modifyState(code);
    
    // Remember we just processed a click (ie, non-mouseover/mouseout) event
    this.clicked = true;
    this.mousedover = false; 

    // Publish event after changing widget state.
    this.publish(webui.@THEME@.widget.rating.event.state.endTopic, [{
        id: this.id
    }]);

    return true;

}; // _onClickCallback

/**
 * Handler for focus events.
 *
 * @param {int} code indicates on which image the event occurs:
 *              Can be one of the object constants:
 *                  CODE_NOTINTERESTED, CODE_MODETOGGLE, or CODE_CLEAR
 *              or 1->maxGrade
 * @return {boolean} true if successful; otherwise, false.
 * @private
 */
webui.@THEME@.widget.rating.prototype._onFocusCallback = function(code) {

    // TBD
    console.log("_onFocusCallback: code=" + code);

    return true;

}; // _onFocusCallback

/**
 * Setup handler for mouseover events.  We setup in this manner so
 * we can use closure magic to define the scope for the handler with 
 * necessary information to properly process the event.
 *
 * @param {int} code indicates on which image the event occurs:
 * @return {Object} the event handler
 * @private
 */
webui.@THEME@.widget.rating.prototype._createOnMouseOverCallback = function(code) {

    var _code = code;
    var _this = this;
    return function(event) {
        _this._onMouseCallback(_code, true);
    }

}; // _createOnMouseOverCallback

/**
 * Setup handler for mouseout events.  We setup in this manner so
 * we can use closure magic to define the scope for the handler with 
 * necessary information to properly process the event.
 *
 * @param {int} code indicates on which image the event occurs:
 * @return {Object} the event handler
 * @private
 */
webui.@THEME@.widget.rating.prototype._createOnMouseOutCallback = function(code) {

    var _code = code;
    var _this = this;
    return function(event) {
        _this._onMouseCallback(_code, false);
    }

}; // _createOnMouseOutCallback

/**
 * Setup handler for click events.  We setup in this manner so
 * we can use closure magic to define the scope for the handler with 
 * necessary information to properly process the event.
 *
 * @param {int} code indicates on which image the event occurs:
 * @return {Object} the event handler
 * @private
 */
webui.@THEME@.widget.rating.prototype._createOnClickCallback = function(code) {

    var _code = code;
    var _this = this;
    return function(event) {
        _this._onClickCallback(_code);
    }

}; // _createOnClickCallback

/**
 * Setup handler for focus events.  We setup in this manner so
 * we can use closure magic to define the scope for the handler with 
 * necessary information to properly process the event.
 *
 * @param {int} code indicates on which image the event occurs:
 * @return {Object} the event handler
 * @private
 */
webui.@THEME@.widget.rating.prototype._createOnFocusCallback = function(code) {

    var _code = code;
    var _this = this;
    return function(event) {
        _this._onFocusCallback(_code);
    }

}; // _createOnFocusCallback

/**
 * This function is used to fill in remaining template properties, after the
 * buildRendering() function has been processed.
 * <p>
 * Note: Unlike Dojo 0.4, the DOM nodes don't exist in the document, yet. 
 * </p>
 * @return {boolean} true if successful; otherwise, false.
 */
webui.@THEME@.widget.rating.prototype.postCreate = function () {

    // Set IDs for the controls
    this.notInterestedID = this.id + "_notInterested";
    this.clearID = this.id + "_clear";
    this.modeToggleID = this.id + "_modeToggle";
    this.gradeID = this.id + "_grade";  // actual ID will have ordinal value appended
    this.textID = this.id + "_text";

    // Configure hidden field to hold the submitted value
    this.hiddenFieldNode.id = this.id + "_submitValue";
    this.hiddenFieldNode.name = this.hiddenFieldNode.id;

    // Listen for post-submit events
    this.subscribe(this.event.submit.endTopic, this, "_submitCallback");

    // Initialize maintenance of width dimensions for controlContainer images.
    // Required because we will always need to maintain the width of the control
    // area, which depends on the number of images to be rendered.  The computed
    // width will be a "best fit" - just enough to encompass the required
    // image controls.
    this.imageWidths = new Array();
    this.imageWidths["notInterested"] = 0;
    this.imageWidths["grades"] = 0;
    this.imageWidths["spacer"] = 0;
    this.imageWidths["clear"] = 0;
    this.imageWidths["modeToggle"] = 0;

    // Set classes on elements that don't change.
    this.common.addStyleClass(this.textContainer,
        this.theme.getClassName("RATING_TEXT_CONTAINER"));
    this.common.addStyleClass(this.controlContainer,
        this.theme.getClassName("RATING_CONTROL_CONTAINER"));
    this.common.addStyleClass(this.spacerNode,
        this.theme.getClassName("RATING_SPACER_NODE"));

    // Configure event handlers for the notInterested control
    this.dojo.connect(this.notInterestedNode,
        "onmouseover", this._createOnMouseOverCallback(this.CODE_NOTINTERESTED));
    this.dojo.connect(this.notInterestedNode,
        "onclick", this._createOnClickCallback(this.CODE_NOTINTERESTED));
    this.dojo.connect(this.notInterestedNode,
        "onmouseout", this._createOnMouseOutCallback(this.CODE_NOTINTERESTED));
/* TBD
    this.dojo.connect(this.notInterestedNode,
        "onfocus", this._createOnFocusCallback(this.CODE_NOTINTERESTED));
*/

    // Configure event handlers for the clear control
    this.dojo.connect(this.clearNode,
        "onmouseover", this._createOnMouseOverCallback(this.CODE_CLEAR));
    this.dojo.connect(this.clearNode,
        "onclick", this._createOnClickCallback(this.CODE_CLEAR));
    this.dojo.connect(this.clearNode,
        "onmouseout", this._createOnMouseOutCallback(this.CODE_CLEAR));
/* TBD
    this.dojo.connect(this.clearNode,
        "onfocus", this._createOnFocusCallback(this.CODE_CLEAR));
*/

    // Configure event handlers for the modeToggle control
    this.dojo.connect(this.modeToggleNode,
        "onmouseover", this._createOnMouseOverCallback(this.CODE_MODETOGGLE));
    this.dojo.connect(this.modeToggleNode,
        "onclick", this._createOnClickCallback(this.CODE_MODETOGGLE));
    this.dojo.connect(this.modeToggleNode,
        "onmouseout", this._createOnMouseOutCallback(this.CODE_MODETOGGLE));
/* TBD
    this.dojo.connect(this.modeToggleNode,
        "onfocus", this._createOnFocusCallback(this.CODE_MODETOGGLE));
*/

/* TBD
    this.domNode.tabIndex = -1;
    this.dojo.connect(this.domNode,
        "onfocus", this._createOnFocusCallback(99));
*/

    return this.inherited("postCreate", arguments);

}; // postCreate

/**
 * This function is used to set widget properties using Object literals.
 * <p>
 * Note: This function extends the widget object for later updates. Further, the
 * widget shall be updated only for the given key-value pairs.
 * </p>
 * @param {Object} props Key-Value pairs of properties.
 * <p>
 * @config {boolean} autoSubmit
 *                   Indicates whether the grade is automatically submitted to the 
 *                   server via an Ajax request immediately after the grade is 
 *                   selected.  The default is false - it is NOT automatically submitted.
 * </p><p>
 * @config {double}  averageGrade
 *                   The average grade the general user population has assigned to the item.
 *                   Must be between 0 and the maximum grade.  The default is 0.
 * </p><p>
 * @config {String}  clearAcknowledgedText
 *                   The acknowledged text for the clear control.  There is no default.
 * </p><p>
 * @config {String}  clearHoverText
 *                   The hover text for the clear control.  There is no default.
 * </p><p>
 * @config {int}     grade
 *                   The grade (number of "stars") the user has assigned the item.
 *                   Use the keyword "notInterested" for a not interested grade
 *                   and the keyword "clear" to clear the grade (effective, set it to 0).
 *                   The default is "clear".
 * </p><p>
 * @config {String}  gradeAcknowledgedText
 *                   The text that is displayed after clicking on a grade component.  There is no default.
 * </p><p>
 * @config {Array}   gradeHoverTexts
 *                   The hover texts that will be used for the grade controls, ordered from lowest 
 *                   to highest rating.  That is, hoverTexts[0] will be the hover text associated 
 *                   with the lowest rating;  hoverTexts[hoverTexts.length-1] with the highest rating.
 *                   Null can be specified as a member of the array.  There are no defaults.
 * </p><p>
 * @config {boolean} gradeReadOnly
 *                   Indicates whether the grade of this rating component can be changed by the user.
 *                   The default is false - it is NOT read-only, and therefore can be changed by the user.
 * </p><p>
 * @config {boolean} inAverageMode
 *                   Indicates whether the component will be rendered displaying the average grade.
 *                   The default is false, the component will be rendered showing the user's rating (normal mode).
 * </p><p>
 * @config {boolean} includeClear
 *                   Indicates whether a control to clear the user's rating should be displayed.
                     The default is true.
 * </p><p>
 * @config {boolean} includeModeToggle
 *                   Indicates whether a control to toggle the mode (to show the average 
                     rating or the user's rating) should be rendered.  The default is false.
 * </p><p>
 * @config {boolean} includeNotInterested
 *                   Indicates whether a control to allow the user to assign a
 *                   "not interested" rating should be rendered.  The default is true.
 * </p><p>
 * @config {boolean} includeText
 *                   Indicates whether an area for hover or post-click acknowledeged
 *                   text should be rendered.  The default is true.
 * </p><p>
 * @config {int}     maxGrade
 *                   The maximum grade (number of "stars") this rating instance allows.
 *                   There is no default, and so must be set.
 * </p><p>
 * @config {boolean} modeReadOnly
 *                   Indicates whether the mode of this rating component can be changed by the user.
 *                   The default is false - it is NOT read-only, and therefore can be changed by the user.
 * </p><p>
 * @config {Array}   modeToggleAcknowledgedTexts
 *                   The acknowledged texts to be used for the mode toggle control.  The first element
 *                   of the array is the acknowledged text displayed after clicking on the mode toggle 
 *                   control to preview the user's rating (normal mode).  The second element is 
 *                   the text displayed after clicking to preview the average rating (average mode).
 *                   Null can be specified as a member of the array.
 * </p><p>
 * @config {Array}   modeToggleHoverTexts
 *                   The hover texts to be used for the mode toggle control.  The first element 
 *                   of the array is the hover text displayed when hovering over the mode toggle 
 *                   control to preview the user's rating (normal mode).  The second element is 
 *                   the text displayed when hovering to preview the average rating (normal mode).
 *                   Null can be specified as a member of the array.
 * </p><p>
 * @config {String}  notInterestedAcknowledgedText
 *                   The acknowledged text for the "not interested" control.  There is no default.
 * </p><p>
 * @config {String}  notInterestedHoverText
 *                   The hover text for the "not interested" control.  There is no default.
 * </p><p>
 * @return {boolean} true if successful; otherwise, false.
 */
webui.@THEME@.widget.rating.prototype.setProps = function(props, notify) {

    if (props == null)
        return false;

    // Extend widget object for later updates.
    return this.inherited("setProps", arguments);

}; // setProps

/**
 * This function is used to set widget properties. Please see the setProps() 
 * function for a list of supported properties.
 * <p>
 * Note: This function should only be invoked through setProps().
 * </p>
 * @param {Object} props Key-Value pairs of properties.
 * @return {boolean} true if successful; otherwise, false.
 * @private
 */
webui.@THEME@.widget.rating.prototype._setProps = function(props) {

    if (props == null)
        return false;

    var gradeRightMargin = parseInt(this.theme.getProperty("styles", "RATING_GRADE_MARGIN_RIGHT"));
    var hiddenClass = this.theme.getClassName("HIDDEN");

    // Assume we will NOT (re)-build grade controls, prove otherwise based on properties that change.
    var createGradeControls = false;

    // Assume width of control container does NOT need to be recalculated, prove otherwise based on 
    // properties that change.
    var changeControlWidth = false;

    // In average mode
    if (props.inAverageMode != null) {
        if (props.inAverageMode != this.inAverageMode) {
            createGradeControls = true;
            this.inAverageMode = props.inAverageMode;
        }
    }

    // User's grade
    if (props.grade != null) {
        var newGrade = this.grade;
	if (props.grade == "notInterested")
            newGrade = this.CODE_NOTINTERESTED;
        else if (props.grade == "clear")
            newGrade = this.CODE_CLEAR;
        else {
            var n = parseInt(props.grade);
            if (!isNaN(n))
                newGrade = n;
        }
        if (newGrade != this.grade) {
            createGradeControls = true;
            this.grade = newGrade;
        }
    }

    // Average grade
    if (props.averageGrade != null) {
        var newAvg = this.averageGrade;
        var f = parseFloat(props.averageGrade);
        if (!isNaN(f))
            newAvg = f;
        if (newAvg != this.averageGrade) {
            createGradeControls = true;
            this.averageGrade = newAvg;
        }
    }

    // Text area
    if (props.includeText != null) {
        this.includeText = props.includeText;
        this.textContainer.id = this.textID;
        var classNames = this.textContainer.className.split(" ");
        if (props.includeText == true) {
            // Remove hidden class
            if (this.common.checkStyleClasses(classNames, hiddenClass))
                this.common.stripStyleClass(this.textContainer, hiddenClass);
        } else {
            // Add hidden class
            if (!this.common.checkStyleClasses(classNames, hiddenClass))
                this.common.addStyleClass(this.textContainer, hiddenClass);
        }
    }

    // Not Interested control
    if (props.includeNotInterested != null) {
        this.includeNotInterested = props.includeNotInterested;
        this.notInterestedNode.id = this.notInterestedID;
        var classNames = this.notInterestedNode.className.split(" ");
        var imageWidth = 0;

        if (this.includeNotInterested == true) {
            var notInterestedOff = this.theme.getClassName("RATING_NOT_INTERESTED_OFF_IMAGE");
            var notInterestedOn = this.theme.getClassName("RATING_NOT_INTERESTED_ON_IMAGE");

            // Remove hidden class
            if (this.common.checkStyleClasses(classNames, hiddenClass))
                this.common.stripStyleClass(this.notInterestedNode, hiddenClass);

            if (this.grade == this.CODE_NOTINTERESTED) {
                // Remove notInterested OFF class
                if (this.common.checkStyleClasses(classNames, notInterestedOff))
                    this.common.stripStyleClass(this.notInterestedNode, notInterestedOff);

                // Add notInterested ON class
                if (!this.common.checkStyleClasses(classNames, notInterestedOn))
                    this.common.addStyleClass(this.notInterestedNode, notInterestedOn);

                // Get image width
                imageWidth = parseInt(this.theme.getProperty("images", "RATING_NOT_INTERESTED_ON_WIDTH"));

            } else {
                // Remove notInterested ON class
                if (this.common.checkStyleClasses(classNames, notInterestedOn))
                    this.common.stripStyleClass(this.notInterestedNode, notInterestedOn);

                // Add notInterested OFF class
                if (!this.common.checkStyleClasses(classNames, notInterestedOff))
                    this.common.addStyleClass(this.notInterestedNode, notInterestedOff);

                // Get image width
                imageWidth = parseInt(this.theme.getProperty("images", "RATING_NOT_INTERESTED_OFF_WIDTH"));
            }

            // Add right margin
            imageWidth += gradeRightMargin;

        } else {
            // Add hidden class
            if (!this.common.checkStyleClasses(classNames, hiddenClass))
                this.common.addStyleClass(this.notInterestedNode, hiddenClass);
        }

        // Record image width if changing and flag that control container width must be recomputed.
        if (imageWidth != this.imageWidths["notInterested"]) {
            this.imageWidths["notInterested"] = imageWidth;
            changeControlWidth = true;
        }
    }

    // Maximum grade
    if ((props.maxGrade != null) && (props.maxGrade != this.oldMaxGrade)) {
        createGradeControls = true;
        this.maxGrade = props.maxGrade;
    }

    // If creating grade controls, delete existing ones if they exist
    if (createGradeControls == true) {
        for (var i = 1; i <= this.oldMaxGrade; i++) {
            var node = this.gradeNodes[i-1];
            if (node != null)
                node.parentNode.removeChild(node);
        }
        this.gradeNodes = null;
        this.imageWidths["grades"] = 0;
        this.oldMaxGrade = this.maxGrade;
    }

    // Grade controls
    if (createGradeControls == true) {
        var imageWidths = 0;
        this.gradeNodes = new Array(this.maxGrade);

        for (var i = 1; i <= this.maxGrade; i++) {
            // Clone the gradeNode element and assign ID
            var clone = this.gradeNode.cloneNode(false);
            clone.id = this.gradeID + i;

            // Get image info for this grade control for the display mode
            var imageInfo = null;
            if (this.inAverageMode)
                imageInfo = this._getGradeImageInfo(true, this.averageGrade, i);
            else
                imageInfo = this._getGradeImageInfo(false, this.grade, i);

            // Set class for this grade control
            clone.className = imageInfo[0];

            // Maintain running image width for grades
            imageWidths += (imageInfo[1] + gradeRightMargin);

            // Add the clone to the grade container
            this.gradeContainer.appendChild(clone);

            // Save handle to cloned node for quick access later on.
            this.gradeNodes[i-1] = clone;

            // Configure event handlers for this grade control
            this.dojo.connect(clone, "onmouseover", this._createOnMouseOverCallback(i));
            this.dojo.connect(clone, "onclick", this._createOnClickCallback(i));
            this.dojo.connect(clone, "onmouseout", this._createOnMouseOutCallback(i));
/* TBD
            this.dojo.connect(clone, "onfocus", this._createOnFocusCallback(i));
*/
        }

        // Record image widths if changing and flag that control container width must be recomputed.
        if (imageWidths != this.imageWidths["grades"]) {
            this.imageWidths["grades"] = imageWidths;
            changeControlWidth = true;
        }
    }

    // Clear grade control
    if (props.includeClear != null) {
        this.includeClear = props.includeClear;
        this.clearNode.id = this.clearID;
        var classNames = this.clearNode.className.split(" ");
        var imageWidth = 0;

        if (props.includeClear == true) {
            var clearOff = this.theme.getClassName("RATING_CLEAR_OFF_IMAGE");
            var clearOn = this.theme.getClassName("RATING_CLEAR_ON_IMAGE");

            // Remove hidden class
            if (this.common.checkStyleClasses(classNames, hiddenClass))
                this.common.stripStyleClass(this.clearNode, hiddenClass);

            // Remove clear ON class.  Shouldn't need to since it's only on upon hover, but Murphy's Law ...
            if (this.common.checkStyleClasses(classNames, clearOn))
                this.common.stripStyleClass(this.clearNode, clearOn);

            // Add clear OFF class
            if (!this.common.checkStyleClasses(classNames, clearOff))
                this.common.addStyleClass(this.clearNode, clearOff);

            // Get image width
            imageWidth = parseInt(this.theme.getProperty("images", "RATING_CLEAR_OFF_WIDTH")) + gradeRightMargin;

        } else {
            // Add hidden class
            if (!this.common.checkStyleClasses(classNames, hiddenClass))
                this.common.addStyleClass(this.clearNode, hiddenClass);
        }

        // Record image width if changing and flag that control container width must be recomputed.
        if (imageWidth != this.imageWidths["clear"]) {
            this.imageWidths["clear"] = imageWidth;
            changeControlWidth = true;
        }
    }

    // Mode toggle control
    if (props.includeModeToggle != null) {
        this.includeModeToggle = props.includeModeToggle;
        this.modeToggleNode.id = this.modeToggleID;
        var classNames = this.modeToggleNode.className.split(" ");
        var imageWidth = 0;

        if (props.includeModeToggle == true) {
            var normalMode = this.theme.getClassName("RATING_MODE_NORMAL_IMAGE");
            var averageMode = this.theme.getClassName("RATING_MODE_AVERAGE_IMAGE");

            // Remove hidden class
            if (this.common.checkStyleClasses(classNames, hiddenClass))
                this.common.stripStyleClass(this.modeToggleNode, hiddenClass);

            if (this.inAverageMode == true) {
                // Remove normal mode class
                if (this.common.checkStyleClasses(classNames, normalMode))
                    this.common.stripStyleClass(this.modeToggleNode, normalMode);

                // Add average mode class
                if (!this.common.checkStyleClasses(classNames, averageMode))
                    this.common.addStyleClass(this.modeToggleNode, averageMode);

                // Get image width
                imageWidth = parseInt(this.theme.getProperty("images", "RATING_MODE_AVG_WIDTH"));
            }
            else {
                // Remove average mode class
                if (this.common.checkStyleClasses(classNames, averageMode))
                    this.common.stripStyleClass(this.modeToggleNode, averageMode);

                // Add normal mode class
                if (!this.common.checkStyleClasses(classNames, normalMode))
                    this.common.addStyleClass(this.modeToggleNode, normalMode);

                // Get image width
                imageWidth = parseInt(this.theme.getProperty("images", "RATING_MODE_NORMAL_WIDTH"));
            }

        } else {
            // Add hidden class
            if (!this.common.checkStyleClasses(classNames, hiddenClass))
                this.common.addStyleClass(this.modeToggleNode, hiddenClass);
        }

        // Record image width if changing and flag that control container width must be recomputed.
        if (imageWidth != this.imageWidths["modeToggle"]) {
            this.imageWidths["modeToggle"] = imageWidth;
            changeControlWidth = true;
        }
    }

    // Spacer between grade controls and clear/modeToggle controls
    var classNames = this.spacerNode.className.split(" ");
    if ((this.imageWidths["clear"] > 0) || (this.imageWidths["modeToggle"] > 0)) {
        // Remove hidden class
        if (this.common.checkStyleClasses(classNames, hiddenClass))
            this.common.stripStyleClass(this.spacerNode, hiddenClass);

        // Record spacer width if changing and flag that control container width must be recomputed.
        if (this.imageWidths["spacer"] == 0) {
            this.imageWidths["spacer"] = parseInt(this.theme.getProperty("styles", "RATING_SPACER_WIDTH"));
            changeControlWidth = true;
        }
    } else {
        // Add hidden class
        if (!this.common.checkStyleClasses(classNames, hiddenClass))
            this.common.addStyleClass(this.spacerNode, hiddenClass);

        // Record spacer width if changing and flag that control container width must be recomputed.
        if (this.imageWidths["spacer"] != 0) {
            this.imageWidths["spacer"] = 0;
            changeControlWidth = true;
        }
    }

    // Set width on control container, but only if it's changing.
    if (changeControlWidth == true) {
        var controlContainerWidth = 0;
        for (key in this.imageWidths)
            controlContainerWidth += this.imageWidths[key];
        this.controlContainer.style.width = controlContainerWidth + "px";
    }
    
    // Set more properties.
    this.setCommonProps(this.domNode, props);
    this.setEventProps(this.domNode, props);

    // Set remaining properties.
    return this.inherited("_setProps", arguments);

}; // _setProps

/**
 * Submit the selected grade.  This function is useful if autoSubmit is disabled
 * but it is still desired to asynchronously submit the grade.
 *
 * @param {String} execute The string containing a comma separated list 
 * of client ids against which the execute portion of the request 
 * processing lifecycle must be run.
 * @return {boolean} true if successful; otherwise, false.
 */
webui.@THEME@.widget.rating.prototype.submit = function(execute) {

    // Publish an event for custom AJAX implementations to listen for.
    // Note that the current grade value is placed in a hidden input field which 
    // is automatically submitted, and so we don't need to explicitly include
    // the grade value in the props payload associated with beginTopic.
    //
    this.publish(webui.@THEME@.widget.rating.event.submit.beginTopic, [{
        id: this.id,
        execute: execute,
        endTopic: webui.@THEME@.widget.rating.event.submit.endTopic
    }]);

    return true;

}; // submit

/**
 * Callback function to the end of the submit request
 *
 * @param props Key-Value pairs of properties.
 * @config {String} id The HTML element Id.
 * @config {double} averageGrade The updated average grade
 * @return {boolean} true if successful; otherwise, false.
 * @private
 */
webui.@THEME@.widget.rating.prototype._submitCallback = function(props) {

    // Clear hidden field after each asynch submit, otherwise a subsequent
    // page submit would re-submit the same value again.
    this.hiddenFieldNode.value = null;

    return true;

}; // _submitCallback