function toggleText() {
  let button = document.querySelector(".toggle-text-button");
  let text = document.getElementById("text");
  button.onclick = function () {
    if (text.hidden == true) {
      text.hidden = false;
    } else {
      text.hidden = true;
    }
  };
}