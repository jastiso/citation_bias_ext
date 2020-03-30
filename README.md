# Citation Bias Chrome Extension
The goal of this project is to create an extension for Google Chrome that will display probabilistic gender information about the first and last authors of papers on Google Scholar's search page.

Motivated from work by J. D. Dworkin, K. A. Linn, E. G. Teich, P. Zurn, R. T. Shinohara, and D. S. Bassett (2020). bioRxiv. doi: https://doi.org/10.1101/2020.01.03.894378

If you would like to receive emails when I update the extension while it is still in its beta form, shoot me an emaiL (get my contact info here: http://www.jenniferstiso.com/ 

## Instructions
This project is currently in the beta stage, and therefore is not yet available on the Chrome Extension store. To use it, you must add it in "developer mode".
1. Download this GitHub repository (click the green "clone or download button" followed by "Download as zip"). Unzip the folder.
2. Open the Extension Management page by navigating to chrome://extensions.
3. Enable Developer Mode by clicking the toggle switch in the top right corner next to Developer mode.
4. Click the LOAD UNPACKED button and select the "extension" directory under "citation_bias_ext" (inside the unzipped folder that you just downloaded called "citation_bias_ext").
5. You're done! You should now see a new, colorful Google Scholar icon on your chrome browser. You can click this icon to toggle the extension on and off.

## Caveats
1. Typically, *gender* is thought of as a self-identity that individual expressed behaviorally. Since our extension uses only first names, we have limited ability to actually capture this definition of gender. It is more accurate to think of the probabilities displayed for gender as *perceived gender*, rather than an estimate of gender identity. Additionally, this extension only shows probabilities for *male* or *female* genders, and incorrectly assumes that all people fall into that binary. 
2. Gender is determined using genderize.io api, which supports names across many countries taken from social media data. This database was chosen because it can support a large number of queries and is not limited to the US, but is still subject to error. Comparative reports (1. Karimi, F., Wagner, C., Lemmerich, F., Jadidi, M. & Strohmaier, M. Inferring Gender from Names on the Web: A Comparative Evaluation of Gender Detection Methods. in Proceedings of the 25th International Conference Companion on World Wide Web 53–54 (International World Wide Web Conferences Steering Committee, 2016). doi:10.1145/2872518.2889385) listed it's overall accuracy at 82%. While this database was chosen because it contained data from multiple countries, the countries that it performs worst on, in order, are China, South Korea, and Brazil.
3. Gender bias is not the only type of bias present in citation practices, and the current extension does not account for any kind of intersectionality. We are currently working on adding probabilistic race information to the extension to help mitigate this.
