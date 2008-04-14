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

webui.@THEME_JS@._dojo.provide("webui.@THEME_JS@.widget.common");

webui.@THEME_JS@._dojo.require("webui.@THEME_JS@._base.config");
webui.@THEME_JS@._dojo.require("webui.@THEME_JS@._base.browser");
webui.@THEME_JS@._dojo.require("webui.@THEME_JS@._theme.common");

/**
 * @class This class contains functions common to all widgets.
 * @static
 */
webui.@THEME_JS@.widget.common = {
    /**
     * Object to temporarily store widget properties.
     * @private
     * @ignore
     */
    _props: new Object(),

    /**
     * This function is used to add a widget, HTML fragment, or static string to
     * the given domNode.
     * <p>
     * Note: If props is a string, it shall be added as the innerHTML of the 
     * given domNode. By default, all strings shall be HTML escaped.
     * <p></p>
     * If props is a JSON object, containing a fragment property instead of
     * widgetType, it shall be added as the innerHTML of the given domNode. A
     * fragment is also a string; however it is evaluated as JavaScript and not
     * HTML escaped.
     * <p></p>
     * If props is a JSON object, containing a widgetType property, a widget
     * shall be created. The newly created widget shall be added as a child of 
     * the given domNode.
     * <p></p>
     * Valid values for the position param consist of "last" or null. In 
     * general, position only applies when creating new widgets; however, if the 
     * position param is null, any existing child nodes are removed from the
     * domNode.
     * </p>
     *
     * @param {Node} domNode The DOM node to add widget.
     * @param {Object} props Key-Value pairs of properties.
     * @param {boolean} position The position to add widget.
     * @param {boolean} escape HTML escape strings (default).
     * @return {boolean} true if successful; otherwise, false.
     * @private
     */
    _addFragment: function(domNode, props, position, escape) {
        if (domNode == null || props == null) {
            return false;
        }
        var common = webui.@THEME_JS@.widget.common;

        // If position is null, remove existing nodes. The contents shall be
        // replaced by the newly created widget.
        if (position == null) {
            common._removeChildNodes(domNode);

            // Note: To ensure Dojo does not replace the given domNode, always
            // provide a default position to the _createWidget() function. The
            // domNode may be used as a place holder for later updates.
            position = "last";            
        }

        // Add fragment.
        if (typeof props == 'string') {
            // Strip script fragments, set innerHTML property, and
            // eval scripts using a timeout.
            //
            // Note that using Dojo's ContentPane widget would have
            // been more preferable than creating a new dependency
            // based on Prototype. However, as of version .4.1, Dojo
            // still does not use a timeout to eval JavaScript; thus,
            // IE generates errors with innerHTML.
            //
            // "The problem has to do with the browser's poor
            // threading model. Basically, once some JavaScript code
            // is running, all other threads of execution are on hold
            // until the running thread is finished with it's
            // task. This includes whatever thread of execution that
            // updates the DOM model when new content is inserted via
            // innerHTML. For example if you do:
            //
            // foo.innerHTML = '<span id="bar">Bar</span>';
            // var bar = document.getElementById('bar');
            //
            // This code will sometimes fail because although you
            // added the content via innerHTML the DOM may not have
            // been updated and therefore the "bar" element does not
            // exist in the DOM yet. To work around this you can do:
            //
            // foo.innerHTML = '<span id="bar">Bar</span>';
            // setTimeout(function() {
            //     var bar = document.getElementById('bar');
            // }, 10);
            //
            // This will work because in 10 milliseconds whatever
            // event handler is running will have finished, the DOM
            // will update, then the callback will execute and have no
            // problem accessing the DOM element."
            //
            // The full discussion on this topic can be found at:
            //
            // http://www.ruby-forum.com/topic/73990
            //
            if (escape != null && new Boolean(escape).valueOf() == false) {
                // Note: IE does not insert script tags via innerHTML.
                common._appendHTML(domNode, 
                    webui.@THEME_JS@._base.proto._stripScripts(props));

                // Evaluate JavaScript.
                setTimeout(function() {
                    // Eval not required for Mozilla/Firefox, but consistent.
                    webui.@THEME_JS@._base.proto._evalScripts(props);
                    if (new Boolean(webui.@THEME_JS@._base.config.parseOnLoad).valueOf() == true) {
                        common._parseMarkup(domNode);
                    }
                    delete(common._props[domNode.id]); // Clean up.
                }, 10);
                // Force _onWidgetReady() function to wait for widget completion.
                common._props[domNode.id] = "_onWidgetReady";
            } else {
                // Static strings must be HTML escaped by default.
                common._appendHTML(domNode,
                    webui.@THEME_JS@._base.proto._escapeHTML(props));
            }
        } else if (props.fragment) {
            // Add fragment -- do not HTML escape.
            common._addFragment(domNode, props.fragment, position, false);
        } else {
            // Create widget.
            common._createWidget(domNode, props, position, false);
        }
        return true;
    },

    /**
     * This function is used to append HTML strings to the innerHTML property of
     * the given domNode.
     * <p>
     * Note: Concatenating innerHTML with new strings does not always work. When
     * adding multiple HTML elements to domNode, we can get into a situation
     * where domNode.innerHTML may not yet contain all the changes made to 
     * the previously added DOM node. Therefore, we shall wrap new strings in an
     * HTML span element so it may be added as a child of domNode.
     * </p>
     *
     * @param {Node} domNode The DOM node to append string.
     * @param {String} html The HTML string to append.
     * @return {boolean} true if successful; otherwise, false.
     * @private
     */
    _appendHTML: function(domNode, html) {
        if (domNode.innerHTML != null && domNode.innerHTML.length > 0) {
            var span = document.createElement('span');            
            span.innerHTML = html;
            domNode.appendChild(span);
        } else {
            // Don't need span when innerHTML is empty.
            domNode.innerHTML = html;
        }
        return true;
    },
    
    /**
     * This function is used to add the context path to a given property.
     * The property could denote an url such as path to an image to be rendered
     * or location of a resource to navigate to when a link is clicked. The
     * property given has to start with a "/". Relative urls that start with 
     * ".." will not have the context path appended. It also checks whether the
     * context path has already been added to the property.
     *
     * @param (String} prefix The context path of the application.
     * @param (String} url The URL to which contextPath is to be appended.
     * @return {String} The property that has the contextPath appended.
     * @private
     */
    _appendPrefix: function(prefix, url) {
        if (prefix == null || url == null) {
            return null;
        }
        return (url.charAt(0) == "/" && url.indexOf(prefix + "/") == -1)
            ? prefix + url : url;
    },
     
    /**
     * This function is used to create and append widgets as children of the
     * given HTML element. See the _createWidget() function.
     * <p>
     * Unlike the _createWidget() function, setTimeout() is called to allow for
     * progressive rendering. Performance testing shows that the download is
     * quicker with the setTimout() call than without. 
     * </p><p>
     * The setTimeout() also helps to display extremely large tables. As an 
     * example, consider a table that displays 1000 rows. Many browsers display 
     * warnings if JavaScript runs longer than 5 seconds. The setTimeout breaks 
     * up the amount of JavaScript run at any given time and completes each 
     * segment within the browser's alloted time.
     * </p>
     *
     * @param {Node} domNode The HTML element to replace.
     * @param {Object} props Key-Value pairs of properties.
     * @config {String} id The widget id.
     * @return {boolean} true if successful; otherwise, false.
     * @private
     */
    _appendWidget: function(domNode, props) {
        // Set timeout to allow for progressive rendering.
        setTimeout(function() {
            var common = webui.@THEME_JS@.widget.common;
            common._createWidget(domNode, props, "last");
            delete(common._props[domNode.id]); // Clean up.
        }, 0);
        return true;
    },

    /**
     * This function is used to create and start a widget. If the parseOnLoad
     * property is true, widget creation is deferred to the window.onLoad event.
     * <p>
     * Typically, an HTML tag is used as a temporary place holder for the newly
     * created widget. This allows widgets to be added to the document in the 
     * proper location. For example, the expected HTML markup to create an image
     * widget looks like so:
     * </p><p><pre>
     * &lt;span id="j_id1"&gt;&lt;/span&gt;
     * &lt;script type="text/javascript"&gt;
     *   webui.@THEME_JS@.widget.common.createWidget('j_id1',{
     *     "id": "form:image1",
     *     "height": "32px",
     *     "width": "32px",
     *     "src": "/example/images/dice1.gif",
     *     "widgetType": "image",
     *   });
     * &lt;/script&gt;
     * </pre></p><p>
     * For better lookup performance, it is assumed that script tags are located
     * immediately after an HTML span element. Ultimately, the newly created
     * widget is added as a child of the HTML span element.
     * </p><p>
     * Performance testing shows this approach is quicker than using the 
     * document.getElementById() function or Level 0 DOM syntax, especially for 
     * large HTML tables. The underlying problem appears to be the extra step
     * taken to convert HTML element IDs to a UTF-16 character encoding.
     * </p>
     *
     * @param {String} elementId The HTML element id to replace.
     * @param {Object} props Key-Value pairs of properties.
     * @config {String} id The ID of the widget to create.
     * @config {String} widgetType The widget type to create.
     * @return {boolean} true if successful; otherwise, false.
     */
    createWidget: function(elementId, props) {
        if (elementId == null || props == null) {
            return false;
        }
        var common = webui.@THEME_JS@.widget.common;

        // Since there is only one window.onLoad event, the ajaxZone tag of JSF
        // Extensions cannot make use of the parseOnLoad feature while 
        // re-rendering widgets. In this case, we shall call 
        // document.getElementById() even though it is not as efficient.
        if (new Boolean(webui.@THEME_JS@._base.config.parseOnLoad).valueOf() == false) {
            var domNode = document.getElementById(elementId);
            var widget = common._createWidget(domNode, props, "last");
            return (widget != null);
        }
        // Store widget properties for window.onLoad event.
        common._props[elementId] = props;
        return true;
    },

    /**
     * This function is used to create and start a widget.
     * <p>
     * Valid values for the position param consist of "before", "last", or null.
     * If the position is "last", the widget is appended as the last child of 
     * the the given domNode. If the position is "last", the widget is appended
     * after the given domNode. If the position is null, the given domNode is 
     * replaced by the resulting HTML.
     * </p>
     *
     * @param {Node} domNode The DOM node to add widget.
     * @param {Object} props Key-Value pairs of properties.
     * @config {String} id The ID of the widget to create.
     * @config {String} widgetType The widget type to create.
     * @param {String} position The widget position within given domNode.
     * @returns {Object} The newly created widget.
     * @private
     */
    _createWidget: function(domNode, props, position) {
        var widget = null;
        if (props == null || props.id == null || props.widgetType == null) {
            console.debug("Error: _createWidget has null props"); // See Firebug console.
            return widget;
        }

        // Destroy previously created widgets, events, etc.
        var common = webui.@THEME_JS@.widget.common;
        common.destroyWidget(props.id);

        // Retrieve required module.
        var _widgetType = "webui.@THEME_JS@.widget."  + props.widgetType;
        webui.@THEME_JS@._dojo.require(_widgetType);
        
        try {
            // Get widget object.
            var obj = webui.@THEME_JS@._dojo.getObject(_widgetType);

            // Instantiate widget. 
            // Note: Dojo mixes attributes, if domNode is provided.
            widget = new obj(props);
        } catch (err) {
            var message = "Error: _createWidget falied for id=" + props.id;
	    message = common._getExceptionString(err, message, true);
            console.debug(message); // See Firebug console.
            return null;
        }

        // Add widget to DOM.
        if (position == "last") {
            // Append widget as the last child of the given DOM node.
            domNode.appendChild(widget._domNode);
        } else if (position == "before") {
            // Append widget before given DOM node.
            domNode.parentNode.insertBefore(widget._domNode, _domNode);
        } else if (domNode.parentNode) {
            // Replace given DOM node with widget.
            domNode.parentNode.replaceChild(widget._domNode, _domNode);
        }
        // Start widget.
        widget._start();
        return widget;
    },

    /**
     * This function is used to detroy a widget.
     * <p>
     * Note: By default, all descendant widgets are destroyed as well.
     * </p>
     *
     * @param {String} id The widget id to destroy.
     * @return {boolean} true if successful; otherwise, false.
     */
    destroyWidget: function(id) {
        if (id == null) {
            return false;
        }
        // Destroy previously created widgets, events, etc.
        var widget = webui.@THEME_JS@.widget.common.getWidget(id);
        if (widget) {
            return widget.destroyRecursive();
        }
        return false;
    },

    /**
     * Return the appropriate event object depending on the browser.
     *
     * @param {Event} event The client side event generated
     * @return {Event} The appropriate event object
     * @private
     */
    _getEvent: function(event) {
        return (event) 
            ? event 
            : ((window.event) ? window.event : null);          
    },
    
    /**
     * Return a formatted string with the information about the exception error.
     * @param {Error} err An exception <code>Error</code> instance.
     * @param {String} synopsis A general message from the error call site.
     * @param {boolean} verbose If true all possible information from the
     * <code>err</code> is formatted into the returned String.
     * @return {String} Formatted information from <code>err</code>.
     * @private
     */
    _getExceptionString: function(err, synopsis, verbose) {
	var msg = (synopsis == null ? "" : synopsis) + "\n";
	msg = msg + (err.name != null ? err.name : "Unnamed Error") + "\n";
	msg = msg + (err.message != null ? err.message : "No message") + "\n";
	if (verbose) {
	    msg = msg + "\n" + 
		(err.fileName != null ? err.fileName : "No filename" + "::") +
		(err.lineNumber != null ? err.lineNumber : "No lineNumber");
	    if (err.stack != null) {
		var stack = err.stack.replace(/()@/g, "\n");
		msg = msg + "\n" + stack;
	    }
	}
	return msg;
    },

    /**
     * This function returns the closest form ancestor of the given DOM node.
     * <p>
     * Note: Traversing the DOM can be slow, but all HTML input elements have a
     * form property. Therefore, avoid using this function when the form can be
     * retrieved via an HTML input element.
     * </p>
     * @param {Node} domNode A DOM node contained in the form.
     * @return {Node} The HTML form element or null if not found.
     * @private
     */
    _getForm: function(domNode) {
        var form = null;
        var obj = domNode;
        while (obj != null) {
            if (obj.tagName == "FORM") {
                form = obj;
                break;
            }
            obj = obj.parentNode;
        }
        return form;
    },

    /**
     * Return the key code of the key which generated the event.
     *
     * @param {Event} event The client side event generated
     * @return {String} The key code of the key which generated the event
     * @private
     */
    _getKeyCode: function(event) {    
        return (event.keyCode) 
            ? event.keyCode 
            : ((event.which) ? event.which : event.charCode);              
    },

    /**
     * Get array containing the absolute left and top position of the given DOM
     * node relative to the browser window.
     *
     * @param {Node} domNode The DOM node compute position for.
     * @return {Array} Array containing the absolute left and top position.
     * @private
     */
    _getPosition: function(domNode) {
        var leftPos = topPos = 0;
        if (domNode.offsetParent) {
            leftPos = domNode.offsetLeft;
            topPos = domNode.offsetTop;
            while ((domNode = domNode.offsetParent) != null) {
                leftPos += domNode.offsetLeft;
                topPos += domNode.offsetTop;
            }
        }
        return [leftPos, topPos];
    },

    /**
     * Get the page height, handling standard noise to mitigate browser
     * differences.
     *
     * @return {int} The page height or null if not available.
     * @private
     */
    _getPageHeight: function() {
        // Mozilla browsers.
        if (window.innerHeight) {
            return window.innerHeight;
        }
        // IE strict mode
        if (document.documentElement.clientHeight > 0) {
            return document.documentElement.clientHeight; 
        }
        // IE quirks mode.
        if (document.body.clientHeight) {
            return document.body.clientHeight;
        }
        return null;
    },

    /**
     * Get the page width, handling standard noise to mitigate browser 
     * differences.
     *
     * @return {int} The page height or null if not available.
     * @private
     */
    _getPageWidth: function() {
        // Mozilla browsers.
        if (window.innerWidth) {
            return window.innerWidth;
        }
        // IE strict mode.
        if (document.documentElement.clientWidth > 0) {
            return document.documentElement.clientWidth; 
        }
        // IE quirks mode.
        if (document.body.clientWidth) {
            return document.body.clientWidth;
        }
        return null;
    },

    /**
     * This function is used to obtain a widget.
     *
     * @param {String} id The widget id.
     * @return {Object} The widget object.
     */
    getWidget: function(id) {
        if (id == null) {
            return null;
        }
        return webui.@THEME_JS@._dijit.byId(id);
    },

    /**
     * Return <code>true</code> if <code>props</code> defines a
     * widget fragment. A widget fragment is a string (typically of HTML)
     * or an object that defines the <code>widgetType</code> ort
     * <code>id</code> properties.
     * @param {Object} props properties that may define a widget fragment.
     * @return {boolean} true of <code>props</code> is a widget fragment
     * else false. If <code>props</code> is null, false is returned.
     * @private
     */
    _isFragment: function(props) {
	return (props != null && (typeof props == "string" ||
	    (typeof props == "object" &&
		(props.widgetType != null && props.widgetType != "") ||
		(props.id != null && props.id != ""))));
    },

    /**
     * This function tests for high contrast mode.
     *  
     * @return {boolean} true if high contrast mode.
     * @private
     */
    _isHighContrastMode:  function() {
        var config = webui.@THEME_JS@._base.config;
        if (config._isHighContrastMode != undefined) {
            return config._isHighContrastMode;
        }

        // Dojo appends the following div tag in body tag for a11y support.
        //
        // <div style="border-style: solid; border-color: red green; border-width: 1px; 
        //  position: absolute; left: -999px; top: -999px; background-image: 
        //  url(.../blank.gif);" id="a11yTestNode">
        // </div>

        // Currently high contrast mode check is supported for firefox and ie on
        // windows. High contrast mode is not supported for Safari.
        if (webui.@THEME_JS@._base.browser._isSafari()) {
            return false;            
        }
        // Get icon properties.
        var props = webui.@THEME_JS@._theme.common._getImage("DOT");
        if (props == null) {
            return false;
        }

        // Create div for testing if high contrast mode is on or images are 
        // turned off.
        var domNode = document.createElement("div"); 
        domNode.style.cssText = 'border: 1px solid;' +
            'border-color:red green;' +
            'position: absolute;' +
            'height: 5px;' +
            'top: -999px;' +
            'background-image: url("' + props.src + '");';

        var body = webui.@THEME_JS@._dojo.body();
        body.appendChild(domNode);

        // Detect the high contrast mode.
        var bImg = null;
        if (window.getComputedStyle) {
            var styleValue = getComputedStyle(domNode, "");
            bImg = styleValue.getPropertyValue("background-image");
        } else {
            bImg = domNode.currentStyle.backgroundImage;
        }
        if (bImg != null && (bImg == "none" || bImg == "url(invalid-url:)" )) {
            config._isHighContrastMode = true; // High Contrast Mode
        } else {
            config._isHighContrastMode = false;
        }

        // IE throws security exception if domNode isn't removed.
        // This allows widgets to be created before the window.onLoad event.
        body.removeChild(domNode);
        return config._isHighContrastMode;    
    },

    /** 
     * Keyboard key code as stored in browser events 
     *
     * @private
     */
    _keyCodes: webui.@THEME_JS@._dojo.keys,
 
    /**
     * This function is used to parse HTML markup in order to create widgets
     * more efficiently. See the createWidget() function.
     *
     * @param {Node} domNode The DOM node containing HTML elements to replace.
     * @return {boolean} true if successful; otherwise, false.
     * @private
     */
    _parseMarkup: function(domNode) {
        if (domNode == null) {
            return false;
        }
        // Note: Using document.getElementById() results in poor perfromance. 
        var nodes = domNode.getElementsByTagName("script");
        var props = webui.@THEME_JS@.widget.common._props;
        var appendWidget = webui.@THEME_JS@.widget.common._appendWidget;
        if (props == null) {
            return false;
        }
        // If dealing with JSF facet fragments, we must search for span 
        // elements because IE removes HTML script tags from strings.
        if (nodes.length == 0) {
            nodes = domNode.getElementsByTagName("span");
            if (nodes.length == 0) {
                return false;
            }
            // Match span id with props.
            for (var i = 0; i < nodes.length; i++) {
                appendWidget(nodes[i], props[nodes[i].id]);
            }
        } else {
            // Match script parent id with props.
            for (var i = 0; i < nodes.length; i++) {
                var parent = nodes[i].parentNode;
                if (parent && parent.tagName.toLowerCase() == "span") {
                    appendWidget(parent, props[parent.id]);
                }
            }
        }
        return true;
    },

    /**
     * Publish an event topic.
     *
     * @param {String} topic The event topic to publish.
     * @param {Object} props Key-Value pairs of properties. This will be applied
     * to each topic subscriber.
     * @return {boolean} true if successful; otherwise, false.
     */
    publish: function(topic, props) {
        // Publish an event for custom AJAX implementations to listen for.
        webui.@THEME_JS@._dojo.publish(topic, props);
        return true;
    },

    /**
     * This function is used to remove child nodes from given DOM node.
     * <p>
     * Note: Child nodes may be cleared using the innerHTML property. However,
     * IE fails when this property is set via the widget's fillInTemplate 
     * function. In this case, DOM nodes shall be removed manually using the 
     * Node APIs.
     * </p>
     * @param {Node} domNode The DOM node to remove child nodes.
     * @return {boolean} true if successful; otherwise, false.
     * @private
     */
    _removeChildNodes: function(domNode) {
        if (domNode == null) {
            return false;
        }
        try {
            domNode.innerHTML = ""; // Cannot be null on IE.
        } catch (e) {
            // Iterate over child nodes.
            while (domNode.hasChildNodes()) {
                var node = domNode.childNodes[0];
                domNode.removeChild(node);
            }
        }
        return true;
    },

    /**
     * This function sleeps for specified milli seconds.
     * 
     * @param {int} delay The amount to delay.
     * @return {boolean} true if current time is greater than the exit time.
     * @private
     */
    _sleep: function(delay) {
        var start = new Date();
        var exitTime = start.getTime() + delay;

        while (true) {
            start = new Date();
            if (start.getTime() > exitTime) {
                return true;
            }
        }
        return false;
    },

    /**
     * Subscribe to an event topic.
     *
     * @param {String} topic The event topic to subscribe to.
     * @param {Object} obj The object in which a function will be invoked, or
     * null for default scope.
     * @param {String|Function} func The name of a function in context, or a 
     * function reference to invoke when topic is published. 
     * @return {boolean} true if successful; otherwise, false.
     */
    subscribe: function(topic, obj, func) {
        webui.@THEME_JS@._dojo.subscribe(topic, obj, func);
        return true;
    },

    /**
     * This function is used to update a widget, HTML fragment, or static
     * string for the given domNode.
     * <p>
     * Note: If the widget associated with props.id already exists, the widget's 
     * setProps() function is invoked with the given props param. If the widget 
     * does not exist, the widget object is instantiated via the _addFragment()
     * function -- all params are passed through.
     * </p><p>
     * See webui.@THEME_JS@.widget.label._setProps for example.
     * </p>
     * @param {Node} domNode The DOM node used to add widget (default).
     * @param {String} id The id of the widget to update, if available.
     * @param {Object} props Key-Value pairs of properties.
     * @param {String} position The position (e.g., "first", "last", etc.) to add widget.
     * @param {boolean} escape HTML escape static strings -- default is true.
     * @return {boolean} true if successful; otherwise, false.
     * @private
     */
    _updateFragment: function(domNode, id, props, position, escape) {
        if (props == null) {
            return false;
        }
        // Ensure props is not a string.
        var common = webui.@THEME_JS@.widget.common;
        var widget = (typeof props != 'string') 
            ? common.getWidget(id) : null;

        // Update widget or add fragment.
        if (widget && typeof widget.setProps == "function") {
            widget.setProps(props);
        } else {
            common._addFragment(domNode, props, position, escape);
        }
        return true;
    }
};
