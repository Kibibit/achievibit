happo.define('button', () => {
  var elem = document.createElement('button');
  elem.setAttribute('class', 'button');
  elem.innerHTML = 'Submit MOTHAFACKA!';
  document.body.appendChild(elem);
});

happo.define('responsive component', () => {
  var elem = document.createElement('div');
  elem.setAttribute('class', 'responsive-component');
  document.body.appendChild(elem);
}, { viewports: ['large', 'small'] });
