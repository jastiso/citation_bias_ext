// variables
const max_res = 100;
const imgURL = chrome.runtime.getURL("images/logo.png");
const currentYear = (new Date).getFullYear();

// functions

// sometimes names are formatted with a first initial and a middle name. 
// if so, take the middle name as the authors first name
function checkMiddleName(name) {
  if (name.length == 0){
    given = ""
  } else if (name.length > 1){ 
    if (name[0].length == 1 & name[1].length > 1){
      given = name[1]
    } else {
      given = name[0]
    }
  } else {
    given = name[0]
  }
  return given
}

// removes punctuation
function cleanString(string) {
  string = string.replace(/[!":#$%&'()*+,-./;<=>?@[\]^_`{|}~]/g,"")
  string = string.replace(/[^\x00-\x7F]/g, "")
  return string.toLowerCase()
}


// get all papers on the page
$(document).ready(function() {
  // enable button - make sure the user turned the extension on
  chrome.storage.local.get('enabled', data => {
    if (data.enabled) { 
      var curr_page = window.location.href
      // google scholar and pubmed have different class names for paper titles
      // get the corresponding tag here
      if (curr_page.includes('scholar.google')){
        var item_tag = ".gs_rt"
      } else {
        var item_tag = '.docsum-content'
      }
       
      // for each paper on the current page
      $(item_tag).children().each(function(){

        // get date if we're on google scholar (which doesnt list DOIs)
        if (curr_page.includes('scholar.google')){
          var date = $(this).parent().siblings(".gs_a").text()
          date = date.split(' - ')[0]
          date = date.slice(date.length - 4)
        } else { // get DOI for pubmed
          var doi = $(this).siblings(".docsum-citation, .full-citation").children(".docsum-journal-citation, .full-journal-citation").text()
          doi = doi.split('doi: ')[1]
          if (doi){
            doi = doi.split(' ')[0]
            if (doi.endsWith('.')){
              doi = doi.slice(0,-1)
            }
          } 
        }

        // check that isnt a [BOOK] or [CITATION] tag for google scholar, and that this is the 'title' portion of pubmed
        // also checkts that this is not a gs profile results
        var gs_okay = (curr_page.includes('scholar.google') && !($(this).hasClass('gs_ctc') || $(this).hasClass('gs_ctu')))
        var pm_ok = (curr_page.includes('pubmed') && $(this).hasClass('docsum-title') )
        var gs_prof = curr_page.includes('scholar.google') && !($(this).attr('id'))
        if ((gs_okay || pm_ok) && !gs_prof){

          // get url-encoded title
          var title = "title:'"+$(this).text()+"'"
          uri = encodeURI(title)
          
          // check if date is reasonable
          if (doi) {
            api_req = 'https://api.crossref.org/works?filter=doi:' + encodeURI(doi) + '&query.bibliographic=' + uri + 
            '&select=title,author,DOI,published-online&sort=score&order=desc'
          } else if ($.isNumeric(date) & date > 1600 & date < currentYear ) {
            api_req = 'https://api.crossref.org/works?filter=from-pub-date:' + parseInt(date) + 
            ',until-pub-date:' + parseInt(date) + '&query.bibliographic=' + uri + 
            '&select=title,author,published-online&sort=score&order=desc'
          } else {
            api_req = 'https://api.crossref.org/works?query.bibliographic=' + uri + 
            '&select=title,author&sort=score&order=desc'
          }
          //console.log(api_req) // helpful for debugging

          // query crossref, to get author names from the title
          fetch(api_req)
          .then( (data) => data.json())
          .then( (info) => get_names(info))
          .catch(function(error) {
            // If there is any error you will catch them here
            doi = null
            console.log('First attempt failed. Trying wittout DOI or date.')
            fetch('https://api.crossref.org/works?query.bibliographic=' + uri + '\
            &select=title,author&sort=score&order=desc')
            .then( (data) => data.json())
            .then( (info) => get_names(info))
            .catch(function(error) {
              console.log(error)
            })
          })
          
          // get the names from crossref
          const get_names = (info) => {
            if (info.status == "ok"){
              if (doi){
                var api_doi = info.message.items[0].DOI
                var match = 1
                var cnt = 0
                if (api_doi != doi){
                    match = 0
                    console.log('Unable to match DOI')
                }
              } else {
                // drop F1000 reviews, Corrections, and check if correct match wasnt first result
                var title = info.message.items[0].title[0].replace('</title>',"").replace('<title>',"")
                // check if item is a correction
                var corr_flag = info.message.items[0].title[0].replace('</title>',"").replace('<title>',"").slice(0, 11) == 'Correction:'
                // clean up
                title = cleanString(title)
                // check if supplement
                title = title.replace('supplemental material for ', '')
                console.log(title)
                var cnt = 1
                // clean up the current item
                var item_name = cleanString($(this).text())

                // look through crossref items for a matching title
                while (cnt < info.message.items.length & cnt < max_res & 
                  (title.includes('faculty of 1000') | 
                  title.includes('f1000') | corr_flag | 
                  !(item_name.includes(title)))){
                  console.log("Correct title not first entry")
                  if (info.message.items[cnt].length != 0){
                    if (info.message.items[cnt].hasOwnProperty('title')){
                      //if theres no match, switch to the next entry
                      title = cleanString(info.message.items[cnt].title[0])
                      title = title.replace('supplemental material for ', '')
                      corr_flag = info.message.items[cnt].title[0].slice(0, 11) == 'Correction:'
                    }
                  }
                  cnt = cnt + 1
                  }
                //check if we found a match
                var match = 1
                if (cnt == info.message.items.length | cnt == max_res){
                    match = 0
                    console.log('Unable to match title')
                }
                cnt = cnt - 1
              }

              if (match == 1){
                // get relevant names
                if (info.message.items[cnt].hasOwnProperty('author')){
                  var FA_given = JSON.stringify(info.message.items[cnt].author[0].given)
                  var FA_family = JSON.stringify(info.message.items[cnt].author[0].family)

                  // avoid group affiliations at the end of author lists
                  if (info.message.items[cnt].author.length > 1 & info.message.items[cnt].author[info.message.items[cnt].author.length-1].hasOwnProperty('name')){
                    var LA_given = JSON.stringify(info.message.items[cnt].author[info.message.items[cnt].author.length-2].given)
                    var LA_family = JSON.stringify(info.message.items[cnt].author[info.message.items[cnt].author.length-2].family)
                  } else if (info.message.items[cnt].author.length) {
                    var LA_given = JSON.stringify(info.message.items[cnt].author[info.message.items[cnt].author.length-1].given)
                    var LA_family = JSON.stringify(info.message.items[cnt].author[info.message.items[cnt].author.length-1].family)               
                  } else {
                    var LA_given = ""
                    var LA_family = ""
                  }
                } else {
                  var FA_given = ""
                  var FA_family = ""
                  var LA_given = ""
                  var LA_family = ""
                }

                // clean up names
                FA_given = FA_given.replace(/\./g, ' ').replace(/"/g, "").split(' ')
                FA_given = FA_given.filter(function(n) { return n != ""; });
                LA_given = LA_given.replace(/\./g, ' ').replace(/"/g, "").split(' ')
                LA_given = LA_given.filter(function(n) { return n != ""; });
                // check for middle names
                FA_given = checkMiddleName(FA_given)
                LA_given = checkMiddleName(LA_given)
                // remove initials
                if (FA_given.length == 1){
                  FA_given = ""
                }
                if (LA_given.length == 1){
                  LA_given = ""
                }
                FA_family = FA_family.replace(/\./g, ' ').replace(/"/g, "")
                LA_family = LA_family.replace(/\./g, ' ').replace(/"/g, "")
                } else {
                var LA_given = ""
                var LA_family = ""
                var FA_given = ""
                var FA_family = ""
              }
              //replace special characters
              FA_given = FA_given.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
              LA_given = LA_given.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

              // query genderize.io
              var gen_url = "https://api.genderize.io?name"
              if (FA_given != "" & LA_given != "") {
                gen_url = gen_url + "[]=" + FA_given + "&name[]=" + LA_given
              } else if (FA_given == "" & LA_given != ""){
              gen_url = gen_url + "=" + LA_given
              } else if (FA_given != "" & LA_given == ""){
                gen_url = gen_url + "=" + FA_given
              }
              if (gen_url != "https://api.genderize.io?name"){
                fetch(gen_url)
                .then( (data) => data.json())
                .then( (info) => get_gender(info, FA_given, LA_given, FA_family, LA_family))
              }

              var race_url = "https://api.nationalize.io?name"
              
              // //  get race
              // fetch(race_url + '/diaspora/' + country + '/' + FA_given + '/' + FA_family)
              // .then( (data) => data.json())
              // .then( (info) => get_race(info, FA_given, FA_family))

              // fetch(race_url + '/diaspora/' + country + '/' + LA_given + '/' + LA_family)
              // .then( (data) => data.json())
              // .then( (info) => get_race(info, LA_given, LA_family)) 



              // get the gender data from genderize.io
              const get_gender = (info, FA_given, LA_given, FA_family, LA_family) => {
                if (FA_given != "" & LA_given != ""){
                  console.log('Both authors found')
                  FA_gen = JSON.stringify(info[0].gender).replace(/"/g, "")
                  FA_prob = JSON.stringify(info[0].probability)*100
                  LA_gen = JSON.stringify(info[1].gender).replace(/"/g, "")
                  LA_prob = JSON.stringify(info[1].probability)*100
                  
                  if (FA_gen == "female"){
                    FA_gen = "woman"
                  } else if (FA_gen = "male") {
                    FA_gen = "man"
                  } else {
                    FA_gen = "unknown"
                  }
                  if (LA_gen == "female"){
                    LA_gen = "woman"
                  } else if (LA_gen = "male") {
                    LA_gen = "man"
                  } else {
                    LA_gen = "unknown"
                  }


                  // display
                  $( "<p class='gender'> <img class='logo' src=" + imgURL + " hieght=12 width=12><b>\
                   First author:</b> " + FA_given + " " + FA_family + " <b>gender:</b> " + FA_gen + " " + FA_prob
                  + "%<br><img class='logo' src=" + imgURL + " hieght=12 width=12><b> \
                  Last author:</b> " + LA_given + " " + LA_family + " <b>gender:</b> " + LA_gen + " " + LA_prob +
                  "%</p>" ).insertAfter($(this).parent())
                } else if (FA_given == "" & LA_given != ""){
                  console.log("Last author found")
                  FA_gen = ""
                  FA_prob = ""
                  LA_gen = JSON.stringify(info.gender).replace(/"/g, "")
                  LA_prob = JSON.stringify(info.probability)*100

                  if (LA_gen == "female"){
                    LA_gen = "woman"
                  } else {
                    LA_gen = "man"
                  }
                
                  // display
                  $( "<p class='gender'> <img src=" + imgURL + " height=16 width=16><b> \
                  Last author:</b> " + LA_given + " " + LA_family + " <b>gender:</b> " + LA_gen + " " + LA_prob +
                  "%</p>" ).insertAfter($(this).parent())
                } else if (FA_given != "" & LA_given == ""){
                  console.log("First author found")
                  LA_gen = ""
                  LA_prob = ""
                  FA_gen = JSON.stringify(info.gender).replace(/"/g, "")
                  FA_prob = JSON.stringify(info.probability)*100

                  if (FA_gen == "female"){
                    FA_gen = "woman"
                  } else {
                    FA_gen = "man"
                  }

                  //display
                  $( "<p class='gender'> <img src=" + imgURL + " hieght=16 width=16><b> \
                  First author:</b> " + FA_given + " " + FA_family + " <b>gender:</b> " + FA_gen + " " + FA_prob
                  + "%</p>").insertAfter($(this).parent())
                } else {
                  console.log("No authors found")
                  FA_gen = ""
                  FA_prob = ""
                  LA_gen = ""
                  LA_prob = ""
                }
              }
            }
          }
        }
      })
    }
  }) 
})
  