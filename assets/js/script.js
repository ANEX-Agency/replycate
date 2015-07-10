
/***********************************************************************

 Pasteroid - Text Templates and Code Snippets at Hand
 
 ANEX
 info@anex.at
 http://anex.at

 2015-07-10
 v1.5.0
 
*************************************************************************/

(function () {

	var $doc = $(document);

	// set the list selector
	var setSelector = ".pasteroid-panel ul";

	var storageArea = chrome.storage.sync;

	var options;


	// Store item in local storage:
	function setItem(key, value, cb) {

		var data = {};
		data[key] = value;

		storageArea.set(data, cb);
	}

	// Gets item from local storage with specified key.
	function getItem(key, cb) {
		storageArea.get(key, cb);
	}

	function log(txt) {
		if(logging) {
			console.log(txt);
		}
	}
	
	
	function canEntry(key, title, val, cat){
		return $('<li id="'+key+'" class="pasteroid-template cankey-op pasteroid-template-'+cat+'" data-key="'+key+'" data-cat="'+cat+'" title="'+title+'"> '+
					'<a href="#" class="pasteroid-template-name can-keyname">'+
						'<span class="pasteroid-template-badge pasteroid-template-badge-'+cat+'">'+cat+'</span>'+
						'<span class="pasteroid-template-title cantitle">'+title+'</span>'+
					'</a> '+
					'<span class="pasteroid-template-content cantext" >'+val+'</span> '+
					'<span class="pasteroid-template-actions canactions"> '+
						'<a href="#" class="pasteroid-template-move" title="Move Can"><span class="lnr lnr-menu"></span></a> '+
						'<a href="#" class="pasteroid-template-edit cankey-edit" title="Edit Can" data-key="'+key+'" ><span class="lnr lnr-pencil"></span></a> '+
						'<a href="#" class="pasteroid-template-remove cankey-remove" title="Delete Can"><span class="lnr lnr-trash"></span></a> '+
					'</span> '+
				'</li>');
	}

	function createUUID() {
	    // http://www.ietf.org/rfc/rfc4122.txt
	    var s = [];
	    var hexDigits = "0123456789abcdef";
	    for (var i = 0; i < 36; i++) {
	        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	    }
	    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
	    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
	    s[8] = s[13] = s[18] = s[23] = "-";

	    var uuid = s.join("");
	    return uuid;
	}

	var cans  = {};
	var order = [];

	function saveOrder() {

		var order = $(setSelector).sortable("toArray");
		setItem('order', order, function() {
			console.log("successfully updated");
		});
	}

	function save(){

		saveOrder();

		setItem('templates', cans, function() {
			console.log("cans saved");
		});
	}


	function loadData(cb) {

		getItem(['templates', 'order'], function(data) {

			//Load default cans if none exist
			if(data.templates === undefined || data.templates === {}) {
				
				$.getJSON(chrome.extension.getURL('defaults.json'), function(data) {

					_.each(data, function(can, key) {
						order.push(key);
					});

					cans = data;

					cb();
				});
			}
			else
			{
				cans  = data.templates;
				order = data.order || Object.keys(cans);

				cb();
			}
		});
	}
	
	function construct() {

		var canKey = '';
		
		var typeCat = '';

		var $container			= $('<div class="pasteroid" id="cancontainer">');
		var $widget				= $('<div class="pasteroid-widget">' );
		var $panel				= $('<div class="pasteroid-panel" id="canpanel">');
		
		var $buttons			= $('<div class="can-buttons pasteroid-actions">');
		var $contents			= $('<div id="cancontents" class="pasteroid-panel-content">');
		var $canlist 			= $('<ul id="canlist">');

		var $buttonPasteroid	= $('<a href="#pasteroid" id="canbutton" class="pasteroid-button pasteroid-button-primary animated bounceIn"><span class="lnr lnr-pointer-up"></span></a>');
		var $buttonAdd			= $('<a href="#add" class="pasteroid-button pasteroid-button-secondary animated bounceIn"><span class="lnr lnr-pencil"></span></a>');
		var $buttonSettings		= $('<a href="#settings" class="pasteroid-button pasteroid-button-secondary animated bounceIn"><span class="lnr lnr-cog"></span></a>');

		/**
		 * Pasteroid Button
		 */		
		$buttonPasteroid.on('click', function(e){	
		
			e.preventDefault();
				
			if( $container.hasClass('panel-open') ) {
				
				//Close it
				$container.removeClass('panel-open');
				$('#canpanel').slideUp();
				//$('html').off('click.canclose');
				
			} else {
				
				//Open it
				$container.addClass('panel-open');
				$('#canpanel').slideDown();

			}
			
			return false;
			
		});
		
		/**
		 * Add New Button
		 */		
		$buttonAdd.click(function( e ) {
			
			e.preventDefault();
	
			$editor.find('#cankey-editor-key').val('');
			$editor.find('#cankey-editor-title').val('');
			$editor.find('#cankey-editor-val').val('');
			$editor.find('#cankey-editor-cat').val('');
			$editor.fadeIn('normal');

			return false;
			
		});


		//Build the list of cans

		$.each(order, function(ndx, key) {
			var can = cans[key];
			$canlist.append(canEntry(key, can.title, can.text, can.cat));
		});
		
		$('body').append($container);

		$container.append($widget);
		$container.append($panel);

		$contents.append($canlist);
		
		$widget.append($buttonPasteroid);
		$widget.append($buttonAdd);

		//Build the Editor	
		var $editor = $('<div class="cankey-editor pasteroid-editor">'+
								'<form>'+
									'<a href="#" class="pasteroid-editor-close"><span class="lnr lnr-cross"></span></a>'+
									'<input id="cankey-editor-title" type="text" placeholder="Click to edit title" />'+
									'<input id="cankey-editor-key" type="hidden" />'+
									'<textarea id="cankey-editor-val" placeholder="Insert Text here"></textarea>'+
									'<select id="cankey-editor-cat">'+
										'<option>text</option>'+
										'<option>link</option>'+
										'<option>image</option>'+
										'<option>plugin</option>'+
										'<option>snippet</option>'+
										'<option>video</option>'+
									'</select>'+
									'<input type="submit" value="Save" id="cankey-editor-save" class="pasteroid-editor-save" /> '+
								'</form> '+
							'</div>');
		
		//Show All Button
		var $canAllButton = $('<a href="#" class="filter" title="Show all" data-filter="all">All</a>');
		$canAllButton.click(function(e){
			e.preventDefault();
			$canlist.find('li').show();
		});
		$buttons.append($canAllButton);

		//Text Only Buttons
		var $canTextButton = $('<a href="#" class="filter" title="Show only text templates" data-filter=".text">Text</a>');
		$canTextButton.click(function(e){
			e.preventDefault();
			$canlist.find('li').hide()
			$canlist.find('li[data-cat="text"]').stop().show();
		});
		$buttons.append($canTextButton);
		
		//Links Only Buttons
		var $canLinkButton = $('<a href="#" class="filter" title="Show only links" data-filter=".link">Links</a>');
		$canLinkButton.click(function(e){
			e.preventDefault();
			$canlist.find('li').hide()
			$canlist.find('li[data-cat="link"]').stop().show();
		});
		$buttons.append($canLinkButton);
		
		//Images Only Buttons
		var $canImageButton = $('<a href="#" class="filter" title="Show only images" data-filter=".image">Images</a>');
		$canImageButton.click(function(e){
			e.preventDefault();
			$canlist.find('li').hide()
			$canlist.find('li[data-cat="image"]').stop().show();
		});
		$buttons.append($canImageButton);
		
		//Plugins Only Buttons
		var $canPluginButton = $('<a href="#" class="filter" title="Show only plugins" data-filter=".plugin">Plugin</a>');
		$canPluginButton.click(function(e){
			e.preventDefault();
			$canlist.find('li').hide()
			$canlist.find('li[data-cat="plugin"]').stop().show();
		});
		$buttons.append($canPluginButton);

		//Snippets Only Button
		var $canSnippetButton = $('<a href="#" class="filter" title="Show only code snippets" data-filter=".snippet">Snippets</a>');
		$canSnippetButton.click(function(e){
			e.preventDefault();
			$canlist.find('li').hide()
			$canlist.find('li[data-cat="snippet"]').stop().show();
		});
		$buttons.append($canSnippetButton);
	
		//Video Only Button
		var $canVideoButton = $('<a href="#" class="filter" title="Show only videos" data-filter=".video">Videos</a>');
		$canVideoButton.click(function(e){
			e.preventDefault();
			$canlist.find('li').hide()
			$canlist.find('li[data-cat="video"]').stop().show();
		});
		$buttons.append($canVideoButton);
	

		//Add Buttons
		$panel.append($buttons);
		$panel.append($contents);
		$container.append($editor);

		var $replyBox;

		$doc.on('focus', 'textarea', function()
		{
			$replyBox = $(this);
		}).on('blur', 'textarea', function()
		{
			$replyBox = null;
		});

		$doc.on('click', '.cankey-op', function(e){
			e.preventDefault();
			var key = $(this).attr('data-key');

			if(!$replyBox || !$replyBox.length)
				$replyBox = $('textarea:first');

			$replyBox.val( $replyBox.val() + cans[key]['text'] );

			return false;
		});

		//Close Editor Function
		$( '.pasteroid-editor-close' ).click( function( e ){

			e.preventDefault();
			$editor.fadeOut( 'normal' );

			return false;
			
		});
		
		$doc.keyup( function( e ) {
			
			if ( e.keyCode == 27 ) {
				
				$editor.fadeOut( 'normal' );
				
			}
			
		});
		
		//Edit Can Function
		$('.pasteroid-template-edit').on('click', function(e) {
			
			e.preventDefault();
			
			canKey = $(this).attr('data-key');

			console.log(canKey);
			
			$editor.find('#cankey-editor-key').val(canKey);
			$editor.find('#cankey-editor-title').val(cans[canKey].title);
			$editor.find('#cankey-editor-val').val(cans[canKey].text);
			$editor.find('#cankey-editor-cat').val(cans[canKey].cat);

			$editor.fadeIn('normal');

			return false;
	
		});

		//Delete Can Function
		$('.pasteroid-template-remove').on('click', function(e) {
			
			e.preventDefault();
			
			var key = $(this).parent().parent().attr('data-key');

			var title = cans[key].title;

			var answer = confirm("Are you sure to delete the template: '"+title+"'?")
			
			if (answer) {
				delete cans[key];
				$(this).parent().parent().remove();	
				save();	
			}

			return false;
	
		});

		//Save Can Function
		$('.pasteroid-editor-save').click(function(e) {
			
			e.preventDefault();


			var title = $('#cankey-editor-title').val();
			var val = $('#cankey-editor-val').val();
			var cat = $('#cankey-editor-cat').val();

			if(!title || title == ''){
				alert('You must enter a name for your paste');
				return false;
			}
	
			if(!val || val == ''){
				alert('Please enter some text to save');
				return false;
			}

			var key = $('#cankey-editor-key').val() || createUUID();

			//If new, add it
			if( !(key in cans) ){
				$canlist.append( canEntry(key, title, val, cat ) );
			}
			else
			{
				var $can = $canlist.find('li[data-key="' + key + '"]');
				$can.replaceWith(canEntry(key, title, val, cat ));
			}
			
			cans[key] = {
				'title': title,
				'text' 	: val,
				'cat'	: cat
				//'tags'	: tags for version 1.5
			};

			console.log($canlist.children().length);

			save();
			
			$editor.toggle('normal');
	
			return false;
			
		});

		$(setSelector).sortable({
			cursor: "move",
			handle: '.pasteroid-template-move',
			update: saveOrder,
		});
	}
	
	getItem('options', function(data) {

		if(!('options' in data))
			return;

		options = data.options;
				console.log(options);
		if('urls' in options)
		{
			var match = false;
			var lines = options.urls.split(/\r?\n/);

			for(var i=0; i<lines.length; i++) {

				var line = lines[i].trim();

				var uri = window.location.hostname + window.location.pathname;

				if(uri.indexOf(line) !== -1) {
					match = true;
					break;
				}
			}

			if(match) {
				console.log(match);
				$(function() {
					loadData(construct);
				});
				
			}
		}
	});
})();