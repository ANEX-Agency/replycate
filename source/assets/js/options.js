// Save this script as `options.js`

// Saves options to localStorage.
function save_options() {
  var select = document.getElementById("pasteroid-columns");
  var columns = select.children[select.selectedIndex].value;
  localStorage["pasteroid_columns"] = columns;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var favorite = localStorage["pasteroid_columns"];
  if (!favorite) {
    return;
  }
  var select = document.getElementById("pasteroid-columns");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);