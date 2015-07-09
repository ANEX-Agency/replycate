// Save this script as `options.js`

var storage = chrome.storage.sync;

var options;


// Saves options to localStorage.
function save_options() {



  // columns
    var select = document.getElementById("pasteroid-columns");
    var columns = select.children[select.selectedIndex].value;
    options['columns'] = columns * 1;


    // urls
    var urls = document.getElementById("pasteroid-urls");
    options['urls'] = urls.value;









    // save all
    storage.set({options: options}, function()
    {
        var status = document.getElementById("status");
        status.innerHTML = "Options Saved.";
        setTimeout(function() {
          status.innerHTML = "";
        }, 750);
    });
}

// Restores select box state to saved value from localStorage.
function restore_options() {


// urls
     if(options.urls) {
      document.getElementById("pasteroid-urls").value = options.urls;
     }


// columns
    if(options.columns) {

      var select = document.getElementById("pasteroid-columns");
      for (var i = 0; i < select.children.length; i++) {
        var child = select.children[i];
        if (child.value == options.columns) {
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


