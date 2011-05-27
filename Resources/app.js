/*

	Adamantium.js example app

*/

Ti.include('Adamantium.js');

$.pull('UI.IdeaSummaryRow');
$.pull('UI.StarRating');
$.pull('UI.SimpleButton');

$.require([
	'LOGIC.Ideas',
	'SCR.EditTextArea',
	'SCR.Idea',
	'SCR.Dashboard', 
	'SCR.Manifesto'
]);

LOGIC.TabGroup = $('UI.TabGroup')
	.module([
		Ti.UI.TabGroup, 
		Ti.UI.Tab
	])
	.tab({
		id: 'Dashboard.Tab',
		screen: SCR.Dashboard, 
		title: 'Ideas', 
		icon: 'lightbulb.png'
	})
	.tab({ screen: SCR.Manifesto, title: 'Manifesto', icon: 'fire.png' })
	.open({ transition: Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT })
;