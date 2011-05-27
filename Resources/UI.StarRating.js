/*
	StarRating UI extension for Adamantium.js
	By Adam Renklint, april 2011
	http://adamrenklint.com
	
	UI.StarRating extends UI.View, takes other arguments and adds custom methods
	
	.update( rating [string] -required )
	Updates the StarRating with the new value and fires the "update" event
	
	id				string	optional	[MD5 hash]
	top				number	optional	0
	bottom			number	optional	0
	left			number	optional	0
	right			number	optional	0
	width			number	optional	320
	height			number	optional
	touchEnabled	boolean	optional	true
*/

$.push('UI.StarRating', function (args) {
	args = args || {};
	args.id = args.id || $.id();
	args.width = args.width || 320;
	var base = args.width/19;
	var element = Ti.UI.createView({ 
		id: args.id,
		top: args.top || 0,
		bottom: args.bottom || 0,
		height: args.height || base * 3,
		touchEnabled: args.touchEnabled || true
	});
	if (typeof args.touchEnabled == 'boolean') {
		element.touchEnabled = args.touchEnabled;
	}
	if (args.left) { element.left = args.left; }
	if (args.right) { element.right = args.right; }
	element.update = function (args) {
		if (typeof args.rating == 'number') {
			if (args.rating > 4) {
				$('#' + element.id + '.child-5').attr('opacity', 1);
			} else {
				$('#' + element.id + '.child-5').attr('opacity', 0.3);			
			}
			if (args.rating > 3) {
				$('#' + element.id + '.child-4').attr('opacity', 1);
			} else {
				$('#' + element.id + '.child-4').attr('opacity', 0.3);			
			}
			if (args.rating > 2) {
				$('#' + element.id + '.child-3').attr('opacity', 1);
			} else {
				$('#' + element.id + '.child-3').attr('opacity', 0.3);			
			}
			if (args.rating > 1) {
				$('#' + element.id + '.child-2').attr('opacity', 1);
			} else {
				$('#' + element.id + '.child-2').attr('opacity', 0.3);			
			}
			if (args.rating > 0) {
				$('#' + element.id + '.child-1').attr('opacity', 1);
			} else {
				$('#' + element.id + '.child-1').attr('opacity', 0.3);			
			}
			if (!args.silent) {
				$(element).trigger('update', {
					value: args.rating,
					source: element
				});
			}
		}
	};
	var offset = 0;
	for (var i = 1, l = 6; i < l; i++) {
		$(element).add('UI.ImageView', {
			left: offset,
			width: base * 3,
			opacity: 0.3,
			image: 'star.png',
			id: args.id + '.child-' + i,
			value: i,
			hook: function (o) {
				$(o).click(function (e) {
					if ($(element).attr('touchEnabled')) {
						$(element).update({ rating: e.source.value });
					}
				});
			}
		});
		offset = offset + base * 4;
	}
	if (typeof args.rating == 'number') {
		$(element).update({ rating: args.rating });
	}
	return element;
});