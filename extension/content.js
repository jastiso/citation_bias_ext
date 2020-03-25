// functions
function rotate(element, degree) {
  element.css({
      '-webkit-transform': 'rotate(' + degree + 'deg)',
      '-moz-transform': 'rotate(' + degree + 'deg)',
      '-ms-transform': 'rotate(' + degree + 'deg)',
      '-o-transform': 'rotate(' + degree + 'deg)',
      'transform': 'rotate(' + degree + 'deg)',
      'zoom': 1
  });
}

function display(percent, element) {
  var angle = 360 * percent

  if (angle <= 180) {
      var a1 = angle;
      var a2 = 0;
  } else {
       var a2 = angle - 180;
       var a1 = 180;
  }

  // set the transition
  rotate($(".slice1"), a1);
  rotate($(".slice2"), a2);

  $( '<div class="box"><div class="circle outer"></div><div class="clip1"><div class="slice1"></div></div><div class="clip2"><div class="slice2"></div></div><div class="circle inner"></div></div>' )
      .insertAfter(element.parent())
}

// get all papers on the page
$(document).ready(function() {
  
  // $(".gs_ab_md").append( '<div class="wrapper" data-anim="base wrapper"><div class="circle" data-anim="base left"></div><div class="circle" data-anim="base right"></div></div>' )
  chrome.storage.local.get('enabled', data => {
    if (data.enabled) { 
  

      $(".gs_rt").children().each(function(){

        // get url-encoded title
        var title = "title:'"+$(this).text()+"'"
        uri = encodeURI(title)
        api_req = 'https://api.crossref.org/works?query=' + uri + '&select=title,author&sort=score&order=desc'

        // check that isnt a [BOOK] or [CITATION] tag
        if (!($(this).hasClass('gs_ctc') || $(this).hasClass('gs_ctu'))){

          fetch(api_req)
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
              var title = info.message.items[0].title[0].replace('.',"").replace('</title>',"").replace('<title>',"")
              var cnt = 1
              
              while (cnt < info.message.items.length & ((title.includes('Faculty of 1000') | !(title.toLowerCase().includes($(this).text().toLowerCase().split('.').join("")))))){
                console.log("Correct title not first entry")
                if (info.message.items[cnt].length != 0){
                  title = info.message.items[cnt].title[0]
                  cnt = cnt + 1
                }
              }
              //check if we found a match
              var match = 1
              if (cnt == info.message.items.length){
                 match = 0
              }

              if (match == 1){
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
              } else {
                var LA_given = ""
                var LA_family = ""
                var FA_given = ""
                var FA_family = ""
              }
              // query genderize.io
              var gen_url = "https://api.genderize.io?name"
              if (FA_given != "" & LA_given != "") {
                gen_url = gen_url + "[]=" + FA_given + "&name[]=" + LA_given
              } else if (FA_given == "" & LA_given != ""){
              gen_url = gen_url + "=" + LA_given
              } else if (FA_given != "" & LA_given == ""){
                gen_url = gen_url + "=" + FA_given
              }

              fetch(gen_url)
              .then( (data) => data.json())
              .then( (info) => get_gender(info, FA_given, LA_given, FA_family, LA_family))
              
              var race_url = "https://api.nationalize.io?name"

              // first get country
              // fetch(race_url + "[]=" + FA_given + "&name[]=" + LA_given)
              // .then( (data) => data.json())
              // .then( (info) => get_country(info, FA_given, LA_given, FA_family, LA_family))
              // console.log(race_url + "[]=" + FA_given + "&name[]=" + LA_given)

              // fetch(race_url + '/origin/' + LA_given + '/' + LA_family)
              // .then( (data) => data.json())
              // .then( (info) => get_country(info, LA_given, LA_family))
              
              // // then get race
              // fetch(race_url + '/diaspora/' + country + '/' + FA_given + '/' + FA_family)
              // .then( (data) => data.json())
              // .then( (info) => get_race(info, FA_given, FA_family))

              // fetch(race_url + '/diaspora/' + country + '/' + LA_given + '/' + LA_family)
              // .then( (data) => data.json())
              // .then( (info) => get_race(info, LA_given, LA_family)) 



              // get the gender data from genderize.io
              const get_gender = (info, FA_given, LA_given, FA_family, LA_family) => {
                if (FA_given != "" & LA_given != ""){
                  FA_gen = JSON.stringify(info[0].gender).replace(/"/g, "")
                  FA_prob = JSON.stringify(info[0].probability)*100
                  LA_gen = JSON.stringify(info[1].gender).replace(/"/g, "")
                  LA_prob = JSON.stringify(info[1].probability)*100
                  // display
                  $( "<p class='gender'> <img class='logo' src='chrome-extension://lpbppoahccjbbephpehhppipdoabdpnk/images/logo.png' hieght=12 width=12><b> First author:</b> " + FA_given + " " + FA_family + " <b>gender:</b> " + FA_gen + " " + FA_prob
                  + "%<br><img class='logo' src='chrome-extension://lpbppoahccjbbephpehhppipdoabdpnk/images/logo.png' hieght=12 width=12><b> Last author:</b> " + LA_given + " " + LA_family + " <b>gender:</b> " + LA_gen + " " + LA_prob +
                  "%</p>" ).insertAfter($(this).parent())
                } else if (FA_given == "" & LA_given != ""){
                  FA_gen = ""
                  FA_prob = ""
                  LA_gen = JSON.stringify(info[0].gender).replace(/"/g, "")
                  LA_prob = JSON.stringify(info[0].probability)*100
                  // display
                  $( "<p class='gender'> <img src='chrome-extension://lpbppoahccjbbephpehhppipdoabdpnk/images/logo.png' height=16 width=16><b> Last author:</b> " + LA_given + " " + LA_family + " <b>gender:</b> " + LA_gen + " " + LA_prob +
                  "%</p>" ).insertAfter($(this).parent())
                } else if (FA_given == "" & LA_given != ""){
                  LA_gen = ""
                  LA_prob = ""
                  FA_gen = JSON.stringify(info[0].gender).replace(/"/g, "")
                  FA_prob = JSON.stringify(info[0].probability)*100
                  //display
                  $( "<p class='gender'> <img src='chrome-extension://lpbppoahccjbbephpehhppipdoabdpnk/images/logo.png' hieght=16 width=16><b> First author:</b> " + FA_given + " " + FA_family + " <b>gender:</b> " + FA_gen + " " + FA_prob
                  + "%</p>").insertAfter($(this).parent())
                } else {
                  FA_gen = ""
                  FA_prob = ""
                  LA_gen = ""
                  LA_prob = ""
                }
              }

              // get the country data from namesor
              const get_country = (info,  FA_given, LA_given, FA_family, LA_family) => {
                FA_nat = JSON.stringify(info[0].country[0].country_id)
                FA_prob = JSON.stringify(info[0].country[0].probability)
                LA_nat = JSON.stringify(info[1].country[0].country_id)
                LA_prob = JSON.stringify(info[1].country[0].probability)

                // display
                $( "<p>First author:" + FA_given + " " + FA_family + " country: " + FA_nat + " " + FA_prob
                + "; Last author: " + LA_given + " " + LA_family + " country: " + LA_nat + " " + LA_prob +
                "</p>" ).insertAfter($(this).parent())
              }
            }
          }
        }
      })
    }
  }) 
})
  