// ==UserScript==
// @name         More buttons in Freesound Moderation 2024
// @namespace    https://qubodup.github.io/
// @version      2024-06-26
// @description  Reduce burnout
// @author       qubodup
// @match        https://freesound.org/tickets/moderation/assigned/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let text_sep = "<span class='h-spacing-left-1 h-spacing-1 text-grey'>·</span>"
    let text_language = `Hello and thank you for contributing to Freesound.
We would love to publish it but could you possibly add English title, description and tags first?

You can keep the original description and simply add the English text. This will ensure that your sounds are discoverable in the search, as our website and user-base primarily work with English.

Also, please include as much detail as you can in the description/tags.

To edit the title/description/keywords: 1. Click the sound name on the right 2. Click "Edit sound description" 3. When done, click "Save sound description"

Many thanks!`

    let text_howto = `\nTo edit the title/description/keywords: 1. Click the sound name on the right 2. Click "Edit sound description" 3. When done, click "Save sound description"`

    let text_deviceplz = `Thank you for contributing! The sound is now public. We also encourage sharing recording devices used (optional - click the sound name on the right, then click \"Edit sound description\" and save)`

    let text_silent = `Thank you for sharing! The file has unusual amounts of silence padding, which is a common issue with some software. Please re-upload the sound without long sections of complete silence in the file.`

    let text_clarify =
`Thank you for contributing! As copyright is key on Freesound, can you please clarify whether you made the audio or if it is taken from somewhere like a tv show/video game/sound library or anywhere else?
If it is yours, can you please edit title/tags/description to be descriptive of the sound, so it can be found using search?
To edit: 1. Click the sound name on the right 2. Click "Edit sound description" 3. When done, click "Save sound description"
(The sound might get deleted after 2 weeks of no action taken)`

    let text_meme =
`Thank you for contributing to Freesound. Unfortunately we had to delete this sound.

Freesound only hosts files that are not copyright infringing. We reject audio taken from copyright protected media without permission. Please do not upload work owned by others. Only sounds that you have made yourself or own the copyright.

Additional comment: archive.org might be an appropriate place for archiving memes. On freesound, copyright is core and it is mostly impossible to clarify the legal status of random memes.

If you would like to find out what you can upload, please take a look at https://freesound.org/help/faq/#what-sounds-are-legal-to-put-on-freesound

Thank you for your understanding!`

    let text_composition =
`Thank you for contributing! As copyright is core on Freesound, please clarify whether this your own composition or taken from a website/music track/music library?
If yours: could you please add to the description in general terms how it was made?
If not yours: please let us know from where so we can check the copyright situation.
To edit the sound info: 1. Click the sound name on the right 2. Click "Edit sound description" 3. When done, click "Save sound description"`

    let text_recording =
`Thank you for contributing! As copyright is core on Freesound, please let us know whether this is your own recording or taken from a website/sound library?
If yours: could you please add to the description what device was used to record it?
If not yours: please let us know from where.`

    // Add quick moderation buttons
let text_all_buttons =
`<a class='morebuttons' id='quick-device' data-text='` + text_deviceplz + `' title='✅ but 🎤?'>👍🎤?</a>` + text_sep + `
<a class='morebuttons' id='quick-language' data-action='Defer' data-text='` + text_language + `' title='plz fix language'>🌎lng</a>` + text_sep + `
<a class='morebuttons' id='quick-timeout' data-action='Defer' data-text='\nPlease note this ticket will time out in two weeks.' title='timeout in 2 weeks'>🕑2w</a>` + text_sep + `
<a class='morebuttons' id='quick-silent' data-action='Defer' data-text=` + text_silent + `">silent reup</a>` + text_sep + `
<a class='morebuttons' id='quick-recording' data-action='Defer' data-text='` + text_recording + `'>your rec﹖</a>` + text_sep + `
<a class='morebuttons' id='quick-composition' data-action='Defer' data-text='` + text_composition + `'>your comp﹖</a>` + text_sep + `
<a class='morebuttons' id='quick-clarify' data-action='Defer' data-text='` + text_clarify + `'>clarify origin﹖</a>` + text_sep + `
<a class='morebuttons' id='quick-meme' data-action='Delete' data-text='` + text_meme + `'>🛇meme</a>` + text_sep + `
<a class='morebuttons' id='quick-howto' data-text='` + text_howto + `'>﹖Howto</a>` + text_sep
$("#template-responses > span:nth-child(1)").after(text_all_buttons);

    console.log(text_all_buttons);

$('a.morebuttons').click(function(){
    // insert text
    $('#id_message').get(0).value += $(this).attr('data-text');

    // activate action https://stackoverflow.com/a/1318091/188159
    let attr = $(this).attr('data-action');
    if (typeof attr !== 'undefined' && attr !== false) {
        $('ul#id_action > li > label > input[value=' + attr + ']').click();
    }

    // resize
    $("#id_message").height( 40 );
    $("#id_message").height( $("#id_message")[0].scrollHeight );

    // focus
    $('#id_message').focus();
});

    // add css
    const style = document.createElement('style');
    style.textContent = `
a.morebuttons { background-color: white; }
`
    document.head.append(style);

})();
