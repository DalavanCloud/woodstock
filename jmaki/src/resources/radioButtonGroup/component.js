jmaki.namespace("@JMAKI_NS@.radioButtonGroup");

/*
 * jMaki wrapper for Woodstock radioButton Group widget.
 *
 * This widget wrapper looks for the following properties in
 * the "wargs" parameter:
 *
 * value:     Initial data containing an array of radioButton widgets.
 *            The array is assigned to the radioButtonGroup "contents" property.
 * args:      Additional widget properties from the code snippet,
 *            these properties are assumed to be underlying widget
 *            properties and are passed through to the radioButtonGroup widget.
 * publish:   Topic to publish jMaki events to; if not specified, the
 *            default topic is "/woodstock/radioButtonGroup".
 * subscribe: Topic to subscribe to for data model events; if not
 *            specified, the default topic is "/woodstock/radioButtonGroup".
 * args.id:   User specified widget identifier; if not specified, the
 *            jMaki auto-generated identifier is used.
 * 
 * This widget subscribes to the following jMaki events:
 *
 * select     To indicate the radioButton in the group to be checed.
 *            Only one radioButton can be checked (true) in the group.
 * setValues  To reset the set of radioButton widgets in the group contents.
 *
 * This widget publishes the following jMaki events:
 *
 * onSelect   To indicate a radioButton in the group has changed its checked
 *            state.
 */
@JMAKI_NS@.radioButtonGroup.Widget = function(wargs) {

    // Initialize basic wrapper properties.
    this._subscribe = ["/@JS_NAME@/radioButtonGroup"];
    this._publish = "/@JS_NAME@/radioButtonGroup";
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
        var s1 = jmaki.subscribe(this._subscribe + "/select",
            @JS_NS@.widget.common._hitch(this, "_selectCallback"));
        this._subscriptions.push(s1);
        var s2 = jmaki.subscribe(this._subscribe + "/setValues", 
            @JS_NS@.widget.common._hitch(this, "_valuesCallback"));
        this._subscriptions.push(s2);
    }

    // Create Woodstock widget.
    this._create(wargs);
};

// Create Woodstock widget.
@JMAKI_NS@.radioButtonGroup.Widget.prototype._create = function(wargs) {

    // Process the jMaki wrapper properties for a Woodstock radioButtonGroup.
    // Assign properties from "args" object, set id and type, and
    // process "value" object properties.
    var props;
    if (wargs.args) {
	props = wargs.args;
    } else {
	props = {};
    }
    if (typeof props.name == "undefined") {
	props.name = this._wid;
    }
    if (wargs.value && wargs.value instanceof Array) {
	props.contents = this._mapContents(name, wargs.value);
    } else {
	// No data, so add a single radioButton in group's contents.
	var rb_id = this._wid + "_rb1";
	props.contents = [{id: rb_id, widgetType: "radioButton", label: {value: "RadioButton 1", level: 3}, value: "rb1", name: props.name, checked: false}];
    }
    props.id = this._wid;
    props.widgetType = "radioButtonGroup";

    // Create the Woodstock radioButtonGroup widget.
    var span_id = wargs.uuid + "_span";
    @JS_NS@.widget.common.createWidget(span_id, props);
};

// Destroy...
// Unsubscribe from jMaki events
@JMAKI_NS@.radioButtonGroup.Widget.prototype.destroy = function() {
    if (this._subscriptions) {
        for (var i = 0; i < this._subscriptions.length; i++) {
            jmaki.unsubscribe(this._subscriptions[i]);
	} // End of for
    }
};

// Warning: jMaki calls this function using a global scope. In order to
// access variables and functions in "this" object, closures must be used.
@JMAKI_NS@.radioButtonGroup.Widget.prototype.postLoad = function() {
    // Do nothing...
};

// Map the value array of radioButtons to the radioButton group contents array.
// Must add the id, name property from the group, and widgetype properties
// to each radioButton definition in the array.  Add an onChange property
// to call this group wrapper handler so we can publish an onSelect event.
// Returns new array of radioButton objects.
@JMAKI_NS@.radioButtonGroup.Widget.prototype._mapContents = function(name, value) {

    parr = [];
    if (value && value instanceof Array) {
	for (var i = 0; i < value.length; i++) {
	    if (typeof value[i] == "object") {
		var src = value[i];
		var obj = {};
		for (p in src) {
		    obj[p] = src[p];
		}			// End of inner for
		var id = this._wid + "_rb" + i;
                obj.id = id;
                obj.widgetType = "radioButton";
		obj.name =  name;
		obj.onChange = @JS_NS@.widget.common._hitch(this,
			"_selectedCallback", id);
		parr.push(obj);
	    }
	}				// End of outer for
    }
    return (parr);

};

// Callback function to handle Woodstock radioButton onChange event.
// Publish jMaki onSelect event with payload:
//   {widgetId: <group_wid>,
//    topic: {type: "onSelect", targetId: <radiobutton_value>, value: <checked>}}
@JMAKI_NS@.radioButtonGroup.Widget.prototype._selectedCallback = function(rbid) {

    if (rbid) {
        var widget = @JS_NS@.widget.common.getWidget(rbid);
        if (typeof widget == "object") {
            var props = widget.getProps();
            var val = props.value;
            var ckd = props.checked;
            // Format a jMaki onSelect event topic payload
            // and publish the jMaki event.
            var payload = {widgetId: this._wid, topic:
                    {type: "onSelect", targetId: val, value: ckd}};
            var selectedTopic = this._publish + "/onSelect";
            jmaki.publish(selectedTopic, payload);
        }
    }
};

// Callback function to handle jMaki select topic.
// Event payload contains an object specifying the radioButton value in
// the group which should be checked.
//    {value: <radioButton_value>}
// Update radioButtonGroup widget to reset checked state for the radioButton.
@JMAKI_NS@.radioButtonGroup.Widget.prototype._selectCallback = function(payload) {
    if (payload) {
	var widget = @JS_NS@.widget.common.getWidget(this._wid);
	if (widget) {
            if (payload.value) {
                var props = widget.getProps();
		// Iterate over values in the group contents...
                for (var i = 0; i < props.contents.length; i++) {
                    if (props.contents[i].value == payload.value) {
                        var rb_id = props.contents[i].id;
                        var rb_wid = @JS_NS@.widget.common.getWidget(rb_id);
                        if (rb_wid) {
                            rb_wid.setProps({checked: true});
                        }
                        break;
		    }
		}			// End of for
            }
        }
    }
};

// Callback function to handle jMaki setValues topic.
// Event payload contains:
//    {value: [<radioButton_data model>]}
// Update radioButtonGroup widget to replace contents array.
@JMAKI_NS@.radioButtonGroup.Widget.prototype._valuesCallback = function(payload) {
    if (payload) {
        var widget = @JS_NS@.widget.common.getWidget(this._wid);
        if (widget) {
            if (payload.value && payload.value instanceof Array) {
		var props = widget.getProps();
		var name = props.name;
		var cts = this._mapContents(name, payload.value);
                widget.setProps({contents: cts});
            }
	}
    }
};
