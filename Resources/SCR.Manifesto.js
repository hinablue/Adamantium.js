SCR.Manifesto = $('Screen')
	.module([
		Ti.UI.Label, 
		Ti.UI.ScrollView
	])
 	.attr({
     	backgroundColor: '#fff',
     	barColor: '#000',
     	title: 'Manifesto'	
 	})
 	.append('UI.Label', {
 		id: 'Manifesto.Headline',
 		top: 15,
 		left: 15,
 		right: 15,
 		height: 'auto',
 		font: {
 			fontSize: 22,
 			fontWeight: 'bold'
 		},
 		text: 'Adamantium.js - chainable mobile app framework with jQuery-like syntax'
 	})
 	.append('UI.Label', {
 		id: 'Manifesto.ParagraphOne',
 		top: 15,
 		left: 15,
 		right: 15,
 		height: 'auto',
 		text: 'Adamantium.js is based on the idea to let webdevelopers use existing skills and familiarity with jQuery to build mobile apps, using the Titanium Mobile platform. The architecture of apps in this framework will be based on module components and event driven interaction between these. The framework will also make extending component and element functionality and prototyping UI element constructors as straightforward as possible.'
 	})
 	.append('UI.Label', {
 		id: 'Manifesto.SubheadlineOne',
 		top: 15,
 		left: 15,
 		right: 15,
 		height: 'auto',
 		font: {
 			fontSize: 19,
 			fontWeight: 'bold'
 		},
 		text: 'Logic, Screen, Library, UI'
 	})
 	.append('UI.Label', {
 		id: 'Manifesto.ParagraphTwo',
 		top: 15,
 		left: 15,
 		right: 15,
 		height: 'auto',
 		text: 'Apps in the eyes of Adamantium.js are based on components, of which there are four kinds with different intentions, purpose and use. To simplify the concept of Model-View-Controller, the component type Logic (short for Logic controller) has merged the traditional Model and Controller into a central hub of interaction with data layers and business logic.'
 	})
 	.append('UI.Label', {
 		id: 'Manifesto.ParagraphThree',
 		top: 15,
 		left: 15,
 		right: 15,
 		height: 'auto',
 		text: 'The traditional View has been renamed to Screen, to avoid confusion with Titanium Mobiles definition and use of Views. Library is the third kind of component and is a format for plugins, sort of, to prototype new methods, bind callbacks to process events and extend the UI. Which is the fourth and last kind of component, which basically allows for prototyping custom element constructors.'
 	})
 	.append('UI.Label', {
 		id: 'Manifesto.SubheadlineTwo',
 		top: 15,
 		left: 15,
 		right: 15,
 		height: 'auto',
 		font: {
 			fontSize: 19,
 			fontWeight: 'bold'
 		},
 		text: 'Example application'
 	})
 	.append('UI.Label', {
 		id: 'Manifesto.ParagraphFour',
 		top: 15,
 		left: 15,
 		right: 15,
 		bottom: 15,
 		height: 'auto',
 		text: 'I have prepared this simple example application, which show you how to use most common methods and build an app with Adamantium.js. My intention for this app is to keep it updated as regularly as the framework evolves and provide examples for all the ways too leverage Adamantium.js. I hope for this to grow by user contribution, so if you try the framework and develop a cool example or proof of concept that you\u0027d like to share, please let me know.'
 	})
 	.add('UI.ScrollView', {
 		id: 'Manifesto.Wrapper',
		contentWidth: 'auto',
		contentHeight: 'auto',
		showVerticalScrollIndicator: true,
		showHorizontalScrollIndicator: false,
		layout: 'vertical'
 	})
 	.ready(function() {
 		$('#Manifesto.Headline').appendTo('#Manifesto.Wrapper');
 		$('#Manifesto.ParagraphOne').appendTo('#Manifesto.Wrapper');
 		$('#Manifesto.SubheadlineOne').appendTo('#Manifesto.Wrapper');
 		$('#Manifesto.ParagraphTwo').appendTo('#Manifesto.Wrapper');
 		$('#Manifesto.ParagraphThree').appendTo('#Manifesto.Wrapper');
 		$('#Manifesto.SubheadlineTwo').appendTo('#Manifesto.Wrapper');
 		$('#Manifesto.ParagraphFour').appendTo('#Manifesto.Wrapper');
	})
;