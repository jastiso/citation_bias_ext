// get all papers on the page
$(document).ready(function() {
  $(".gs_rt").children().each(function(){
    // get url-encoded title
    var title = "title:'"+$(this).text()+"'"
    uri = encodeURI(title)
    api_req = 'https://api.crossref.org/works?query=' + uri + '&select=title,author&sort=score&order=desc'

    // check that isnt a [BOOK] or [CITATION] tag
    if (!($(this).hasClass('gs_ctc') || $(this).hasClass('gs_ctu'))){
      fetch(api_req)
      .then( (data) => data.json())
      .then( (info) => disp(info, api_req))
      .catch(function(error) {
        // If there is any error you will catch them here
        console.log(error)
      })
      
      // display function
      const disp = (info) => {
        if (info.status == "ok"){
          // drop F1000 reviews, and check if correct match wasnt first result
          var title = info.message.items[0].title[0]
          var cnt = 0
          while (title.includes('Faculty of 1000') | title.toLowerCase() != $(this).text().toLowerCase()){
            cnt = cnt + 1
            title = info.message.items[cnt].title[0]
          }

          // get relevant names
          var FA_given = JSON.stringify(info.message.items[cnt].author[0].given)
          var FA_family = JSON.stringify(info.message.items[cnt].author[0].family)
          if (info.message.items[cnt].author.length > 1){
            var LA_given = JSON.stringify(info.message.items[cnt].author[info.message.items[cnt].author.length-1].given)
            var LA_family = JSON.stringify(info.message.items[cnt].author[info.message.items[cnt].author.length-1].family)
          } else {
            var LA_given = ""
            var LA_family = ""
          }

          // clean up names
          FA_given = FA_given.replace('.', ' ').split(' ')[0]
          LA_given = LA_given.replace('.', ' ').split(' ')[0]

          // display
          $( "<p>First author:" + FA_given + " " + FA_family + "; Last author: " + LA_given + " " +
           LA_family + "</p>" ).insertAfter($(this).parent())
          $( '<img src="https://emojis.slackmojis.com/emojis/images/1578178080/7438/verified.png?1578178080" />' )
          .insertAfter($(this).parent())
          $( '<img src="https://emojis.slackmojis.com/emojis/images/1578178080/7438/verified.png?1578178080" />' )
          .insertAfter($(this).parent())
          $( '<img src="https://emojis.slackmojis.com/emojis/images/1578178080/7438/verified.png?1578178080" />' )
          .insertAfter($(this).parent())
          $( '<img src="https://emojis.slackmojis.com/emojis/images/1578178080/7438/verified.png?1578178080" />' )
          .insertAfter($(this).parent())  

        }
      }
    }
  }) 
})
  