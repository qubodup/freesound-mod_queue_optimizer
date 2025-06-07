// ==UserScript==
// @name         More buttons in Freesound Moderation 2025
// @namespace    https://qubodup.github.io/
// @version      2025-06-07
// @description  Reduce burnout
// @author       qubodup
// @match        https://freesound.org/tickets/moderation/assigned/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAuklEQVQImU3OMQqCYByG8RfrDJl9kHgAiSDoBFHHaOtIDjl0AtGgRSxaIwhpCJqsUCsw0M/hC0n/DRL0G5/pAf0cDj79kfBj20sASfIqigKABEAIkabZ6XT2vI1lLaMoripq6Ho/CC7X662qSs/bKkq7LD+73V6aTEauu/b9Y6+nZ1nGWMdxVuPxCET0eDyn01kQXAxjbpqLMAw5500AstzSNFVVu8PhQIg3YwwA6rk4vhMR5zzP87p8AViZfMpUVopVAAAAAElFTkSuQmCC
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // count repeat users to identify solo sounds
    var userCounter = {};
    $('table#assigned-tickets-table tr:not(.deferred)').each(function(){
        let user = $(this).find('td:nth-child(2)').text();
        if (user in userCounter) { userCounter[user] += 1; }
        else { userCounter[user] = 1; }
    });

    $('table#assigned-tickets-table tr:not(.deferred)').each(function(){
        let user = $(this).find('td:nth-child(2)').text();
        if (userCounter[user] == 1) {
            $(this).find('td:nth-child(2)').addClass('onlyone');
        }
    });

    // close modal by clicking outside of it https://stackoverflow.com/a/37573735/188159
    $('body').click(function (event) {
        if(!$(event.target).closest('.modal-content').length && $(event.target).is('.modal-wrapper')) {
            $("div.modal-header > span.close").click();
        }
    });

    // rest of stuff
    let text_sep = "<span class='h-spacing-left-1 h-spacing-1 text-grey'>·</span>"
    let text_language = `Hello and thank you for contributing to Freesound.
We would love to publish it but could you possibly add English title, description and tags first?

You can keep the original description and simply add the English text. This will ensure that your sounds are discoverable in the search, as our website and user-base primarily work with English.

Also, please include as much detail as you can in the description/tags.

To edit the title/description/keywords: 1. Click the sound name on the right 2. Click "Edit sound description" 3. When done, click "Save sound description"

Many thanks!`

    let text_howto = `\nTo edit the title/description/keywords: 1. Click the sound name on the right 2. Click "Edit sound description" 3. When done, click "Save sound description"`

    let text_deviceplz = `Thank you for contributing! The sound is public. We also encourage sharing 🎤recording devices used (in the description, not here)`
    let text_howplz = `Thank you for contributing! The sound is now public. We also encourage sharing in broad strokes how sounds were 🔨made (in the description, not here)`
    let text_tagsplz =
`Thank you for contributing! The sound is now public. We also encourage adding more tags to make the sound easier to search (in the description, not here)
For example:


Many thanks!`

    let text_silent = `Thank you for contributing!

A substantial part of your sound is silence which likely stems from an accidentally incorrect export (a common issue with some pieces of software).

Please cut and re-upload, and then delete the version with too much silence via https://freesound.org/home/sounds/manage/pending_description/

We also encourage sharing 🎤recording devices or 🔨creation process used.

Thank you for your understanding!`

    let text_clarify =
`Thank you for contributing! As copyright is key on Freesound, can you please clarify whether you 🔨made the audio or if it is taken from somewhere like a tv show/video game/sound library or anywhere else?
If it is yours, can you please edit title/tags/description to be descriptive of the sound, so it can be found using search?
To edit: 1. Click the sound name on the right 2. Click "Edit sound description" 3. When done, click "Save sound description"
(The sound might get deleted after 2 weeks of no action taken)

Many thanks!`

    let text_meme =
`Thank you for contributing to Freesound. Unfortunately we had to delete this sound.

Freesound only hosts files that are not copyright infringing. We reject audio taken from copyright protected media without permission. Please do not upload work owned by others. Only sounds that you have 🔨made yourself or own the copyright.

Additional comment: archive.org might be an appropriate place for archiving memes. On freesound, copyright is core and it is mostly impossible to clarify the legal status of random memes.

If you would like to find out what you can upload, please take a look at https://freesound.org/help/faq/#what-sounds-are-legal-to-put-on-freesound

Thank you for your understanding!`

    let text_copymusic =
`Thank you for contributing to Freesound. Unfortunately we had to delete this sound.

Freesound only hosts files that are not copyright infringing. It appears that music playing in the recording is copyrighted.

If you would like to find out what you can upload, please take a look at https://freesound.org/help/faq/#what-sounds-are-legal-to-put-on-freesound

Thank you for your understanding!`

    let text_game =
`Thank you for contributing to Freesound. Unfortunately we had to delete this sound.

Freesound only hosts files that are not copyright infringing. We reject audio taken from copyright protected media without permission. Please do not upload work owned by others. Only sounds that you have made yourself or own the copyright.

Additional comment: The desire to archive game sounds is understandable. archive.org might be an appropriate place for archiving game sounds. A resource even more focused on the topic is sounds-resource.com . On Freesound, copyright is core and sounds in games are all protected by copyright of the developers or the libraries they used for development with only few exceptions like open source games or games that happen to use sounds from Freesound.

If you would like to find out what you can upload, please take a look at https://freesound.org/help/faq/#what-sounds-are-legal-to-put-on-freesound

Thank you for your understanding!`

    let text_composition =
`Thank you for contributing! As copyright is core on Freesound, please clarify whether this is your own 🎶composition or taken from a website/music track/music library?
If yours: could you please add to the description in general terms how it was 🔨made?
If not yours: please let us know from where so we can check the copyright situation.
To edit the sound info: 1. Click the sound name on the right 2. Click "Edit sound description" 3. When done, click "Save sound description"

Many thanks!`

    let text_recording =
`Thank you for contributing! As copyright is core on Freesound, please let us know whether this is your own 🎤recording or taken from a website/sound library?
If yours: could you please add to the description what device was used to 🎤record it?
If not yours: please let us know from where.
To edit the sound info: 1. Click the sound name on the right 2. Click "Edit sound description" 3. When done, click "Save sound description"

Many thanks!`

    let text_filehost =
`Hi, as this upload has minimal tags/description, it could be the intent is to use Freesound as a file host.

Freesound is a creative and scientific community, see https://freesound.org/help/faq/#what-is-this-site-anyway

You can delete uploads at https://freesound.org/home/sounds/manage/pending_moderation/

File hosting services: https://en.wikipedia.org/wiki/Comparison_of_file_hosting_services

Otherwise please clarify.

Many thanks!`

    let text_lazystudent =
`Hi, as this upload has minimal tags/description, it could be the intent is to use Freesound as a file host.

Freesound is a creative and scientific community, see https://freesound.org/help/faq/#what-is-this-site-anyway

You can delete uploads at https://freesound.org/home/sounds/manage/pending_moderation/

File hosting services: https://en.wikipedia.org/wiki/Comparison_of_file_hosting_services


Otherwise:

We would love to publish it but could you possibly add English title, description and tags first?

You can keep the original description and simply add the English text. This will ensure that your sounds are discoverable in the search, as our website and user-base primarily work with English.

Also, please include as much detail as you can in the description/tags.



Please make sure each sound has their own tags/description that sets it apart from the other sounds.



To edit the title/description/keywords: 1. Click the sound name on the right 2. Click "Edit sound description" 3. When done, click "Save sound description"


Many thanks!`

    let text_lazytags =
`Hey there. Thank you for contributing to Freesound.

Freesound being a community of creators and researchers means that sounds need to be findable in the sea of 650,000 other sounds. For this reason we ask to add more details describing this sound to set it apart from other files that have similar tags and descriptions.

For example adding some more tags could help others find this creation.

To edit the title/description/keywords: 1. Click the sound name on the right 2. Click "Edit sound description" 3. When done, click "Save sound description"

Many thanks!`

    // Add quick moderation buttons
let text_all_buttons =
`<a class='morebuttons' id='quick-device' data-text='` + text_deviceplz + `' title='✅ but 🎤?'>👍🎤?</a>` + text_sep +
`<a class='morebuttons' id='quick-how' data-text='` + text_howplz + `' title='✅ but 🔨?'>👍🔨?</a>` + text_sep +
`<a class='morebuttons' id='quick-tags' data-text='` + text_tagsplz + `' title='✅ but 🏷?'>👍🏷?</a>` + text_sep +
`<a class='morebuttons' id='quick-language' data-action='Defer' data-text='` + text_language + `' title='plz fix language'>🌎lng</a>` + text_sep +
`<a class='morebuttons' id='quick-timeout' data-action='Defer' data-text='\nPlease note this ticket will time out in two weeks.' title='timeout in 2 weeks'>🕑2w</a>` + text_sep +
`<a class='morebuttons' id='quick-silent' data-action='Defer' data-text='` + text_silent + `' title='silent, please re-upload'>🔇</a>` + text_sep +
`<a class='morebuttons' id='quick-recording' data-action='Defer' data-text='` + text_recording + `'>your 🎤rec﹖</a>` + text_sep +
`<a class='morebuttons' id='quick-composition' data-action='Defer' data-text='` + text_composition + `'>your 🎶﹖</a>` + text_sep +
`<a class='morebuttons' id='quick-clarify' data-action='Defer' data-text='` + text_clarify + `'>clarify origin﹖</a>` + text_sep +
`<a class='morebuttons' id='quick-meme' data-action='Delete' data-text='` + text_copymusic + `'>🛇🎵©</a>` + text_sep +
`<a class='morebuttons' id='quick-meme' data-action='Delete' data-text='` + text_meme + `'>🛇meme</a>` + text_sep +
`<a class='morebuttons' id='quick-game' data-action='Delete' data-text='` + text_game + `'>🛇🎮🕹</a>` + text_sep +
`<a class='morebuttons' id='quick-filehost' data-action='Defer' data-text='` + text_filehost + `' title='file host?'>📁host</a>` + text_sep +
`<a class='morebuttons' id='quick-howto' data-text='` + text_howto + `'>﹖Howto</a>` + text_sep +
`<a class='morebuttons' id='quick-lazystudent' data-action='Defer' data-text='` + text_lazystudent + `'>lazy🌎👨‍🎓</a>` + text_sep +
`<a class='morebuttons' id='quick-lazytags' data-action='Defer' data-text='` + text_lazytags + `'>more tags 🎨🤝⚛🎓</a>` + text_sep
$("#template-responses > span:nth-child(1)").after(text_all_buttons);

    //console.log(text_all_buttons);

$('a.morebuttons').click(function(){
    //console.log('click');
    // insert text
    $('#id_message').get(0).value += $(this).attr('data-text');

    // activate action https://stackoverflow.com/a/1318091/188159
    let attr = $(this).attr('data-action');
    //console.log(attr);
    if (typeof attr !== 'undefined' && attr !== false) {
        console.log('trying to radio');
        $('#id_action label > input[value=' + attr + ']').parent().click();
    }

    // resize
    $("#id_message").height( 40 );
    $("#id_message").height( $("#id_message")[0].scrollHeight );

    // focus
    $('#id_message').focus();
});

    // add action selection to legacy templates
    $("#template-responses > a:contains('Illegal')").click( function(){ $('ul#id_action > li > label > input[value="Delete"]').click(); });
    $("#template-responses > a:contains('Music')").click( function(){ $('ul#id_action > li > label > input[value="Delete"]').click(); });
    $("#template-responses > a:contains('Not a Sound')").click( function(){ $('ul#id_action > li > label > input[value="Delete"]').click(); });
    $("#template-responses > a:contains('Language')").click( function(){ $('ul#id_action > li > label > input[value="Defer"]').click(); });
    $("#template-responses > a:contains('Description/Tags')").click( function(){ $('ul#id_action > li > label > input[value="Defer"]').click(); });
    $("#template-responses > a:contains('Credit Sounds')").click( function(){ $('ul#id_action > li > label > input[value="Defer"]').click(); });
    $("#template-responses > a:contains('Verify Details')").click( function(){ $('ul#id_action > li > label > input[value="Defer"]').click(); });
    $("#template-responses > a:contains('License Mismatch')").click( function(){ $('ul#id_action > li > label > input[value="Defer"]').click(); });
    $("#template-responses > a:contains('Permission')").click( function(){ $('ul#id_action > li > label > input[value="Defer"]').click(); });
    $("#template-responses > a:contains('Timeout')").click( function(){ $('ul#id_action > li > label > input[value="Defer"]').click(); });

    // add css
    const style = document.createElement('style');
    style.textContent = `
a.morebuttons { background-color: white; }
tr > td:nth-child(2).onlyone { background-color: PeachPuff !important; border-width: 0 1px; border-color: #333; border-style: solid; }
`
    document.head.append(style);

    /* 2025-06 upgrade: add days ago to comment time stamps */

        // Utility: Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            if (!inThrottle) {
                func.apply(this, arguments);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Parse date string like "Jan. 2, 2025, 6:27 p.m." or "June 5, 2024, 5:40 p.m."
    function parseDateString(dateStr) {
        const cleaned = dateStr
        .replace(/\./g, '') // Remove all periods
        .replace(/\bpm\b/i, 'PM') // Normalize pm
        .replace(/\bam\b/i, 'AM'); // Normalize am
        const date = new Date(cleaned);
        return isNaN(date) ? null : date;
    }

    // Calculate days ago from now
    function daysAgo(date) {
        const now = new Date();
        const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        return diff;
    }

    // Core logic to check and modify content
    function checkCommentsSection() {
        const spans = document.querySelectorAll('#ticket-comments-section span.text-grey:not(.more-buttons-checked)');
        spans.forEach(span => {
            // Match formats like "Jan. 2, 2025, 6:27 p.m." or "June 5, 2024, 5:40 p.m."
            const match = span.textContent.match(/\b(?:\w+\.*)\s+\d{1,2},\s+\d{4},\s+\d{1,2}:\d{2}\s*[ap]\.m\./i);
            if (match) {
                const date = parseDateString(match[0]);
                if (date) {
                    const days = daysAgo(date);
                    span.classList.add('more-buttons-checked');

                    const tag = document.createElement('span');
                    tag.textContent = ` (${days} days ago)`;
                    tag.style.backgroundColor = days > 30 ? 'yellow' : 'lightgreen';
                    tag.style.marginLeft = '5px';

                    span.appendChild(tag);
                }
            }
        });
    }

    // Throttled handler
    const throttledCheck = throttle(checkCommentsSection, 500);

    // Observe changes in #ticket-comments-section
    const observer = new MutationObserver(throttledCheck);
    const section = document.querySelector('#ticket-comments-section');
    if (section) {
        observer.observe(section, { childList: true, subtree: true });
    }

    // Initial run
    checkCommentsSection();

    /* 2025-06 upgrade: CTRL+arrow key for up/down navigation in sound list for quick comparison of mass uploads */

    $(document).on('keydown', function (e) {
        // Only trigger on Ctrl + ArrowUp or ArrowDown and ignore repeats
        if ((e.ctrlKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) && !e.originalEvent.repeat) {
            const $table = $('#assigned-tickets-table');
            if ($table.length === 0) return;

            const $rows = $table.find('tbody tr');
            const $selected = $rows.filter('.selected');

            // If not exactly one selected row
            if ($selected.length === 0) { // select first
                const $firstRowLabel = $rows.eq(0).find('td:first label');
                if ($firstRowLabel.length) $firstRowLabel.click();
                return;
            } else if ($selected.length > 1) { // abort and warn
                const $selectNone = $('#select-none');
                $selectNone.css('background-color', 'red')
                    .animate({ opacity: 0 }, 50)
                    .animate({ opacity: 1 }, 250, function () {
                    $selectNone.css('background-color', '');
                });
                return;
            }

            const index = $rows.index($selected);
            let $targetRow;

            if (e.key === 'ArrowUp' && index > 0) {
                $targetRow = $rows.eq(index - 1);
            } else if (e.key === 'ArrowDown' && index < $rows.length - 1) {
                $targetRow = $rows.eq(index + 1);
            }

            if ($targetRow && $targetRow.length) {
                const $label = $targetRow.find('td:first label');
                if ($label.length) $label.click();
            }

        }
    });

    /* 2025-06 upgrade: color users if present multiple times in list */
    (function () {
        const $rows = $('#assigned-tickets-table tbody tr');
        const idMap = {};

        // Collect IDs and count occurrences
        $rows.each(function () {
            const $link = $(this).find('td:nth-child(2) a[data-modal-content-url]');
            const url = $link.attr('data-modal-content-url');
            const match = url?.match(/\/annotations\/(\d+)\//);
            if (match) {
                const id = match[1];
                if (!idMap[id]) idMap[id] = [];
                idMap[id].push($(this).find('td:nth-child(2)'));
            }
        });

        // Only style IDs that occur more than once
        for (const id in idMap) {
            if (idMap[id].length <= 1) continue;

            // Generate a stable, high-contrast color from ID
            const color = idToColor(id);
            const textColor = getReadableTextColor(color);

            // Apply styles
            idMap[id].forEach($td => {
                $td[0].style.setProperty('background-color', color, 'important');
                $td[0].style.setProperty('color', textColor, 'important');
                $td.find('a')[0].style.setProperty('color', textColor, 'important');
            });
        }

        // Utility: generate visually distinct color from ID
        function idToColor(id) {
            const hash = murmurhash3(id);
            const hue = hash % 360;
            const sat = 70 + (hash % 20); // 70–89%
            const light = 50 + ((hash >> 3) % 10); // 50–59%
            return `hsl(${hue}, ${sat}%, ${light}%)`;
        }

        // Utility: determine readable text color (black or white)
        function getReadableTextColor(bgColor) {
            const dummy = $('<div>').css('color', bgColor).appendTo('body');
            const rgb = dummy.css('color').match(/\d+/g).map(Number);
            dummy.remove();
            const [r, g, b] = rgb;
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128 ? 'black' : 'white';
        }

        // Simple MurmurHash3 (32-bit) hash to get stable pseudo-randomness from id
        function murmurhash3(key, seed = 0) {
            let h1 = seed ^ key.length;
            for (let i = 0; i < key.length; i++) {
                let k1 = key.charCodeAt(i);
                k1 = Math.imul(k1, 0xcc9e2d51);
                k1 = (k1 << 15) | (k1 >>> 17);
                k1 = Math.imul(k1, 0x1b873593);
                h1 ^= k1;
                h1 = (h1 << 13) | (h1 >>> 19);
                h1 = Math.imul(h1, 5) + 0xe6546b64;
            }
            h1 ^= key.length;
            h1 ^= h1 >>> 16;
            h1 = Math.imul(h1, 0x85ebca6b);
            h1 ^= h1 >>> 13;
            h1 = Math.imul(h1, 0xc2b2ae35);
            h1 ^= h1 >>> 16;
            return h1 >>> 0;
        }
    })();

})();
