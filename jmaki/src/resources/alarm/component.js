jmaki.namespace("@JMAKI_NS@.alarm");

/*
 * jMaki wrapper for Woodstock Alarm widget.
 *
 * This widget wrapper looks for the following properties in
 * the "wargs" parameter:
 *
 * value:     Initial data with the following properties:
 *            {type: <ok|down|minor|major|critical>,
 *             text: <text description>}
 *            The type is used to retrieve an icon from the theme
 *            to display as the alarm image.  The text property
 *            is optional.
 * args:      Additional widget properties from the code snippet,
 *            these properties are assumed to be underlying widget
 *            properties and are passed through to the alarm widget.
 * publish:   Topic to publish jMaki events to; if not specified, the
 *            default topic is "/woodstock/alarm".
 * subscribe: Topic to subscribe to for data model events; if not
 *            specified, the default topic is "/woodstock/alarm".
 * args.id:   User specified widget identifier; if not specified, the
 *            jMaki auto-generated identifier is used.
 * 
 * This widget subscribes to the following jMaki events:
 *
 * setValues  Reset the alarm widget value properties.  Useful to
 *            update the alarm text when it contains a count of
 *            the number of alarms of the given type.
 *
 * This widget publishes the following jMaki events:
 *
 *            No specific events are published.
 */
@JMAKI_NS@.alarm.Widget = function(wargs) {

    // Initialize basic wrapper properties.
    this._subscribe = ["/@JS_NAME@/alarm"];
    this._publish = "/@JS_NAME@/alarm";
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

    // Subscribe to jMaki events
    for (var i = 0; i < this._subscribe.length; i++) {
        var s1 = jmaki.subscribe(this._subscribe + "/setValues",
            @JS_NS@.widget.common._hitch(this, "_valuesCallback"));
        this._subscriptions.push(s1);
    }

    // Create Woodstock widget.
    this._create(wargs);
};

// Create Woodstock widget.
@JMAKI_NS@.alarm.Widget.prototype._create = function(wargs) {

    // Process the jMaki wrapper properties for a Woodstock alarm.
    // Value must contain an array of Options objects.
    var props;
    if (wargs.args) {
	props = wargs.args;
    } else {
	props = {};
    }
    if (wargs.value && typeof wargs.value == "object") {
	for (p in wargs.value) {
	    props[p] = wargs.value[p];
	}			// End of for
    } else {
	// No data. Define simple dummy alarm with text.
	props.type = "ok";
	props.text = "OK";
    }

    // Add our widget id and type.
    props.id = this._wid;
    props.widgetType = "alarm";

    // Create the Woodstock alarm widget.
    var span_id = wargs.uuid + "_span";
    @JS_NS@.widget.common.createWidget(span_id, props);
};

// Destroy...
// Unsubscribe from jMaki events
@JMAKI_NS@.alarm.Widget.prototype.destroy = function() {
    if (this._subscriptions) {
        for (var i = 0; i < this._subscriptions.length; i++) {
            jmaki.unsubscribe(this._subscriptions[i]);
	} // End of for
    }
};

// Warning: jMaki calls this function using a global scope. In order to
// access variables and functions in "this" object, closures must be used.
@JMAKI_NS@.alarm.Widget.prototype.postLoad = function() {
    // Do nothing...
}

// Callback function to handle jMaki setValues topic.
// Event payload contains:
//    {value: {type: <type>, text: <text>, textPosition: <left|right>}}
// Update alarm widget.  Typically used to reset the text associated
// with the alarm; e.g., when it contains a count of that type of alarm.
@JMAKI_NS@.alarm.Widget.prototype._valuesCallback = function(payload) {

    var widget = @JS_NS@.widget.common.getWidget(this._wid);
    if (typeof widget == "object") {
	if (typeof payload.value == "object") {
	    for (p in payload.value) {
		props[p] = payload.value[p];
	    }	// End of for
	    widget.setProps(props);
        }
    }
};
