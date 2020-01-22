// get all papers on the page
$(document).ready(function() {
  
 // $(".gs_ab_md").append( '<div class="wrapper" data-anim="base wrapper"><div class="circle" data-anim="base left"></div><div class="circle" data-anim="base right"></div></div>' )

  $(".gs_rt").children().each(function(){

    // get url-encoded title
    var title = "title:'"+$(this).text()+"'"
    uri = encodeURI(title)
    api_req = 'https://api.crossref.org/works?query=' + uri + '&select=title,author&sort=score&order=desc'

    // check that isnt a [BOOK] or [CITATION] tag
    if (!($(this).hasClass('gs_ctc') || $(this).hasClass('gs_ctu'))){
      $( '<div class="wrapper" data-anim="base wrapper"><div class="circle" data-anim="base left"></div></div>' )
      .insertAfter($(this).parent())
      $( '<div class="wrapper" data-anim="base wrapper"><div class="circle" data-anim="base left"></div></div>' )
      .insertAfter($(this).parent())
      $( '<div class="wrapper" data-anim="base wrapper"><div class="circle" data-anim="base left"></div></div>' )
      .insertAfter($(this).parent())
      $( '<div class="wrapper" data-anim="base wrapper"><div class="circle" data-anim="base left"></div></div>' )
      .insertAfter($(this).parent())
     /* fetch(api_req)
      .then( (data) => data.json())
      .then( (info) => get_names(info))
      .catch(function(error) {
        // If there is any error you will catch them here
        console.log(error)
      })
      
      // get the names from crossref
      const get_names = (info) => {
        if (info.status == "ok"){
          // drop F1000 reviews, and check if correct match wasnt first result
          var title = info.message.items[0].title[0]
          var cnt = 0
          while (title.includes('Faculty of 1000') | !(title.toLowerCase().includes($(this).text().toLowerCase().split('.').join("")))){
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
          FA_given = FA_given.replace('.', ' ').replace(/"/g, "").split(' ')[0]
          LA_given = LA_given.replace('.', ' ').replace(/"/g, "").split(' ')[0]
          if (FA_given.length == 1){
            FA_given = ""
          }
          if (LA_given.length == 1){
            LA_given = ""
          }
          FA_family = FA_family.replace('.', ' ').replace(/"/g, "")
          LA_family = LA_family.replace('.', ' ').replace(/"/g, "")

          // query genderize.io
          const gen_url = "https://api.genderize.io?name"
          if (FA_given != "" & LA_given != "")
            fetch(gen_url + "[]=" + FA_given + "&name[]=" + LA_given)
            .then( (data) => data.json())
            .then( (info) => get_gender(info, FA_given, FA_family, LA_given, LA_family))
        } else if (FA_given == "" & LA_given != ""){
          fetch(gen_url + "=" + LA_given)
          .then( (data) => data.json())
          .then( (info) => get_gender(info, FA_given, FA_family, LA_given, LA_family))
        } else if (FA_given != "" & LA_given == ""){
          fetch(gen_url + "=" + FA_given)
          .then( (data) => data.json())
          .then( (info) => get_gender(info, FA_given, FA_family, LA_given, LA_family))
        }
      }

      // get the gender data from genderize.io
      const get_gender = (info, FA_given, FA_family, LA_given, LA_family) => {
        if (FA_given != "" & LA_given != ""){
          FA_gen = JSON.stringify(info[0].gender)
          FA_prob = JSON.stringify(info[0].probability)
          LA_gen = JSON.stringify(info[1].gender)
          LA_prob = JSON.stringify(info[1].probability)
        } else if (FA_given == "" & LA_given != ""){
          FA_gen = ""
          FA_prob = ""
          LA_gen = JSON.stringify(info[0].gender)
          LA_prob = JSON.stringify(info[0].probability)
        } else if (FA_given == "" & LA_given != ""){
          LA_gen = ""
          LA_prob = ""
          FA_gen = JSON.stringify(info[0].gender)
          FA_prob = JSON.stringify(info[0].probability)
        }

         // display
        $( "<p>First author:" + FA_given + " " + FA_family + " gender: " + FA_gen + " " + FA_prob
        + "; Last author: " + LA_given + " " + LA_family + " gender: " + LA_gen + " " + LA_prob +
         "</p>" ).insertAfter($(this).parent())
        $( '<div class="wrapper" data-anim="base wrapper"><div class="circle" data-anim="base left"></div><div class="circle" data-anim="base right"></div></div>' )
        .insertAfter($(this).parent())
        $( '<img src="https://emojis.slackmojis.com/emojis/images/1578178080/7438/verified.png?1578178080" />' )
        .insertAfter($(this).parent())
        $( '<img src="https://emojis.slackmojis.com/emojis/images/1578178080/7438/verified.png?1578178080" />' )
        .insertAfter($(this).parent())
        $( '<img src="https://emojis.slackmojis.com/emojis/images/1578178080/7438/verified.png?1578178080" />' )
        .insertAfter($(this).parent())  
      } */
    } 
  }) 
})
  