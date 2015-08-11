var storage = chrome.storage.sync;

var options;

/**
 * Saves options.
 */

function save_options() {

	// categories
	var categories = document.getElementById("pasteroid-categories");
	options['categories'] = categories.value;
	
	// urls
	var urls = document.getElementById("pasteroid-urls");
	options['urls'] = urls.value;

	// events
	var select = document.getElementById("pasteroid-event");
	var events = select.children[select.selectedIndex].value;
	options['events'] = events * 1;



    // save all
    storage.set({options: options}, function() {
		
		$( '.container' ).append( '<div class="status">' );
//        var status = document.getElementById("status");
//        status.innerHTML = "Options Saved.";
//        setTimeout(function() {
//          status.innerHTML = "";
//        }, 3000);
		$( '.status' ).html( 'Options saved' ).delay( 3000 ).fadeOut();
		
    });
	
}

// Restores select box state to saved value from localStorage.
function restore_options() {

	// categories
	if( options.categories ) {
		document.getElementById("pasteroid-categories").value = options.categories;
	}
	
	// urls
	if( options.urls ) {
		document.getElementById("pasteroid-urls").value = options.urls;
	}

	// events
	if( options.events ) {
	
		var select = document.getElementById("pasteroid-event");
		for (var i = 0; i < select.children.length; i++) {
			var child = select.children[i];
			if (child.value == options.events) {
				child.selected = "true";
				break;
			}
		}
	
	}

}




storage.get('options', function(data) {
	
    options = data.options || {};

    if(document.readyState === "complete")
      restore_options();
    else
      document.addEventListener('DOMContentLoaded', restore_options);



    document.querySelector('#save').addEventListener('click', save_options);
	
});


