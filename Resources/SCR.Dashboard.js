SCR.Dashboard = $('Screen')
	.module([
		Ti.UI.TableView,
		Ti.UI.Button,
		Ti.UI.Animation
	])
	.attr({
     	backgroundColor: '#fff',
     	barColor: '#000',
     	title: 'Ideas'
 	})
 	.add('UI.TableView', {
 		id: 'Dashboard.Ideas',
		allowsSelection: true,
		editable: true,
		selectedRowBackgroundColor: '#aaa',
		hook: function (o) {
			$(':IdeaSummaryRow')
				.bind('delete', function (e) {
					if (e.target.id) {
						var id = e.target.id.split('.')[1];
						$(LOGIC.Ideas).trigger('remove', { 
							id: id,
							context: 'SCR.Dashboard'
						});
					}
				})
				.click(function (e) {
					$('#Dashboard.Ideas').attr('selectedRow', e.index);
					$(SCR.Idea)
						.stage({
							idea: e.target.idea,
							uid: e.target.uid,
							rating: e.target.rating
						})
						.run()
					;
				})
			;
		}
 	})
 	.append('UI.Button', {
		id: 'Dashboard.NewIdea',
		systemButton: Ti.UI.iPhone.SystemButton.ADD,
		hook: function (o) {
			$(o).click(function (e) {
				$(SCR.EditTextArea)
					.stage({
						title: 'Add new idea',
						context: 'idea',
						hook: function (e) {
							$(LOGIC.Ideas).insert({ idea: e.value });
							
						}
					})
					.run()
				;
			});
		}
	})
	.attr('rightNavButton', '#Dashboard.NewIdea')
	.ready(function () {
		$(LOGIC.Ideas)
			.index(function (e) {
				$(SCR.Dashboard).stage({
					count: e.results.length
				});
				if (e.action == 'remove' && e.context == 'SCR.Dashboard') { }  else {
					$('#Dashboard.Ideas')
						.unselect()
						.rows(e.results, function (result) {
							return {
								id: 'Ideas.' + result.id,
								uid: result.id,
								idea: result.idea,
								rating: result.rating,
								lastChanged: result.lastChanged
							};
						}, 'UI.IdeaSummaryRow')
						.scrollToTop()
					;
				}
			})
			.refresh()
		;
	})
	.stage(function (e) {
		if (typeof e.count == 'number') {
			var length,
			    context = 'ideas';
			if (e.count < 1) {
			    length = 'No';
			} else {
			    length = e.count;
			}
			if (e.count == 1) {
			    context = 'idea';
			}
			$(SCR.Dashboard).attr('title', length + ' ' + context);
		}
	})
	.click(function (e) {
		Ti.API.info(e.source + ' ' + e.target + ' ' + e.type);
	})
	.focus(function (e) {
		$('#Dashboard.Ideas').unselect();
	})
;