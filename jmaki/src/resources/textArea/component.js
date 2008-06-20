jmaki.namespace("@JMAKI_NS@.textArea");

/*
 * jMaki wrapper for Woodstock TextArea widget.
 *
 * This widget wrapper looks for the following properties in the
 * "wargs" parameter:
 *
 * value:     Initial data for the field's text area value:
 *            {
 *             cols: <width_of_area>,
 *             rows: <length_of_area>
 *            }
 *
 *            The "value" property may be added to initialize text.
 *            Other textArea widget properties may be included.
 * args:      Additional widget properties from the code snippet,
 *            these properties are assumed to be underlying widget
 *            properties and are passed through to the textArea widget.
 * publish:   Topic to publish jMaki events to; if not specified, the
 *	      default topic is "/woodstock/textArea".
 * subscribe: Topic to subscribe to for data model events; if not
 *            specified, the default topic is "/woodstock/textArea".
 * id:        User specified widget identifier; if not specified, the
 *            jMaki auto-generated identifier is used.
 *
 * This widget subscribes to the following jMaki events:
 *
 * setValues  Resets the properties of the text area with event payload:
 *	      {value: {value: <updated_text>, ...}}
 *
 * This widget publishes the following jMaki events:
 *
 *	    No events are published.
 */
@JMAKI_NS@.textArea.Widget = function(wargs) {

    // Initialize basic wrapper properties.
    this._subscribe = ["/@JS_NAME@/textArea"];
    this._publish = "/@JS_NAME@/textArea";
    this._subscriptions = [];
    this._wid = wargs.uuid;
    if (wargs.id) {
	this._wid = wargs.id;
    }
    if (wargs.publish) {
	// User supplied a specific topic to publish to.
	this._publish = wargs.publish;
    }
    if (wargs.subscribe) {
	// User supplied one or more specific topics to subscribe to.
	if (typeof wargs.subscribe == "string") {
	    this._subscribe = [];
	    this._subscribe.push(wargs.subscribe);
	} else {
	    this._subscribe = wargs.subscribe;
	}
    }

    // Create Woodstock widget.
    this._create(wargs);
};

// Create Woodstock widget.
@JMAKI_NS@.textArea.Widget.prototype._create = function(wargs) {

    // Process the jMaki wrapper properties for a Woodstock textArea.
    var props = {};
    if (wargs.args != null) {
	@JS_NS@._base.proto._extend(props, wargs.args);
    }
    if (wargs.value != null) {
	@JS_NS@._base.proto._extend(props, wargs.value);
    }

    // Subscribe to jMaki events
    for (var i = 0; i < this._subscribe.length; i++) {
	var s1 = jmaki.subscribe(this._subscribe + "/setValues",
	    @JS_NS@.widget.common._hitch(this, "_valuesCallback"));
	this._subscriptions.push(s1);
    }

    // Add our widget id and type.
    props.id = this._wid;
    props.widgetType = "textArea";

    // Create the Woodstock textArea widget.
    var span_id = wargs.uuid + "_span";
    @JS_NS@.widget.common.createWidget(span_id, props);

};

// Unsubscribe from jMaki events and destroy Woodstock widget.
@JMAKI_NS@.textArea.Widget.prototype.destroy = function() {

    if (this._subscriptions) {
	for (var i = 0; i < this._subscriptions.length; i++) {
	    jmaki.unsubscribe(this._subscriptions[i]);
	} // End of for
    }
    @JS_NS@.widget.common.destroyWidget(this._wid);

};

// Warning: jMaki calls this function using a global scope. In order to
// access variables and functions in "this" object, closures must be used.
@JMAKI_NS@.textArea.Widget.prototype.postLoad = function() {
    // Do nothing...
};

// Callback function to handle jMaki setValues topic.
// Event payload contains:
//    {value: {<textArea widget properties}}
// Update textArea widget to replace options array.
@JMAKI_NS@.textArea.Widget.prototype._valuesCallback = function(payload) {

    if (payload) {
	var widget = @JS_NS@.widget.common.getWidget(this._wid);
	if (widget) {
	    if (payload.value != null) {
		widget.setProps(payload.value);
	    }
	}
    }

};
