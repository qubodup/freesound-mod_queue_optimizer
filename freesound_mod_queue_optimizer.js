@-moz-document url-prefix("https://freesound.org/tickets/moderation/assigned/") {
/* WARNING FFS */

#moderate-form-wrapper form:has(input[type="radio"][value="Delete"]:checked) {
    background-color: lightcoral;
}
#moderate-form-wrapper form:has(input[type="radio"][value="Approve"]:checked) {
    background-color: lightgreen;
}
#moderate-form-wrapper form:has(input[type="radio"][value="Defer"]:checked) {
    background-color: Khaki;
}
#moderate-form-wrapper form:has(input[type="radio"][value="Return"]:checked) {
    background-color: lightgrey;
}
#moderate-form-wrapper form:has(input[type="radio"][value="Whitelist"]:checked) {
    background-color: hotpink;
}

/* minify */
html {background-color: white;}

nav.bw-nav,
h1,
.divider-light,
footer
{
    display: none;
}

.navbar-space-filler,
.v-spacing-3
{
    padding: 0;
    margin: 0;
}

body > div.bw-page > div
{
    padding-top: 19px;
}

body > div.bw-page > div > div > div.col-12.no-paddings.v-spacing-5 > div:nth-child(4) > div > div.col-lg-7{
    padding: 0;
}

body > div.bw-page > div > div > div.col-12.no-paddings.v-spacing-5 > div:nth-child(4) > div > div.col-lg-7 > div > div.v-spacing-1 > div
{
    width: 50%;
    padding: 4px;
    margin: 0;
    border-bottom: 1px solid grey;
    border-right: 1px solid grey;
    background-color: white !important;
    position: fixed;
    top:0;
    z-index: 1;
}

.navbar-messages
{
    margin: 0;
    padding: 4px;
    border-bottom: 1px solid grey;
    border-left: 1px solid grey;
    background-color: white !important;
    float: right;
    position: fixed;
    right:0;
    top:0;
    z-index: 2;
}

body > div.bw-page > div > div > div.col-12.no-paddings.v-spacing-5 > div:nth-child(4) > div > div.col-lg-7 > div 
{
    margin-top: 20px;
}

body > div.bw-page > div > div > div.col-12.no-paddings.v-spacing-5 > div:nth-child(4) > div > div.col-lg-7 > div > div.v-spacing-3 {
    overflow-y: auto !important;
    max-height: none !important;
}

/* normal scroll */

body > div.bw-page > div > div > div.col-12.no-paddings.v-spacing-5 > div:nth-child(4) > div {
    display: inherit;
}


/* max width */
div.container
{
    width: 100% !important;
    max-width: 100% !important;
}

/* split */
body > div.bw-page > div > div > div.col-12.no-paddings.v-spacing-5 > div:nth-child(4) > div > div.col-lg-7,
body > div.bw-page > div > div > div.col-12.no-paddings.v-spacing-5 > div:nth-child(4) > div > div.col-lg-5
{
    flex: 0 0 50%;
    width: 50%;
    max-width: 50%;
}

body > div.bw-page > div > div > div.col-12.no-paddings.v-spacing-5 > div:nth-child(4) > div > div.col-lg-7
{
    float: left;
}
body > div.bw-page > div > div > div.col-12.no-paddings.v-spacing-5 > div:nth-child(4) > div > div.col-lg-5 {
    float: right;
}

/* color nav */

a#select-other {
    background-color: lightgreen;
    color: black;
    padding: 3px;
}

/* I'm a 90's kid */
* {
    border-radius: 0 !important;
}

/* highlight description */

.collapsable-block > div.v-spacing-top-1 {
    border-left: 4px solid turquoise;
    padding-left: 8px;
}
}
