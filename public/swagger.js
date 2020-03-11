function addCss(fileName) {

  var head = document.head;
  var link = document.createElement("link");

  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = fileName;

  head.appendChild(link);
}

function addMetaTag() {
  var meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1';
  document.getElementsByTagName('head')[0].appendChild(meta);
}

// inject fonts used in theme
addCss('https://fonts.googleapis.com/css?family=Comfortaa|Righteous');
addMetaTag();