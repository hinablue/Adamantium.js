$.push('UI.SimpleButton', function (args) {
	args = args || {};
	args.id = args.id || $.id();
	var element = Ti.UI.createLabel({ 
		id: args.id,
		text: args.title || '',
		textAlign: 'center',
		backgroundColor: '#fff',
		borderRadius: 15,
		borderWidth: 1.2,
		borderColor: '#777',
		color: '#777',
		font: {
			fontWeight: 'bold',
			fontSize: 16
		},
		top: args.top || null,
		bottom: args.bottom || null,
		height: args.height || 50,
		width: args.width || 135
	});
	if (args.float) {
		$(element).attr(args.float, 0);
	}
	$(element)
		.touchstart(function (e) {
			$(e.source).attr('backgroundColor', '#aaa');
			$(e.source).attr('borderColor', '#888');
			$(e.source).attr('color', '#fff');
		})
		.touchend(function (e) {
			$(e.source).attr('backgroundColor', '#fff');
			$(e.source).attr('borderColor', '#777');
			$(e.source).attr('color', '#777');
		})
		.touchcancel(function (e) {
			$(e.source).attr('backgroundColor', '#fff');
			$(e.source).attr('borderColor', '#777');
			$(e.source).attr('color', '#777');
		})
	;
	return element;
});