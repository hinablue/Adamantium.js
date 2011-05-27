/*
 * Adamatium.js for Titanium
 * by Adam Renklint in march-april 2011
 * Copyright (c) 2011 Adam Renklint
 * http://adamrenklint.com
 * Licensed under the MIT
 *
 * Based on TiFramework for Titanium
 * Copyright 2010, Rick Blalock
 * Licensed under the MIT
 * Copyright (c) 2010 Rick Blalock
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

//	TODO:	Add filter prototype method, that appends and manipulates $.selector

function $(context) {
	return new $.core(context);
};

var global = ( function () { return this; }).call();

/*
	Global base component namespaces
*/
global.SCR = {};
global.LOGIC = {};
global.LIB = {};

/*
	Core maps
*/
$.maps = {
	byID: {},
	byType: {},
	eventsByID: {},
	eventsByType: {},
	shorthandMethods: []
};

$.core = $.prototype = function (context) {

	// Make the context accessible
	this.context = context;

	// Return the object even if no context is provided
	if (!this.context) {
		return this;
	}

	/*
		Track the element
		@param [required] element (object)
		@param [optional] options (object)
	*/
	
	$.core.track = function (element, options) {
		if (element && !element.tracker) {
			element.tracker = '#' + $.id() + '.';
			options = options || {};
			options.dontTrackType = options.dontTrackType || false;
			if (element.id) {
				$.maps.byID[element.id] = element;
			}		
			if (element.type && !options.dontTrackType) {
				if (!$.maps.byType[element.type]) {
					$.maps.byType[element.type] = [];
				}
				$.maps.byType[element.type].push(element);
			}
			if (typeof element.type == 'string' && typeof $.maps.eventsByType[':' + element.type] !== 'undefined') {
		    	for (var event in $.maps.eventsByType[':' + element.type]) {
		    		if ($.maps.eventsByType[':' + element.type].hasOwnProperty(event)) {
		    			for (var i = 0, l = $.maps.eventsByType[':' + element.type][event].length; i < l; i++) {
							$(element).bind(event, $.maps.eventsByType[':' + element.type][event][i]);
		    			}
		    		}
		    	}
			}		
		}
	};
	
	/*
		Create element
		@param [required] type (string) "UI.TableView"
		@param [optional] opts (object)
	*/
	$.core.createElement = function (type, opts) {
		if (typeof type !== 'undefined') {
			opts = opts || {};
			type = type.split('.');
			var element = Ti[type[0]]['create' + type[1]](opts);
			element.type = opts.type || type[1];
			// TODO: add parent object or reference, for propagation of events
			$.core.track(element);
			element.addEventListener('attribute_id', function (e) {
				$.core.track(e.source, { dontTrackType: true });
			});
			if (typeof opts.hook == 'function') {
				element._postConstructorHook = opts.hook;
				opts.hook(element);
			}
			return element;
		}
	};
	
	/*
		Process the context
	*/
	if (typeof this.context === 'string') {
		$.selector = this.context;
		if (this.context.indexOf('#') === 0) {
			var id = this.context.split('#')[1];
			if ($.maps.byID[id]) {
				this.context = [this[0] = $.maps.byID[id]];
			}
		} else if (this.context.indexOf(':') === 0) {
			if ($.maps.byType[this.context.split(':')[1]]) {
				this.context = $.maps.byType[this.context.split(':')[1]];
			}
		} else if (this.context.indexOf('.') > 0) {
			this.context = [this[0] = $.core.createElement(this.context)];
		} else {
			switch(this.context) {
				case 'Screen':
					this.context = [this[0] = Ti.UI.createWindow({ id: $.id(), type: 'Screen' })];
					break;
				case 'Logic':
					this.context = [this[0] = Ti.UI.createView({ id: $.id(), type: 'Logic' })];
					break;
				case 'Library':
					this.context = [this[0] = Ti.UI.createView({ id: $.id(), type: 'Library' })];
					break;
			}
			$.selector = '#' + this.context[0].id;
			$.core.track(this.context[0]);
		}
	} else if (typeof this.context === 'object') {
		if (typeof this.context.context !== 'undefined' && typeof this.context.context[0] !== 'undefined') {
			$.selector = '#' + this.context.context[0].id;
			this.context = [this[0] = this.context.context[0]];
		} else if (typeof this.context.context !== 'undefined') {
			$.selector = '#' + this.context.context.id;
			this.context = [this[0] = this.context.context];
		} else if (typeof this.context !== 'undefined' && typeof this.context[0] !== 'undefined') {
			$.selector = '#' + this.context[0].id;
			this.context = [this[0] = this.context[0]];
		} else if (typeof this.context !== 'undefined') {
			$.selector = '#' + this.context.id;
			this.context = [this[0] = this.context];
		}
	}
	return this;
};

// Re-assign the Tiframework prototype to the main namespace for access
$.prototype = $;

/*
	Extend the framework method namespace
	@param [required] name (string)
	@param [required] extension (function)
*/
$.prototype.extend = function(name, extension) {
	if (name && extension) {
		$.prototype[name] = $.core.prototype[name] = function(first, second, third, fourth, fifth) {
			if (typeof this.context == 'object') {
				var component,
					context, 
					newContext = [],
					pushed = '';
				for (var i = 0, l = this.context.length; i < l; i++) {
					component = this.context[i];
					if (typeof first !== 'undefined' && typeof second !== 'undefined' && typeof third !== 'undefined' && typeof fourth !== 'undefined' && typeof fifth !== 'undefined') {
						context = extension(component, first, second, third, fourth, fifth);
					} else if (typeof first !== 'undefined' && typeof second !== 'undefined' && typeof third !== 'undefined' && typeof fourth !== 'undefined') {
						context = extension(component, first, second, third, fourth);
					} else if (typeof first !== 'undefined' && typeof second !== 'undefined' && typeof third !== 'undefined') {
						context = extension(component, first, second, third);
					} else if (typeof first !== 'undefined' && typeof second !== 'undefined') {
						context = extension(component, first, second);
					} else if (typeof first !== 'undefined') {
						context = extension(component, first);
					} else {
						context = extension(component);
					}
					if (context.context && typeof context.context == 'object') {
						for (var i2 = 0, l2 = context.context.length; i2 < l2; i2++) {
							if (pushed.indexOf(context.context[i2].id) < 0) {
								newContext.push(context.context[i2]);
								pushed = pushed + context.context[i2].id;
							}
						}
					} else if (typeof context == 'object') {
						if (pushed.indexOf(context.id) < 0) {
							newContext.push(context);
							pushed = pushed + context.id;
						}
					} else {
						return context;
					}
				}
				if (newContext.length > 0) {
					if (this.context !== newContext) {
						this.context = newContext;
						//delete $.selector;
					}
				}
			} else if (typeof this.context == 'string') {
				if (name == 'bind' || name == 'attr' && typeof first == 'string' && typeof second == 'function') {
					if (this.context.indexOf(':') === 0) {
						if (!$.maps.eventsByType[this.context]) {
							$.maps.eventsByType[this.context] = {};
						}
						if (!$.maps.eventsByType[this.context][first]) {
							$.maps.eventsByType[this.context][first] = [];
						}
						$.maps.eventsByType[this.context][first].push(second);
					}
				} else if (typeof first == 'function') {
					for (var i3 = 0, l3 = $.maps.shorthandMethods.length; i3 < l3; i3++) {
						if ($.maps.shorthandMethods[i3] == name) {
							if (this.context.indexOf(':') === 0) {
								if (!$.maps.eventsByType[this.context]) {
									$.maps.eventsByType[this.context] = {};
								}
								if (!$.maps.eventsByType[this.context][name]) {
									$.maps.eventsByType[this.context][name] = [];
								}
								$.maps.eventsByType[this.context][name].push(first);
							}
						}
					}
				}
			}
			return this;
		};
	}
	return this;
};

/*
	Extend shorthand method
	@param [required] shorthand (string)
*/
$.prototype.shorthand = function (shorthand) {
	if (shorthand) {
		$.maps.shorthandMethods.push(shorthand);
		$.extend(shorthand, function (component, first, second, third, fourth, fifth) {
			if (first && typeof first == 'function') {
				$(component).bind(shorthand, first);
			} else if (typeof component[shorthand] == 'function') {
				if (typeof first !== 'undefined' && typeof second !== 'undefined') {
					component[shorthand](first, second);
				} else if (typeof first !== 'undefined') {
					component[shorthand](first);
				} else { 
					component[shorthand]();
				}
			} else {
				first = first || {};
				$(component).trigger(shorthand, first);
			}
		    return component;
		});
	}
	return this;
};

/*
*/
$.prototype.push = function (namespace, constructor) {
	if (typeof namespace == 'string' && typeof constructor == 'function') {
		var name = namespace.split('.');
		if (typeof name[0] == 'string' && typeof name[1] == 'string') {
			Ti[name[0]]['create' + name[1]] = constructor;
		}
		
	}
};


$.prototype.pull = function (namespace) {
	if (typeof namespace == 'string' && namespace.indexOf('.') > 0) {
		Ti.include(namespace + '.js');
	}
};

/*
	Require and include a component
	@param component (string) "SCR.ScreenName"
	
	Require and include multiple components
	@param components (array)
*/
$.prototype.require = function (file) {
	var path, base;
	if (file && typeof file == 'string') {
		path = file.split('.');
		Ti.include(file + '.js');
		base = global[path[0]];
		base[path[1]].trigger('install').trigger('load').trigger('observers');	
	} else if (file && typeof file == 'object') {
		for (var i = 0, l = file.length; i < l; i++) {
			path = file[i].split('.');
			Ti.include(file[i] + '.js');
			base = global[path[0]];
			base[path[1]].trigger('install').trigger('load').trigger('observers');
		}	
	}
};

/*
	Setup database and methods for Logic data controllers
*/
$.DB = Ti.Database.open(Ti.App.id);
$.prototype.execute = $.DB.execute;
/*
	Drop table, if it exists
	@param [required] table (string)
*/
$.prototype.drop = function (table) {
	if (table) {
		$.execute('DROP TABLE IF EXISTS ' + table);
	}
};
/*
	Generate random MD5 hash ID
*/
$.prototype.id = function () {
	var randomCharacters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
	var randomStringLength = Math.floor(Math.random() * randomCharacters.length);
	var randomString = '';
	for (var i = 0; i < randomStringLength; i++) {
	    randomString += randomCharacters[Math.floor(Math.random() * randomCharacters.length)];
	}
	return Ti.Utils.md5HexDigest(randomString);
};

$.extend('append', function (component, type, opts) {
	/*
		Append an element to matched set context
		@param [required] type (string) "UI.View"
		@param [optional] opts (object)
	*/
	if (component && type) {
		opts = opts || {};
		$.core.createElement(type, opts);
	}
    return component;
});

$.extend('add', function (component, type, opts) {
	/*
		Add an element to matched set context		
		@param [required] type (string) "UI.View"
		@param [optional] opts (object)
	*/
	if (component && type) {
		opts = opts || {};
		var element = $.core.createElement(type, opts);
		if (typeof(element.context) == 'undefined') {
			component.add(element);
		} else {
			component.add(element.context);
		}
	}
    return component;
});

$.extend('bind', function (component, event, callback) {
	/*
		Bind event callback to matched set context	
		@param [required] event (string)
		@param [required] callback (function)
	*/
	if (component && event && callback) {
		if (!$.maps.eventsByID[component.id]) {
			$.maps.eventsByID[component.id] = {};
		}
		if (!$.maps.eventsByID[component.id][event]) {
			$.maps.eventsByID[component.id][event] = [];
		}
		$.maps.eventsByID[component.id][event].push(callback);
		if ($.selector.indexOf(':') === 0) {
			if (!$.maps.eventsByType[$.selector]) {
			    $.maps.eventsByType[$.selector] = {};
			}
			if (!$.maps.eventsByType[$.selector][name]) {
			    $.maps.eventsByType[$.selector][name] = [];
			}
			$.maps.eventsByType[$.selector][name].push(first);
		}
		component.addEventListener(event, function (e) {
			var eid = e.source.id;
			if (typeof e.orientation !== 'undefined') { eid = eid + '#' + e.orientation; }
			if (typeof e.type !== 'undefined') { eid = eid + '#' + e.type; }
			if (typeof e.timestamp !== 'undefined') { eid = eid + '#' + e.timestamp; }
			if (typeof e.cancelled !== 'undefined') { eid = eid + '#' + e.cancelled; }
			if (typeof e.error !== 'undefined') { eid = eid + '#' + e.error; }
			if (typeof e.success !== 'undefined') { eid = eid + '#' + e.success; }
			if (typeof e.uid !== 'undefined') { eid = eid + '#' + e.uid; }
			if (typeof e.currentPage !== 'undefined') { eid = eid + '#' + e.currentPage; }
			if (typeof e.globalPoint !== 'undefined' && typeof e.globalPoint.x !== 'undefined') { eid = eid + '#' + e.globalPoint.x; }
			if (typeof e.globalPoint !== 'undefined' && typeof e.globalPoint.y !== 'undefined') { eid = eid + '#' + e.globalPoint.y; }
			if (typeof e.view !== 'undefined') { eid = eid + '#' + e.view; }
			if (typeof e.x !== 'undefined') { eid = eid + '#' + e.x; }
			if (typeof e.y !== 'undefined') { eid = eid + '#' + e.y; }
			if (typeof e.duration !== 'undefined') { eid = eid + '#' + e.duration; }
			if (typeof e.message !== 'undefined') { eid = eid + '#' + e.message; }
			if (typeof e.entering !== 'undefined') { eid = eid + '#' + e.entering; }
			if (typeof e.loadstate !== 'undefined') { eid = eid + '#' + e.loadstate; }
			if (typeof e.column !== 'undefined') { eid = eid + '#' + e.column; }
			if (typeof e.columnIndex !== 'undefined') { eid = eid + '#' + e.columnIndex; }
			if (typeof e.rowIndex !== 'undefined') { eid = eid + '#' + e.rowIndex; }
			if (typeof e.selectedValue !== 'undefined') { eid = eid + '#' + e.selectedValue; }
			if (typeof e.value !== 'undefined') { eid = eid + '#' + e.value; }
			if (typeof e.direction !== 'undefined') { eid = eid + '#' + e.direction; }
			if (typeof e.available !== 'undefined') { eid = eid + '#' + e.available; }
			if (typeof e.volume !== 'undefined') { eid = eid + '#' + e.volume; }
			if (typeof e.level !== 'undefined') { eid = eid + '#' + e.level; }
			if (typeof e.state !== 'undefined') { eid = eid + '#' + e.state; }
			if (typeof e.networkType !== 'undefined') { eid = eid + '#' + e.networkType; }
			if (typeof e.networkTypeName !== 'undefined') { eid = eid + '#' + e.networkTypeName; }
			if (typeof e.online !== 'undefined') { eid = eid + '#' + e.online; }
			if (typeof e.heading !== 'undefined') { eid = eid + '#' + e.heading; }
			if (typeof e.provider !== 'undefined') { eid = eid + '#' + e.provider; }
			if (typeof e.decelerating !== 'undefined') { eid = eid + '#' + e.decelerating; }
			if (typeof e.dragging !== 'undefined') { eid = eid + '#' + e.dragging; }
			if (typeof e.detail !== 'undefined') { eid = eid + '#' + e.detail; }
			if (typeof e.index !== 'undefined') { eid = eid + '#' + e.index; }
			if (typeof e.searchMode !== 'undefined') { eid = eid + '#' + e.searchMode; }
			if (typeof e.iteration !== 'undefined') { eid = eid + '#' + e.iteration; }
			if (typeof e.range !== 'undefined' && typeof e.range.location !== 'undefined') { eid = eid + '#' + e.range.location; }
			if (typeof e.range !== 'undefined' && typeof e.range.length !== 'undefined') { eid = eid + '#' + e.range.length; }
			eid = Ti.Utils.md5HexDigest(eid);
			if ($.eid !== eid) {
				if ($.maps.eventsByID[e.source.id] && $.maps.eventsByID[e.source.id][e.type]) {
					e.target = '#' + e.source.id;
					$.eid = eid;
					for (var i2 = 0, l2 = $.maps.eventsByID[e.source.id][e.type].length; i2 < l2; i2++) {
						$.maps.eventsByID[e.source.id][e.type][i2](e);
					}
				}
			}
		});
	}
    return component;
});

$.extend('trigger', function (component, event, e) {
	/*
		Trigger event on matched set context
		@param [required] event (string)
		@param [optional] opts (object)
	*/
	if (component && event) {
		e = e || {};
		e.type = e.type || event;
		e.source = component;
		e.selector = $.selector || null;
		e.target = '#' + component.id;
		if ($.maps.eventsByID[component.id]) {
			if ($.maps.eventsByID[component.id][event]) {
				for (var i = 0, l = $.maps.eventsByID[component.id][event].length; i < l; i++) {
					$.maps.eventsByID[component.id][event][i](e);
				}
			}
				/*
				if ($.maps.eventsByID[component.id]['cp428y7r8924jrrx2pasdu']) {
					for (var i2 = 0, l2 = $.maps.eventsByID[component.id]['cp428y7r8924jrrx2pasdu'].length; i2 < l2; i2++) {
						$.maps.eventsByID[component.id]['cp428y7r8924jrrx2pasdu'][i2](e);
					}
				}
				*/
		}
	}
    return component;
});

$.extend('attr', function (component, attribute, second) {
	/*
		Return attribute from matched set context
		@param [required] attribute (string)
		
		Change multiple attributes on matched set context
		@param [required] map (object)
		
		Change an attribute on matched set context
		@param [required] attribute (string)
		@param [required] value (string/object/array)
		
		Bind callback to attribute changes on matched set context
		@param [required] attribute (string)
		@param [required] callback (function)
	*/
	if (component && typeof attribute !== 'undefined' && typeof attribute == 'object') {
	    for (var key in attribute) {
	    	if (attribute.hasOwnProperty(key)) {
	    		$(component).attr(key, attribute[key]);
	    	}
	    }
	} else if (component && typeof attribute !== 'undefined' && typeof second !== 'undefined') {
	    if (attribute !== 'type') {
	    	if (typeof second === 'function') {
	    		$(component).bind('attribute_' + attribute, second);
	    	} else {
	    		if (typeof second !== 'undefined') {
	   			 	// TODO: move this to $.scrubSelector()
					if (typeof second == 'string' && second.indexOf('#') === 0 && $.maps.byID[second.split('#')[1]]) {
						second = $.maps.byID[second.split('#')[1]];
					}
					if (component[attribute] !== second) {
	    				var event = {
	    					type: 'attribute',
	    					attribute: attribute,
	    					value: second,
	    					previous: component[attribute]
	    				};
	    				// TODO: keep track of previous state for each property, to enable on/off switchable states or keep all applied arguments in a timeline, to reapply when conditions change
	    				component[attribute] = second;
	    				$(component).trigger('attribute_' + attribute, event);			
					}
	    		}
	    	}
	    }
	} else if (component && attribute) {
	   	//delete $.selector;
	    if (component[attribute]) {
	    	return component[attribute];
	    } else {
	    	return '';
	    }
	}
    return component;
});

$.extend('appendTo', function (component, element) {
	/*
		Append matched set context to element		
		@param [required] element (object)
	*/
	if (component && element && typeof element == 'string' && element.indexOf('#') === 0) {
		var id = element.split('#')[1];
		if ($.maps.byID[id]) {
			$.maps.byID[id].add(component);
		}
	} else if (element && element.context && typeof element.context[0] == 'object') {
		element.context[0].add(component);
	}  else if (element && typeof element.context == 'object') {
		element.context.add(component);
	} else if (typeof element == 'object') {
		element.add(component);
	}
    return component;
});

$.extend('tab', function (component, opts) {
	/*
		Create and add tab to mathed set context
		# This method only applies to UI.TabGroup
		@param [required] opts (object) Only opts.screen is required
	*/
	if (component && component.type == 'TabGroup' && opts && opts.screen) {
		if (typeof opts.screen !== 'undefined' && typeof opts.screen.context !== 'undefined' && typeof opts.screen.context[0] !== 'undefined') {
			opts.window = opts.screen.context[0];
		} else if (typeof opts.screen !== 'undefined' && typeof opts.screen.context !== 'undefined') {
			opts.window = opts.screen.context;
		} else if (typeof opts.screen !== 'undefined') {
			opts.window = opts.screen;
		}
		opts.title = opts.title || opts.window.title;
		var tab = $.core.createElement('UI.Tab', opts);
		component.addTab(tab);
	}
    return component;
});

$.extend('enable', function (component) {
	/*
		Change attribute enabled to true on matched set context
	*/
	if (component) {
		component.enabled = true;
	}
    return component;
});

$.extend('disable', function (component) {
	/*
		Change attribute enabled to false on matched set context
	*/
	if (component) {
		component.enabled = false;
	}
    return component;
});

$.extend('empty', function (component, attr) {
	/*
		Empty a components attribute
		@param [required] attr (string)
	*/
	if (component && attr) {
		component[attr] = '';
	}
    return component;
});

$.extend('navigate', function (component, screen, opts) {
	/*
		Navigate matched set context to defined screen
		This method only applies to UI.TabGroup
		@param [required] screen (object)
		@param [optional] opts (object)
	*/
	if (component && component.type == 'TabGroup' && screen) {
		opts = opts || {};
		opts.animated = opts.animated || true;
		var activeTab = component.activeTab;
		activeTab.open(screen.context[0], opts);
	}
    return component;
});

$.extend('module', function (component, module) {
	/*
		Faux method for implying package of module
		This is necessary for each element module used in each component
		@param [optional] module (object/array)
	*/
	if (component) {
	}
    return component;
});

$.extend('rows', function (component, data, process, type) {
	/*
		Populate matched set context with rows
		This method only applies to UI.TableView
		@param [required] data (object)
		@param [optional] process (function)
		@param [optional] type (string)
	*/
	if (component && component.type == 'TableView' && data) {
		type = type || 'UI.TableViewRow';
		if (!process || (typeof process) !== 'function') {
			process = function (row) {
				return row;
			};
		}
		var rows = [];
		var row, args;
		rows[0] = Ti.UI.createTableViewSection();
		for (var i2 = 0, l2 = data.length; i2 < l2; i2++) {
			args = process(data[i2]);
			if (component.selectedRowBackgroundColor) {
				args.selectedBackgroundColor = component.selectedRowBackgroundColor;
			}
			if ($.maps.byID[args.id]) {
				row = $.maps.byID[args.id];
	    		for (var key in args) {
	    			if (args.hasOwnProperty(key)) {
	    				$(row).attr(key, args[key]);
	    			}
	    		}
			} else {
				row = $.core.createElement(type, args);
			}
			rows[0].add(row);
		}
		component.setData(rows);
	}
    return component;
});

$.extend('unselect', function (component) {
	/*
		Unselect any selected row on TableView
	*/
	if (component && component.type == 'TableView') {
		if (typeof component.selectedRow === 'number') {
			component.deselectRow(component.selectedRow);
		}
	}
    return component;
});

$.extend('scrollTo', function (component, x, y) {
	/*
		Scroll to X and Y
		This method only applies to UI.ScrollView
		@param [required] x (number)
		@param [required] y (number)
	*/
	if (component && component.type == 'ScrollView' && typeof x == 'number' && typeof y == 'number') {
		component.scrollTo(x, y);
	}
    return component;
});

$.extend('scrollToTop', function (component) {
	/*
		Scroll to top
		This method only applies to UI.TableView and UI.ScrollView
	*/
	if (component && component.type == 'TableView') {
		component.scrollToTop();
	} else if (component && component.type == 'ScrollView') {
		$(component).scrollTo(0, 0);
	}
    return component;
});

$.extend('hook', function (component, hook) {
	/*
		Attach hook to component
		@param [required] hook (function)
		@param [optional] options (object)
	*/
	if (component && typeof hook == 'function') {
		component.hook = hook;
	} else if (component && typeof component.hook == 'function') {
		var options = {};
		if (typeof (hook) == 'object') {
			options = hook;
		}
		component.hook(options);
		delete component.hook;
	}
    return component;
});

/*
	Shorthand events
*/
$.shorthand('animate');
$.shorthand('beforeload');
$.shorthand('blur');
$.shorthand('change');
$.shorthand('click');
$.shorthand('close');
$.shorthand('complete');
$.shorthand('dblclick');
$.shorthand('deselect');
$.shorthand('deselectRow');
$.shorthand('doubletap');
$.shorthand('error');
$.shorthand('exit');
$.shorthand('focus');
$.shorthand('hide');
$.shorthand('index');
$.shorthand('insert');
$.shorthand('install');
$.shorthand('kill');
$.shorthand('load');
$.shorthand('move');
$.shorthand('observers');
$.shorthand('open');
$.shorthand('refresh');
$.shorthand('run');
$.shorthand('scroll');
$.shorthand('scrollEnd');
$.shorthand('select');
$.shorthand('selected');
$.shorthand('show');
$.shorthand('singetap');
$.shorthand('stage');
$.shorthand('swipe');
$.shorthand('touchcancel');
$.shorthand('touchend');
$.shorthand('touchmove');
$.shorthand('touchstart');
$.shorthand('twofingertap');
$.shorthand('update');