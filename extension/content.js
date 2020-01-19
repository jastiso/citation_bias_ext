// get all papers on the page
$(document).ready(function() {
  $(".gs_rt").children().each(function(){
    var title = $(this).text()

    // check that isnt a [BOOK] or [CITATION] tag
    if (!($(this).hasClass('gs_ctc') || $(this).hasClass('gs_ctu'))){
      $( "<p>" + title + "</p>" ).insertAfter($(this).parent())
      $( '<img id="pic" src="https://emojis.slackmojis.com/emojis/images/1471119457/987/parrot.gif?1471119457" />' ).insertAfter($(this).parent())
      $('.pic').append('<img id="pic" src="https://emojis.slackmojis.com/emojis/images/1471119457/987/parrot.gif?1471119457" />')
    }
  }) 
});
  