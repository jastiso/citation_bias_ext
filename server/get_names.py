from habanero import Crossref
cr = Crossref()

@app.route("/get_names")
def get_names(title):
    works = cr.works(query = f'title:"{title}"', select = ["title","author"], cursor_max=1)
    if works['message']['items'][0]['title'][0].lower() == title.lower():
        authors = works['message']['items'][0]['author']
        
        # check the all fields are available
        if not 'given' in authors[0]:
            FA = ''
        else:
            # trim initials
            FA = authors[0]['given'].replace('.',' ').split()[0]
        if not 'given' in authors[-1]:
            LA = ''
        else:
            # trim initials
            LA = authors[-1]['given'].replace('.',' ').split()[0]
        
        # throw out if full first name not available
        if len(FA) == 1:
            FA = ''
        if len(LA) == 1:
            LA = ''
        names = {'FA':{'given':FA, 'family':authors[0]['family']}, 
                 'LA':{'given':LA, 'family':authors[-1]['family']}}
    else:
        names = {'FA':{'given':'', 'family':''}, 
                 'LA':{'given':'', 'family':''}}
    return names