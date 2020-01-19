// get all papers on the page
$(document).ready(function() {
  $(".gs_rt").children().each(function(){
    var title = $(this).text()
    if (!($(this).hasClass('gs_ctc') || $(this).hasClass('gs_ctu'))){
      $( "<p>" + title + "</p>" ).insertAfter($(this).parent())
    }
  }) 
});

// $(".gs_rt").mouseenter(function(){
//     var text = $(this).text()
//     alert(text);
//   });
  