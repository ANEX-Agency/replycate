
/***********************************************************************

 Pasteroid - Text Templates and Code Snippets at Hand
 
 ANEX
 info@anex.at
 http://anex.at

 2015-07-10
 v1.5.0
 
*************************************************************************/

(function () {
	
	// Store item in local storage:
	function setItem(key, value) {
		try {
			log("Storing [" + key + ":" + value + "]");
			window.localStorage.removeItem(key);      // <-- Local storage!
			window.localStorage.setItem(key, value);  // <-- Local storage!
	    } catch(e) {
			log("Error inside setItem");
			log(e);
	    }
    	log("Return from setItem" + key + ":" +  value);
	}

	// Gets item from local storage with specified key.
	function getItem(key) {
		var value;
		log('Retrieving key [' + key + ']');
		try {
			value = window.localStorage.getItem(key);  // <-- Local storage!
		}catch(e) {
			log("Error inside getItem() for key:" + key);
			log(e);
			value = "null";
		}
		log("Returning value: " + value);
		return value;
	}

	// Clears all key/value pairs in local storage.
	function clearStrg() {
		log('about to clear local storage');
		window.localStorage.clear(); // <-- Local storage!
		log('cleared');
	}

	function log(txt) {
		if(logging) {
			console.log(txt);
		}
	}
	
	
	function canEntry(key, val, cat){
		return $('<li id="'+key.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').toLowerCase()+'" class="pasteroid-template cankey-op pasteroid-template-'+cat+'" data-key="'+key+'" data-cat="'+cat+'" title="'+key+'"> '+
					'<a href="#" class="pasteroid-template-name can-keyname">'+
						'<span class="pasteroid-template-badge pasteroid-template-badge-'+cat+'">'+cat+'</span>'+
						'<span class="pasteroid-template-title cantitle">'+key+'</span>'+
					'</a> '+
					'<span class="pasteroid-template-content cantext" >'+val+'</span> '+
					'<span class="pasteroid-template-actions canactions"> '+
						'<a href="#" class="pasteroid-template-move" title="Move Can"><span class="lnr lnr-menu"></span></a> '+
						'<a href="#" class="pasteroid-template-edit cankey-edit" title="Edit Can" data-key="'+key+'" ><span class="lnr lnr-pencil"></span></a> '+
						'<a href="#" class="pasteroid-template-remove cankey-remove" title="Delete Can"><span class="lnr lnr-trash"></span></a> '+
					'</span> '+
				'</li>');
	}

	function saveCans(){
		localStorage.setItem('templates', JSON.stringify(cans));
	}


	// Load up saved Cans - Retrieve the object from storage
	var canObject = localStorage.getItem('templates');
	
	var cans;
	
	var canKey = '';
	
	var typeCat = '';

	//Load default cans if none exist
	if(canObject === null || canObject === '{}' || canObject == '' ) {
		
		cans = {
			
			'Signature' : {
				'text' 	: 'If you have any further questions, feel free to post them here.<br><br>Best Regards,<br>Name [Company]',
				'cat'	: 'text'
			},
			'Customization' : {
				'text'	: 'Unfortunately this is not possible by default and would require a major theme customization.<br>However, if you are in the need of this particular functionality/feature/modification I can offer you our <a href="http://support.NAME.com/customizations/">customization service</a>, which will be glad to take on this job for you and modify everything to your likings.<br><br>',
				'cat'	: 'text'
			},
			'Custom Background' : {
				'text'	: '<pre>body {background: #222;}</pre>',
				'cat'	: 'snippet'
			},
			'Plugins Check' : {
				'text'	: 'Please deactivate all your plugins and see if the issue persists. If it is gone you can activate one plugin after the next always followed by a quick check if the issue returns. That way you can identify the culprit.',
				'cat'	: 'text'
			},
			'CSS Customization' : {
				'text'	: 'please add the following <code>CSS</code> to the Custom <code>CSS Field</code> in your <code>Theme Options</code>:<br><br><pre>.contact-link {display: none;}</pre>',
				'cat'	: 'text'
			},
			'WordPress Codex' : {
				'text'	: '<a href="http://codex.wordpress.org">WordPress Codex</a>',
				'cat'	: 'link'
			}
			
		};
		
	}
	
	//Parse the cans into a JSON object
	else cans = JSON.parse(canObject);

	//Grab the existing reply box
	
	//Forums
	var $replyBox = $('textarea');
	
	function construct() {
		
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
			$editor.find('#cankey-editor-val').val('');
			$editor.find('#cankey-editor-cat').val('');
			$editor.fadeIn('normal');

			return false;
			
		});


		//Build the list of cans

		$.each(cans, function(key, data){
			$canlist.append(canEntry(key, data.text, data.cat));
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
									'<input id="cankey-editor-key" type="text" placeholder="Click to edit title" />'+
									'<textarea id="cankey-editor-val" placeholder="Insert Text here"></textarea>'+
									'<select id="cankey-editor-cat">'+
										'<option>text</option>'+
										'<option>link</option>'+
										'<option>image</option>'+
										'<option>plugin</option>'+
										'<option>snippet</option>'+
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
	

		//Add Buttons
		$panel.append($buttons);
		$panel.append($contents);
		$container.append($editor);

		$(document).delegate('.cankey-op', 'click', function(e){
			e.preventDefault();
			var key = $(this).attr('data-key');
			$replyBox.val( $replyBox.val() + cans[key]['text'] );
			return false;
		});

		//Close Editor Function
		$( '.pasteroid-editor-close' ).click( function( e ){

			e.preventDefault();
			$editor.fadeOut( 'normal' );

			return false;
			
		});
		
		$( document ).keyup( function( e ) {
			
			if ( e.keyCode == 27 ) {
				
				$editor.fadeOut( 'normal' );
				
			}
			
		});
		
		//Edit Can Function
		$('.pasteroid-template-edit').on('click', function(e) {
			
			e.preventDefault();
			
			canKey = $(this).attr('data-key');
			
			$editor.find('#cankey-editor-key').val(canKey);
			$editor.find('#cankey-editor-val').val(cans[canKey]['text']);
			$editor.find('#cankey-editor-cat').val(cans[canKey]['cat']);

			$editor.fadeIn('normal');

			return false;
	
		});

		//Delete Can Function
		$('.pasteroid-template-remove').on('click', function(e) {
			
			e.preventDefault();
			
			var key = $(this).parent().parent().attr('data-key');
			var answer = confirm("Are you sure to delete the template: '"+key+"'?")
			
			if (answer) {
				delete cans[key];
				$(this).parent().parent().remove();	
				saveCans();	
			}

			return false;
	
		});

		//Save Can Function
		$('.pasteroid-editor-save').click(function(e) {
			
			e.preventDefault();
			
			var key = $('#cankey-editor-key').val();
			var val = $('#cankey-editor-val').val();
			var cat = $('#cankey-editor-cat').val();
	
			if(!key || key == ''){
				alert('You must enter a name for your paste');
				return false;
			}
	
			if(!val || val == ''){
				alert('Please enter some text to save');
				return false;
			}

			//If new, add it
			if( !(key in cans) ){
				$canlist.append( canEntry(key, val, cat ) );
			}
			
			cans[key] = {
				'text' 	: val,
				'cat'	: cat
				//'tags'	: tags for version 1.5
			};
			saveCans();
			
			$editor.toggle('normal');
	
			return false;
			
		});
	}
	
	construct();
	
	//Load styles
	$('head').append('<link type="text/css" rel="stylesheet" href="' + chrome.extension.getURL('assets/css/style.css') + '" />');
	//$('head').append('<link type="text/css" rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css" />');
	$('head').append('<link type="text/css" rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/animate.css/3.3.0/animate.min.css" />');
	$('head').append('<link type="text/css" rel="stylesheet" href="//cdn.linearicons.com/free/1.0.0/icon-font.min.css" />');

})();










/////////////////////////////////////////////////////////////////
/////  EDIT THE FOLLOWING VARIABLE VALUES  //////////////////////
/////////////////////////////////////////////////////////////////

// set the list selector
var setSelector = ".pasteroid-panel ul";
// set the cookie name
var setCookieName = "pasteroid";
// set the cookie expiry time (days):
var setCookieExpiry = (20 * 365 * 24 * 60 * 60);

/////////////////////////////////////////////////////////////////
/////  YOU PROBABLY WON'T NEED TO EDIT BELOW  ///////////////////
/////////////////////////////////////////////////////////////////

// function that writes the list order to a cookie
function getOrder() {
	// save custom order to cookie
	$.cookie(setCookieName, $(setSelector).sortable("toArray"), { expires: setCookieExpiry, path: "/" });
}

// function that restores the list order from a cookie
function restoreOrder() {
	
	var list = $(setSelector);
	if (list == null) return
	
	// fetch the cookie value (saved order)
	var cookie = $.cookie(setCookieName);
	if (!cookie) return;
	
	// make array from saved order
	var IDs = cookie.split(",");
	
	// fetch current order
	var items = list.sortable("toArray");
	
	// make array from current order
	var rebuild = new Array();
	for ( var v=0, len=items.length; v<len; v++ ){
		rebuild[items[v]] = items[v];
	}
	
	for (var i = 0, n = IDs.length; i < n; i++) {
		
		// item id from saved order
		var itemID = IDs[i];
		
		if (itemID in rebuild) {
		
			// select item id from current order
			var item = rebuild[itemID];
			
			// select the item according to current order
			var child = $("ul.ui-sortable").children("#" + item + ' .cantext');
			
			// select the item according to the saved order
			var savedOrd = $("ul.ui-sortable").children("#" + itemID);
			
			// remove all the items
			child.remove();
			
			// add the items in turn according to saved order
			// we need to filter here since the "ui-sortable"
			// class is applied to all ul elements and we
			// only want the very first!  You can modify this
			// to support multiple lists - not tested!
			$("ul.ui-sortable").filter(":first").append(savedOrd);
		}
	}
	
}

// code executed when the document loads
$(function() {

	// here, we allow the user to sort the items
	$(setSelector).sortable({
		cursor: "move",
		handle: '.pasteroid-template-move',
		update: function() { getOrder(); }
	});
	
	// here, we reload the saved order
	restoreOrder();
	
	
});