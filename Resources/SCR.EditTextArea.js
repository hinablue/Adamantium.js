SCR.EditTextArea = $('Screen')
	.module([
		Ti.UI.TextArea,
		Ti.UI.Button,
		Ti.UI.OptionDialog
	])
 	.attr({
     	backgroundColor: '#fff',
     	barColor: '#000',
     	title: 'Edit textarea'
 	})
 	.add('UI.TextArea', {
		id: 'EditTextArea.Text',
	    top: 15,
	    left: 15,
	    right: 15,
	    height: 170,
	    borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
	    textAlign: 'left',
	    font: {
	    	fontSize: 18
	    },
		hook: function (o) {
			$(o)
				.change(function (e) {
					$('#EditTextArea.Save').enable();
				})
				.bind('blur', function (e) {
					var stored = $(SCR.EditTextArea).attr('stored');
					var value = $('#EditTextArea.Text').attr('value');
					if (stored !== value) {
						$('#EditTextArea.Confirm').show();
					} else {
						var t = setTimeout(function () {
							$(SCR.EditTextArea).close();
						}, 250);
					}
				})
			;	
		}
 	})
	.append('UI.Button', {
		id: 'EditTextArea.Cancel',
		title: 'Cancel',
		hook: function (o) {
			$(o).click(function () {
				$('#EditTextArea.Text').blur();
			});	
		}
	})
	.attr('leftNavButton', '#EditTextArea.Cancel')
	.append('UI.Button', {
		id: 'EditTextArea.Save',
		title: 'Save',
		hook: function (o) {
			$(o).click(function () {
				$('#EditTextArea.Confirm').click({ index: 0 });
			});	
		}
	})
	.attr('rightNavButton', '#EditTextArea.Save')
	.append('UI.OptionDialog', {
		id: 'EditTextArea.Confirm',
		options: ['Save changes', 'Discard changes', 'Cancel'],
		destructive: 1,
		cancel: 2,
		title: 'The text has been changed.\nDo you want to save the changes?',
		hook: function (o) {
			$(o).click(function (e) {
				switch (e.index) {
					case 0:
			 			$(SCR.EditTextArea).hook({
			 				value: $('#EditTextArea.Text').attr('value')
			 			});
						$(SCR.EditTextArea).attr('stored', $('#EditTextArea.Text').attr('value'));
						$('#EditTextArea.Text').trigger('blur');
						break;
					case 1:
						$(SCR.EditTextArea).attr('stored', $('#EditTextArea.Text').attr('value'));
						$('#EditTextArea.Text').trigger('blur');
						break;
					case 2:
						$('#EditTextArea.Text').focus();
						break;
				}
			});	
		}
	})
	.stage(function (e) {
 		if (typeof e.hook == 'function') {
 			$(SCR.EditTextArea).hook(e.hook);
 		}
 		if (typeof e.title == 'string') {
 			$(SCR.EditTextArea).attr('title', e.title);
 		}
 		if (typeof e.context == 'string') {
 			$('#EditTextArea.Confirm').attr('title', 'The ' + e.context + ' has been changed.\nDo you want to save the changes?');
 		}
 		if (typeof e.value == 'string') {
 			$('#EditTextArea.Text').attr('value', e.value);
 			$(SCR.EditTextArea).attr('stored', e.value);
 		} else {
 			$('#EditTextArea.Text').empty('value');
 			$(SCR.EditTextArea).empty('stored');
 		}
 		$('#EditTextArea.Save').disable();
	})
 	.run(function (e) {
 		$(SCR.EditTextArea).open({ modal:true });
 		var t = setTimeout(function () {
 			$('#EditTextArea.Text').focus();
 		}, 350);
 	})
;