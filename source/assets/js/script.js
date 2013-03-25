
/***********************************************************************

 TextPaste - Text Templates and Code Snippets at Hand
 
 infuse
 info@infuse.at
 http://infuse.at

 2013-01-24
 v1.2.0
 
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
		return $('<li id="'+key.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').toLowerCase()+'" class="cankey-op" data-key="'+key+'" data-cat="'+cat+'" title="'+key+'"> '+
					'<a href="#" class="can-keyname"><span class="canbadge canbadge-'+cat+'">'+cat+'</span><span class="cantitle">'+key+'</span></a> '+
					'<span class="cantext" >'+val+'</span> '+
					'<a href="#" class="cankey-remove" title="Delete Can">&times;</a> '+
					'<a href="#" data-key="'+key+'" class="cankey-edit" title="Edit Can"><img src="'+chrome.extension.getURL('assets/img/icon-edit.png')+'" title="Edit" alt="edit" /></a> '+
				'</li>');
	}

	function saveCans(){
		localStorage.setItem('cans', JSON.stringify(cans));
	}


	// Load up saved Cans - Retrieve the object from storage
	var canObject = localStorage.getItem('cans');
	
	var cans;
	
	var canKey = '';
	
	var typeCat = '';

	//Load default cans if none exist
	if(canObject === null || canObject === '{}' || canObject == '' ){
		cans = {
			'Signature' : {
				'text' 	: 'If you have any further questions, feel free to post them here.<br><br>Best Regards,<br>Name [Company]',
				'cat'	: 'text'
			},
			'Major Customization' : {
				'text'	: 'Unfortunately this is not possible by default and would require a major theme customization.<br>However, if you are in the need of this particular functionality/feature/modification I can offer you our <a href="http://support.NAME.com/customizations/">customization service</a>, which will be glad to take on this job for you and modify everything to your likings.<br><br>',
				'cat'	: 'text'
			},
			'Custom Background' : {
				'text'	: '<pre>body {background: #222;}</pre>',
				'cat'	: 'snippets'
			}
		};
	}
	//Parse the cans into a JSON object
	else cans = JSON.parse(canObject);

	//Grab the existing reply box
	
	//Forums
	var $replyBox = $('textarea');

	//In the comments
	if($replyBox.size() == 0){
	
		var $commentReply = $('a.fancy-comment');
		if($commentReply.size() > 0){
		
			$commentReply.click(function(){
							
				setTimeout( function(){
					findReplyText();
				},500);
								
			});
		}		
	}
	//In the forums
	else{
		typeCat = 'text';
		construct();
	}
	//console.log('replyBoxCount: ' + $replyBox.size() );
	
	function findReplyText(){
	
		$replyBox = $('#reply_text');
		
		//Box has loaded
		if($replyBox.size() > 0){
			typeCat = 'snippets';
			construct();
		}
		else{
			setTimeout( function(){
				findReplyText();
			},500);
		}
	}
	
	function construct(){
	
		//Setup Main Can Button
		var $canbutton = $('<a href="#" id="canbutton"><img src="'+chrome.extension.getURL('assets/img/icon-paste.png')+'" title="Paste some Text" /></a>');
		
		/*$canbutton.click(function(e){
			e.preventDefault();
			$('#canpanel').fadeToggle('normal', function(){
				$('html').click(function(){
					$('#canpanel').fadeOut();
				});
			});
		});*/
		
		$canbutton.on('click', function(e){	
		
			e.preventDefault();
				
			//Close it
			if( $canbutton.hasClass('can-lid-open') ){
				$canbutton.removeClass('can-lid-open');
				$('#canpanel').fadeOut();
				$('html').off('click.canclose');
			}
			//Open it
			else{
				$canbutton.addClass('can-lid-open');
				$('#canpanel').fadeIn();

				$('html').on('click.canclose', function(e){
				
					//Don't close if the can container was clicked.
					if( $(e.target).parents('#cancontainer').size() > 0 ){
						return;
					}
				
					$canbutton.removeClass('can-lid-open');
					$('#canpanel').fadeOut();
					$('html').off('click.canclose');
				});				
			}
			
			return false;
		});

		//Build the can dialog
		var $cancontainer = $('<div id="cancontainer">');
		var $canpanel = $('<div id="canpanel">');
		var $cancontents = $('<div id="cancontents">');
		$cancontents.append($('<div class="cantip">'));

		//Build the list of cans
		var $canlist = $('<ul id="canlist">');

		$.each(cans, function(key, data){
			$canlist.append(canEntry(key, data.text, data.cat));
		});

		$cancontents.append($canlist);
		$cancontainer.append($canpanel);
		$cancontainer.append($canbutton);
	
//		if(typeCat == 'snippets'){
//			$cancontainer.addClass('item-comments').insertBefore($replyBox);
//		}
//		else $cancontainer.insertAfter($replyBox);
		$cancontainer.insertBefore('.quicktags-toolbar input:first');

		//Build the Editor	
		var $canEditor = $('<div class="cankey-editor">'+
								'<form><input id="cankey-editor-key" type="text" placeholder="Click to edit title" /> '+
									'<a href="#" id="can-close-editor">&times;</a> '+
									'<textarea id="cankey-editor-val" placeholder="Insert Text here"></textarea> '+
									'<select id="cankey-editor-cat">'+
										'<option>text</option>'+
										'<option>link</option>'+
										'<option>plugin</option>'+
										'<option>snippet</option>'+
									'</select>'+
									'<input type="submit" value="Save" id="cankey-editor-save" /> '+
								'</form> '+
							'</div>');
							
		//Build the Preview Box
		//var $previewBox = $('<div id="can_previewbox"><textarea></textarea></div>');


		//Build List Buttons
		var $canbuttons = $('<div class="can-buttons">');

		//New Can Button
		var $canNewButton = $('<a href="#" id="can-new">New</a>');
		$canNewButton.click(function(e){
			e.preventDefault();
	
			$canEditor.find('#cankey-editor-key').val('');
			$canEditor.find('#cankey-editor-val').val('');
			$canEditor.find('#cankey-editor-cat').val('');
			$canEditor.show('normal');

			return false;
		});
		$canbuttons.append($canNewButton);

		//Show All Button
		var $canAllButton = $('<a href="#" title="Show all">All</a>');
		$canAllButton.click(function(e){
			e.preventDefault();
			$cancontents.find('li').slideDown();
		});
		$canbuttons.append($canAllButton);

		//Text Only Buttons
		var $canTextButton = $('<a href="#" title="Show only text templates">Text</a>');
		$canTextButton.click(function(e){
			e.preventDefault();
			$cancontents.find('li').slideUp();
			$cancontents.find('li[data-cat="text"]').stop().slideDown();
		});
		$canbuttons.append($canTextButton);
		
		//Links Only Buttons
		var $canLinkButton = $('<a href="#" title="Show only links">Links</a>');
		$canLinkButton.click(function(e){
			e.preventDefault();
			$cancontents.find('li').slideUp();
			$cancontents.find('li[data-cat="link"]').stop().slideDown();
		});
		$canbuttons.append($canLinkButton);
		
		//Plugins Only Buttons
		var $canPluginButton = $('<a href="#" title="Show only links">Plugin</a>');
		$canPluginButton.click(function(e){
			e.preventDefault();
			$cancontents.find('li').slideUp();
			$cancontents.find('li[data-cat="plugin"]').stop().slideDown();
		});
		$canbuttons.append($canPluginButton);

		//Snippets Only Button
		var $canSnippetButton = $('<a href="#" title="Show only code snippets">Snippets</a>');
		$canSnippetButton.click(function(e){
			e.preventDefault();
			$cancontents.find('li').slideUp();
			$cancontents.find('li[data-cat="snippet"]').stop().slideDown();
		});
		$canbuttons.append($canSnippetButton);

		//Add Buttons
		$canpanel.append($canbuttons);
		$canpanel.append($cancontents);
		$canpanel.append($canEditor);
		//$canpanel.append($previewBox);

		//Insert Text Function
		/*$('.cankey-op').live( 'click', function(e){
			console.log('click cankey op');
			e.preventDefault();
			var key = $(this).attr('data-key');
			$replyBox.val( $replyBox.val() + cans[key]['text'] );
			return false;
	
		});*/
		$(document).delegate('.cankey-op', 'click', function(e){
			e.preventDefault();
			var key = $(this).attr('data-key');
			$replyBox.val( $replyBox.val() + cans[key]['text'] );
			return false;
		});
		
		/*$(document).delegate('.cankey-op', 'hover', function(e){			
			if( e.type === 'mouseenter' ) {
				var content = $(this).find('span.cantext').html();
				$previewBox.stop().fadeIn().find('textarea').val(content);
			}		
			else{
				$previewBox.fadeOut();
			}			
		});*/


		//Close Editor Function
		$('#can-close-editor').click(function(e){

			e.preventDefault();
			$canEditor.hide('normal');

			return false;
		});

		//Edit Can Function
		$('.cankey-edit').on( 'click', function(e){
			e.preventDefault();
			canKey = $(this).attr('data-key');
			$canEditor.find('#cankey-editor-key').val(canKey);
			$canEditor.find('#cankey-editor-val').val(cans[canKey]['text']);
			$canEditor.find('#cankey-editor-cat').val(cans[canKey]['cat']);
			$canEditor.show('normal');

			return false;
	
		});

		//Delete Can Function
		$('.cankey-remove').on( 'click', function(e){
			e.preventDefault();
			var key = $(this).parent().attr('data-key');
	
			var answer = confirm("Really delete the template: '"+key+"'?")
			if (answer){
				delete cans[key];
				$(this).parent().remove();	
				saveCans();	
			}

			return false;
	
		});

		//Save Can Function
		$('#cankey-editor-save').click(function(e){
			e.preventDefault();
			var key = $('#cankey-editor-key').val();
			var val = $('#cankey-editor-val').val();
			var cat = $('#cankey-editor-cat').val();
	
			if(!key || key == ''){
				alert('You must enter a name for your can');
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
			};
			saveCans();
			$canEditor.toggle('normal');
	
			return false;
		});
	}
	
	//Load styles
	$('head').append('<link type="text/css" rel="stylesheet" href="'+chrome.extension.getURL('assets/css/style.css')+'" />');

})();










/////////////////////////////////////////////////////////////////
/////  EDIT THE FOLLOWING VARIABLE VALUES  //////////////////////
/////////////////////////////////////////////////////////////////

// set the list selector
var setSelector = "#canlist";
// set the cookie name
var setCookieName = "listOrder";
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
		update: function() { getOrder(); }
	});
	
	// here, we reload the saved order
	restoreOrder();
});

