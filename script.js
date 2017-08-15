function handleNav($anchor) {
  var article = $anchor.data('article');
  $('article:visible').fadeOut();
  $('#' + article).fadeIn();

  $('.active').removeClass('active');
  $anchor.addClass('active');
  return article;
}

$(function() {

  $('#nav').on('click', 'a', function(e) {
    var $anchor = $(e.target);
    var article = handleNav($anchor);
    localStorage.setItem('activeNav', article);
  })

  $('form').on('click', 'input[type=radio]', function(e) {
    var color = e.target.id;
    $('body').css("background-color", color);
    localStorage.setItem('bodyColor', color);
  })

  window.onunload = function() {
    var text = $('textarea').val();
    localStorage.setItem('text', text);
  }


  var activeNav = localStorage.getItem('activeNav');
  if (activeNav) $('a[data-article=' + activeNav + ']').trigger('click');

  var color = localStorage.getItem('bodyColor');
  if (color) $('#' + color).trigger('click');

  $('textarea').val(localStorage.getItem('text'));

})