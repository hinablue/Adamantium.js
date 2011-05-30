/*
	IdeaSummaryRow UI extension for Adamantium.js
	By Adam Renklint, april 2011
	http://adamrenklint.com
	
	UI.StarRating extends UI.TableViewRow
*/

$.push('UI.IdeaSummaryRow', function (args) {
	args = args || {};
	args.id = args.id || $.id();
	args.height = 'auto';
	args.type = 'IdeaSummaryRow';
	var element = $.create('UI.TableViewRow', args);
	$(element)
		.attr('rating', function (e) {
			$('#' + e.source.id + '.Rating').update({ rating: e.value });
		})
		.attr('idea', function (e) {
			$('#' + e.source.id + '.Headline').attr({ text: e.value });
		})
		.attr('lastChanged', function (e) {
			$('#' + e.source.id + '.Timestamp').update();
		})
	;
	$('UI.View')
		.attr({
			top: 10,
			bottom: 10,
			left: 15,
			right: 15,
			height: 'auto',
			layout: 'absolute'
		})
 		.add('UI.Label', {
 			id: args.id + '.Headline',
 			top: 0,
 			height: 23,
 			highlightedColor: '#fff',
 			font: {
 				fontSize: 20,
 				fontWeight: 'bold'
 			},
 			text: args.idea || ''
 		})
 		.add('UI.Label', {
 			id: args.id + '.Timestamp',
 			top: 35,
 			height: 18,
 			left: 125,
 			textAlign: 'right',
 			color: '#aaa',
 			highlightedColor: '#fff',
 			font: {
 				fontSize: 16
 			},
 			hook: function (o) {
 				$(o)
 					.update(function () {
	 					var timestamp;
	 					var context;
	 					var now = new Date();
	 					var diff = now.valueOf() - $(element).attr('lastChanged');
	 					var minutes = Math.round(diff/1000/60);
	 					var hours = Math.round(diff/1000/60/60);
	 					var days = Math.round(diff/1000/60/60/24);
	 					if (minutes < 1) {
	 						timestamp = 'Only seconds ago';
	 					} else if (minutes < 2) {
	 						timestamp = 'A minute ago';
	 					} else if (minutes < 60) {
	 						timestamp = minutes + ' minutes ago';
	 					} else if (hours < 24) {
	 						if (hours == 1) {
	 							context = 'hour';
	 						} else {
	 							context = 'hours';
	 						}
	 						timestamp = hours + ' ' + context + ' ago';
	 					} else {
	 						if (days == 1) {
	 							context = 'day';
	 						} else {
	 							context = 'days';
	 						}
	 						timestamp = days + ' ' + context + ' ago';
	 					}
	 					$(o).attr('text', timestamp);
 					})
 					.update()
 				;
 				var i = setInterval(function () {
 					$(o).update();
 				}, 1000);
 			}
 		})
 		.add('UI.StarRating', {
 			id: args.id + '.Rating',
 			top: 35,
 			width: 100,
 			touchEnabled: false,
 			rating: args.rating || 0
 		})
 		.appendTo(element)
	;
	return element;
});