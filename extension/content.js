// get all papers on the page
$(document).ready(function() {
  $(".gs_rt").children().each(function(){
    var title = $(this).text()

    // check that isnt a [BOOK] or [CITATION] tag
    if (!($(this).hasClass('gs_ctc') || $(this).hasClass('gs_ctu'))){
      $( "<p>" + title + "</p>" ).insertAfter($(this).parent())
      $( '<img src="https://emojis.slackmojis.com/emojis/images/1578178080/7438/verified.png?1578178080" />' ).insertAfter($(this).parent())
      $( '<img src="https://emojis.slackmojis.com/emojis/images/1578178080/7438/verified.png?1578178080" />' ).insertAfter($(this).parent())
      $( '<img src="https://emojis.slackmojis.com/emojis/images/1578178080/7438/verified.png?1578178080" />' ).insertAfter($(this).parent())
      $( '<img src="https://emojis.slackmojis.com/emojis/images/1578178080/7438/verified.png?1578178080" />' ).insertAfter($(this).parent())
    }
  }) 
});
  