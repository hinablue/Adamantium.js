LOGIC.Ideas = $('Logic')
	.refresh(function (e) {
		e = e || {};
		e.action = e.action || null;
		var sortKey = 'lastChanged DESC';
		var query = $.execute('SELECT * FROM Ideas ORDER BY ' + sortKey);
		var results = [];
		while (query.isValidRow()) {
		    results.push({
		    	'id': query.fieldByName('id'),
		    	'idea': query.fieldByName('idea'),
		    	'rating': query.fieldByName('rating'),
		    	'lastChanged': query.fieldByName('lastChanged')
		    });
		    query.next();
		}
		$(e.source).index({ 
			action: e.action, 
			results: results, 
			context: e.context || 'unkown'
		});
	})
	.insert(function (e) {
		var idea = e.idea || '';
		var id = e.id || $.id();
		var rating = e.rating || 0;
		var dateInserted = new Date();
		$.execute('INSERT INTO Ideas (id, idea, rating, lastChanged) VALUES(?, ?, ?, ?)', id, idea, rating, dateInserted.valueOf());
		$(e.source).refresh({
			action: 'insert',
			context: e.context || 'unkown'
		});
	})
	.bind('update', function (e) {
		if (typeof e.id == 'string' && typeof e.key == 'string' && typeof e.value !== 'undefined') {
			var dateUpdated = new Date();
			$.execute('UPDATE Ideas SET ' + e.key + ' = ? WHERE id = ?', e.value, e.id);
			$.execute('UPDATE Ideas SET lastChanged = ? WHERE id = ?', dateUpdated.valueOf(), e.id);
			$(e.source).refresh({
				action: 'update',
				context: e.context || 'unkown'
			});
		}
	})
	.bind('remove', function (e) {
		if (e.id) {
			$.execute("DELETE FROM Ideas WHERE id = ?", e.id);
			$(e.source).refresh({
				action: 'remove',
				context: e.context || 'unkown'
			});
		}
	})
	.load(function () {
		$.execute(
			'CREATE TABLE IF NOT EXISTS Ideas (' +
			'id TEXT PRIMARY KEY, ' +
			'idea TEXT, ' +
			'rating INTEGER, ' +
			'lastChanged TEXT)'
		);
	})
;