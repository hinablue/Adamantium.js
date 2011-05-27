SCR.Idea = $('Screen')
	.module([
		Ti.UI.Label, 
		Ti.UI.ScrollView,
		Ti.UI.StarRating,
		Ti.UI.SimpleButton
	])
 	.attr({
     	backgroundColor: '#fff',
     	barColor: '#000',
     	title: 'Idea'	
 	})
 	.add('UI.ScrollView', {
 		id: 'Idea.Wrapper',
		contentWidth: 'auto',
		contentHeight: 'auto',
		showVerticalScrollIndicator: true,
		showHorizontalScrollIndicator: false,
		layout: 'vertical'
 	})
 	.append('UI.Label', {
 		id: 'Idea.Label',
 		top: 15,
 		left: 15,
 		right: 15,
 		height: 'auto',
 		font: {
 			fontSize: 22,
 			fontWeight: 'bold'
 		},
 		hook: function (o) {
  			$(o).appendTo('#Idea.Wrapper');
 		}
 	})
 	.append('UI.StarRating', {
 		id: 'Idea.Rating',
 		top: 20,
 		width: 270,
 		left: 25,
 		value: 4,
 		hook: function (o) {
  			$(o)
  				.appendTo('#Idea.Wrapper')
  				.update(function (e) {
  					var id = $(SCR.Idea).attr('idea_uid');
  					$(LOGIC.Ideas).update({
  						id: id,
  						key: 'rating',
  						value: e.value
  					});
  					$(SCR.Idea).close();
  				})
  			;
  			
 		}
 	})
 	.append('UI.View', {
 		id: 'Idea.ButtonWrapper',
 		top: 25,
 		left: 15,
 		right: 15,
 		bottom: 15,
 		height: 50,
 		layout: 'horisontal',
 		hook: function (o) {
  			$(o).appendTo('#Idea.Wrapper');
 		}
 	})
 	.append('UI.SimpleButton', {
 		id: 'Idea.Delete',
 		float: 'left',
 		backgroundSelectedColor: '#aaa',
 		title: 'Delete',
 		hook: function (o) {
 			$(o)
 				.appendTo('#Idea.ButtonWrapper')
 				.touchend(function () {
 					$('#Idea.ConfirmDelete').show();
 				})
 			;
 		}
 	})
 	.append('UI.SimpleButton', {
 		id: 'Idea.Edit',
 		float: 'right',
 		highlightedColor: '#aaa',
 		title: 'Edit',
 		hook: function (o) {
 			$(o)
 				.appendTo('#Idea.ButtonWrapper')
 				.touchend(function () {
					$(SCR.EditTextArea)
						.stage({
							title: 'Edit idea',
							context: 'idea',
							value: $('#Idea.Label').attr('text'),
							hook: function (e) {
  								var id = $(SCR.Idea).attr('idea_uid');
  								$(LOGIC.Ideas).update({
  									id: id,
  									key: 'idea',
  									value: e.value
  								});
  								$('#Idea.Label').attr('text', e.value);
  								$(SCR.Idea).attr('title', e.value);
							}
						})
						.run()
					;
 				})
 			;
 		}
 	})
	.append('UI.OptionDialog', {
		id: 'Idea.ConfirmDelete',
		options: ['Delete idea', 'Cancel'],
		destructive: 0,
		cancel: 1,
		title: 'Do you really want to delete this idea?',
 		hook: function (o) {
 			$(o).click(function (e) {
				if (e.index == 0) {
					var uid = $(SCR.Idea).attr('idea_uid');
					$(LOGIC.Ideas).trigger('remove', { id: uid });
					$(SCR.Idea).close();
				}
	 		});
 		}
	})
	.stage(function (e) {
		if (typeof e.idea == 'string') {
 			$('#Idea.Label').attr('text', e.idea);
 			$(e.source).attr('title', e.idea);
		}
		if (e.uid) {
 			$(e.source).attr('idea_uid', e.uid);
		} else {
			$(e.source).empty('idea_uid');
		}
		if (typeof e.rating == 'number') {
			$('#Idea.Rating').update({
				rating: e.rating,
				silent: true
			});
		}
		$('#Idea.Wrapper').scrollToTop();
	})
	.run(function (e) {
		$(LOGIC.TabGroup).navigate(SCR.Idea);
	})
;