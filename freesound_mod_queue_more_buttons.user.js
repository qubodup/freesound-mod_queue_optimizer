// ==UserScript==
// @name         More buttons in Freesound Moderation 2025
// @namespace    https://qubodup.github.io/
// @version      2025-12-02
// @description  Reduce burnout
// @author       qubodup
// @match        https://freesound.org/tickets/moderation/assigned/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAuklEQVQImU3OMQqCYByG8RfrDJl9kHgAiSDoBFHHaOtIDjl0AtGgRSxaIwhpCJqsUCsw0M/hC0n/DRL0G5/pAf0cDj79kfBj20sASfIqigKABEAIkabZ6XT2vI1lLaMoripq6Ho/CC7X662qSs/bKkq7LD+73V6aTEauu/b9Y6+nZ1nGWMdxVuPxCET0eDyn01kQXAxjbpqLMAw5500AstzSNFVVu8PhQIg3YwwA6rk4vhMR5zzP87p8AViZfMpUVopVAAAAAElFTkSuQmCC
// ==/UserScript==

(function() {
    'use strict';

    // highlight 'music' in sound info

    const keywords = ['music', 'bpm', '，', 'ai-generated']; // Add more as needed

    setInterval(() => {
        const divs = document.querySelectorAll('div[id^="collapsable-sound-info-"]:not(.musicchecked)');
        divs.forEach(div => {
            div.classList.add('musicchecked');
            highlightKeywords(div, keywords);
        });
    }, 1000);

    function highlightKeywords(root, keywords) {
        // 1. Collect all text nodes first
        const textNodes = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeValue.trim()) {
                textNodes.push(node);
            }
        }

        // 2. Process each text node safely
        textNodes.forEach(textNode => {
            const originalText = textNode.nodeValue;
            let modifiedText = originalText;

            keywords.forEach(keyword => {
                const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
                modifiedText = modifiedText.replace(regex, '<span class="muischighlight">$1</span>');
            });

            if (modifiedText !== originalText) {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = modifiedText;
                const fragment = document.createDocumentFragment();
                Array.from(wrapper.childNodes).forEach(n => fragment.appendChild(n));
                textNode.parentNode.replaceChild(fragment, textNode);
            }
        });
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }


    // minify navigation
    $('ul.navbar-messages.center a.nav-link').each(function() {
        const text = $(this).text().trim();
        if (text.startsWith('Assign sounds')) {
            $(this).text('Assign');
        } else if (text.startsWith('Your queue')) {
            const match = text.match(/\((\d+)\)/);
            const count = match ? match[1] : '';
            $(this).text(`Queue${count ? ' (' + count + ')' : ''}`);
        } else if (text.startsWith('Moderation guide')) {
            $(this).text('Guide');
        }
    });

    // minify commands
    $('#select-all').text('All');
    $('#select-other').text('User');
    $('#select-none').text('None');
    $('#stop-sounds').text('Stop');

    // minify settings
    function updateCheckboxLabelText(forId, newText) {
        const label = $(`label[for="${forId}"]`);

        // Find the text node after the custom checkbox markup
        label.contents().filter(function () {
            return this.nodeType === 3 && $.trim(this.textContent).length > 0;
        }).last().replaceWith(newText);
    }

    // Update labels
    updateCheckboxLabelText('include-deferred', 'Select deferred');
    updateCheckboxLabelText('autoplay-sounds', 'Play selected');
    updateCheckboxLabelText('autoscroll-sounds', 'Scroll to selected');


    // minify date and accepted/deferred info in table

    $('#assigned-tickets-table tr').each(function() {
        const $tds = $(this).find('td');

        // Replace "Accepted"/"Deferred" with "a"/"d" in 4th td
        const statusTd = $tds.eq(3);
        const statusText = statusTd.text().trim();
        if (statusText === 'Accepted') statusTd.text('a');
        else if (statusText === 'Deferred') statusTd.text('d');

        // Replace '#x' text inside <a> in 5th td with 't', preserving <a>
        const refTd = $tds.eq(4);
        const $link = refTd.find('a');
        if ($link.length && /^#\d+$/.test($link.text().trim())) {
            $link.text('t');
        }

        // Replace date in 3rd td with days ago (e.g., "3d")
        const dateTd = $tds.eq(2);
        const dateText = dateTd.text().trim();
        const match = dateText.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (match) {
            const [ , dd, mm, yyyy ] = match;
            const ticketDate = new Date(`${yyyy}-${mm}-${dd}`);
            const today = new Date();
            today.setHours(0,0,0,0);
            ticketDate.setHours(0,0,0,0);
            const diffDays = Math.floor((today - ticketDate) / (1000 * 60 * 60 * 24));
            dateTd.text(`${diffDays}d`);
        }
    });

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

Also, please include as much detail as you can in the description/tags (press "Edit sound description")

"<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info.

Many thanks!

Please note this ticket might time out in two weeks without reply. <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage your files here</a>.`

    let youtube = ['youtube', '©YT', `Thank you for your contribution! However, please note that sounds taken from YouTube or similar websites can be legally problematic.

Many YouTube channels that share sound effects or music labeled as "copyright free" or "royalty free" often do not own the rights to those sounds. Unfortunately, this means we usually cannot verify whether such material is legally safe to share here, or if it was copied from commercial sound libraries, cartoons, or other copyrighted sources.

Please understand that even when knowing the link to the original source in most cases it will not be possible to confirm the sound's legality or compatibility with any Freesound license. If that is the case, please remove the upload via https://freesound.org/home/sounds/manage/pending_moderation/

Thank you for helping keep Freesound safe and legal for all users.`]

    let bgmusic = ['bgmusic', '🌎bg-music🎶' ,`Thank you for sharing. Please check the recording for any identifiable copyrighted music (that you do not own/have permission to re-license).

If there is none, please let us know. If there is any, the recording unfortunately is incompatible with the licenses available on Freesound, as they require you to be able to license your entire work. Please remove copyrighted audio via <a href="https://freesound.org/home/sounds/manage/pending_moderation/">pending file manager</a>. Edited audio with the problem sections removed can be uploaded instead.

Many thanks!

Please note this ticket might time out in two weeks without reply. <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage your files here</a>.`]

    let title = ['title', '#title' ,`Thank you for contributing!

Can we please for a descriptive title to be used?

Ideally include in the description what microphone/phone was used to record.

(press "Edit sound description")

"<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info.

Many thanks!

Please note this ticket might time out in two weeks without reply. <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage your files here</a>.`]

    let description = ['description', '#description' ,`Thank you for contributing to Freesound. We noticed that your upload is missing a title, description, or tags. Before approving, please update the missing detail. It is important to help other users find your sound in the search and understand what it is. (press "Edit sound description")

"<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info.

Many thanks!

Please note this ticket might time out in two weeks without reply. <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage your files here</a>.`]

    let text_howto = `\nTo edit the title/description/keywords click "Edit sound description" on the right. When done, click "Save sound description"`

    let text_deviceplz = `Thank you for contributing! The sound is public. You can enhance the description by mentioning 🎤recording devices used (press "Edit sound description").

"<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info.`

    let text_toolsplz = `Thank you for contributing! The sound is public. You can enhance the description by mentioning 🔨tools/methods used (press "Edit sound description").

"<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info.`

    let text_musictagplz = `Thank you for contributing! The sound is public. Thank you for sharing!

Could you please add the "music" tag (due to a <a href="https://freesound.org/forum/bug-reports-errors-and-feature-requests/45088/">missing feature</a>)?

If known please add the bpm, for example as a "123bpm" tag.

(Press "Edit sound description") — "<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info.`

    let text_bothplz = `Thank you for contributing! The sound is public. You can enhance the description by mentioning 🎤recording devices and/or 🔨tools/methods used (press "Edit sound description").

"<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info.`

    let text_shortmusicplz = `Thank you for contributing! The sound is public. Please note that although the rules are not yet very clearly laid out, music that is longer than 1 minute might be rejected in the future. Also see https://freesound.org/help/faq/#i-created-a-song-where-can-i-upload-it

[remove if not applicable] We also encourage sharing 🔨tools or 🎤recording devices used (press "Edit sound description")

"<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info`

    let text_tagsplz =
        `Thank you for contributing! The sound is now public. We also encourage adding more tags to make the sound easier to search (press "Edit sound description")
For example:


"<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info.

Many thanks!`

    let text_copyright = `It appears this is a sampling, extraction, remix, cover or other utilization of copyrighted content. The licenses on Freesound require you to have the rights to license it under your selected license. 3rd party copyrighted audio does not qualify without explicit permission by the copyright holder. See also FAQ entry <a href="https://freesound.org/help/faq/#what-sounds-are-legal-to-put-on-freesound">What sounds are legal to put on freesound?</a>

Please remove copyrighted audio via <a href="https://freesound.org/home/sounds/manage/pending_moderation/">pending file manager</a>. If the assessment is incorrect, please clarify.`

    let text_silent = `Thank you for contributing!

A substantial part of your sound is silence which likely stems from an accidentally incorrect export (a common issue with some pieces of software).

Please cut and re-upload, and then delete the version with too much silence via <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage sounds / moderation</a>.

We also encourage sharing 🎤recording devices or 🔨creation process used. "<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info.

Thank you for your understanding!

Please note this ticket might time out in two weeks without reply. <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage your files here</a>.`

    let text_clarify =
        `Thank you for contributing! As copyright is key on Freesound, can you please clarify whether you 🔨made the audio or if it is taken from somewhere like a tv show/video game/sound library or anywhere else?

If it is yours, can you please edit title/tags/description to be descriptive of the sound, so it can be found using search? (press "Edit sound description")

"<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info.

If this was generated with AI, please add "ai-generated" to the tags and reveal the service, model and query used to the description.

(The sound might get deleted after 2 weeks of no action taken. <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage your files here</a>)

Many thanks!`

    let text_meme =
        `Thank you for contributing to Freesound. Unfortunately we had to delete this sound.

Freesound only hosts files that are not copyright infringing. We reject audio taken from copyright protected media without permission. Please do not upload work owned by others. Only sounds that you have 🔨made yourself or own the copyright.

Additional comment: archive.org might be an appropriate place for archiving memes. On freesound, copyright is core and it is mostly impossible to clarify the legal status of random memes.

If you would like to find out what you can upload, please take a look at <a href="https://freesound.org/help/faq/#what-sounds-are-legal-to-put-on-freesound">What sounds are legal to put on Freesound?</a>

Thank you for your understanding!`

    let text_copymusic =
        `Thank you for contributing to Freesound. Unfortunately we had to delete this sound.

Freesound only hosts files that are not copyright infringing. It appears that music playing in the recording is copyrighted.

If you would like to find out what you can upload, please take a look at <a href="https://freesound.org/help/faq/#what-sounds-are-legal-to-put-on-freesound">What sounds are legal to put on Freesound?</a>

Thank you for your understanding!`

    let text_tax = `Thank you for sharing, however please use the "music" category for loops/compositions/melodies, see <a href="https://freesound.org/help/faq/#the-broad-sound-taxonomy">Taxonomy FAQ entry</a>. (press "Edit sound description")`

    let text_podcast =
        `Thank you for sharing, however Freesound is not suitable for podcasts. An exception could be made for an extremely thoroughly described podcast, with the description covering:
- language spoken
- speakers and nature of their voices
- content of the podcast in a detailed level
- copyright of any sounds/music used (if any)
- consent of the copyright holder(s) for licensing the recording under the selected license

The description has to be detailed enough so that the submission would become relevant to sound engineers and audio research.

"<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info and would serve as a starting point.

Alternatively, as is done with most podcast episodes here, please remove via <a href="https://freesound.org/home/sounds/manage/pending_moderation/">files manager</a>.

Please note this ticket might time out after two weeks without reply.`

    let text_game =
        `Thank you for contributing to Freesound. Unfortunately we had to delete this sound.

Freesound only hosts files that are not copyright infringing. We reject audio taken from copyright protected media without permission. Please do not upload work owned by others. Only sounds that you have made yourself or own the copyright.

Additional comment: The desire to archive game sounds is understandable. archive.org might be an appropriate place for archiving game sounds. A resource even more focused on the topic is sounds-resource.com . On Freesound, copyright is core and sounds in games are all protected by copyright of the developers or the libraries they used for development with only few exceptions like open source games or games that happen to use sounds from Freesound.

If you would like to find out what you can upload, please take a look at <a href="https://freesound.org/help/faq/#what-sounds-are-legal-to-put-on-freesound">What sounds are legal to put on Freesound?</a>

Thank you for your understanding!`

    let text_identify =
        `Thank you for uploading. Unfortunately Freesound cannot host files with infringing or unknown copyright. Please only upload sounds that you have made yourself or own the copyright. More info in <a href="https://freesound.org/help/faq/#what-sounds-are-legal-to-put-on-freesound">What sounds are legal to put on Freesound?</a>

You can use a file host (Box.com, Dropbox, Google Drive, Mega, OneDrive, Yandex Disk — <a href="https://en.wikipedia.org/wiki/Comparison_of_file_hosting_services">comparison on Wikipedia</a>) and link to the file, asking for example on <a href="https://www.reddit.com/r/Whatisthissound/">r/Whatisthissound</a>, <a href="https://www.reddit.com/r/tipofmytongue/">r/tipofmytongue</a>, <a href="https://www.reddit.com/r/Soundeffects/">r/Soundeffects</a> or the <a href="https://freesound.org/forum/sample-requests/">Freesound forums</a>.

Thank you for your understanding!`

    let text_composition =
        `Thank you for contributing! As copyright is core on Freesound, please clarify whether this is your own 🎶composition/🔊creation or taken from a website/music track/music library?
If yours: could you please add to the description in general terms how it was 🔨made? (press "Edit sound description")

"<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info.

If not yours: please let us know from where so we can check the copyright situation. Remove copyrighted audio via <a href="https://freesound.org/home/sounds/manage/pending_moderation/">sound manager</a>.

Many thanks!

Please note this ticket might time out in two weeks without reply. <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage your files here</a>.`

    let text_recording =
        `Thank you for contributing! As copyright is core on Freesound, please let us know whether this is your own 🎤recording or taken from a website/sound library?
If yours: could you please add to the description what device was used to 🎤record it? (press "Edit sound description")

"<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info.

If not yours: please let us know from where. Remove copyrighted audio via <a href="https://freesound.org/home/sounds/manage/pending_moderation/">sound manager</a>.

Many thanks!

Please note this ticket might time out in two weeks without reply. <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage your files here</a>.`

    let text_aimusic = `Thank you for sharing. We are pursuing higher description standards for music, especially for >1m.

Please add info like
- instruments
- DAW
- VSTs
- BPM if applicable
(Press "Edit sound description")

Were pre-made loops used? If yes, please let us know which ones. Unfortunately some loop packs prohibit creating music for sound libraries like Freesound.

If this is mainly AI generated content please add "ai-generated" to the tags and reveal the service, model and query used to the description.

If not yours, please clarify the origin. Many thanks!

Please note this ticket might time out in two weeks without reply. <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage your files here</a>.`

    let text_musicallow = `Thank you for sharing. Please ensure that the author of the music permits distributing the work under the chosen license.
CC0 permits anybody else to use the work in any way they want, including redistribution without attribution. CC-BY requires attribution. CC-BY-NC does too, and additionally prohibits commercial use.
If no license is suitable, please remove the file via https://freesound.org/home/sounds/manage/pending_moderation/

Please note that music is not the focus of Freesound. To make it more related, describe the music in more detail, for example what instruments are used, what the tempo/bpm is if known, what the genre/mood is if applicable, and if it was generated with AI: include "ai-generated" tag, what service/model and prompt was used.

It looks like some notes/instruments/samples/sound effects can be extracted from this track with relative ease. Because all licenses on Freesound allow this, the original samples must allow this. Please clarify the origin of the affected samples used.

Please clarify whether pre-made loops were used. If yes, please let us know which ones. Unfortunately some loop packs prohibit creating music for sound libraries like Freesound.

Many thanks!

Please note this ticket might time out in two weeks without reply. <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage your files here</a>.`

    let text_buggy =
        `This file appears to be corrupt. The file ending might be incorrect or there might be issues with incorrect file types or corrupted encoding on certain Android versions. Please check and delete when done via your <a href="https://freesound.org/home/sounds/manage/pending_moderation/">sound manager</a>.

Please note this ticket might time out in two weeks without reply. <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage your files here</a>.`

    let text_synth =
        `Thank you for sharing. Please see "sampled a synthesiser" in <a href="https://freesound.org/help/faq/#what-sounds-are-legal-to-put-on-freesound" target="_blank">What sounds are legal to put on freesound?</a>, and see <a href="https://freesound.org/forum/legal-help-and-attribution-questions/47/">this forum thread</a>. If this sound is infringing, please remove it via <a href="https://freesound.org/home/sounds/manage/pending_moderation/">your sound manager</a>.

If it does not apply, please clarify, and if not already done, describe the audio in detail in the description. (press "Edit sound description") "<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info.

Please note this ticket might time out in two weeks without reply. <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage your files here</a>.`

    let text_aigen =
        `Thank you for sharing. We are pursuing higher description standards.

If generated with AI, please reveal what AI generation service, model and query was used in the description, and add the tag "ai-generated" (press "Edit sound description").

If the file is not yours, please clarify the origin.

Please describe the audio in detail. "<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info. Many thanks!

Please note this ticket might time out in two weeks without reply. <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage your files here</a>.`

    let text_soundtrap =
        `Thank you for sharing and being transparent. Unfortunately <a href="https://freesound.org/forum/legal-help-and-attribution-questions/45132/" target="_blank">Soundtrap Sample Content cannot be used for work uploaded to Freesound</a>. Please remove affected audio via <a href="https://freesound.org/home/sounds/manage/pending_moderation/" target="_blank">your sound manager</a>. Otherwise please clarify.

Please note this ticket might time out in two weeks without reply. <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage your files here</a>.`

    let text_filehost =
        `Hi, as this upload has minimal tags/description, it could be the intent is to use Freesound as a file host.

Freesound is a creative and scientific community, see <a href="https://freesound.org/help/faq/#what-is-this-site-anyway">What is this site anyway?</a>

You can delete uploads at <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage sounds / moderation</a>.

See <a href="https://en.wikipedia.org/wiki/Comparison_of_file_hosting_services">file hosting services comparison on Wikipedia</a>.

Otherwise please clarify. "<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info.

Many thanks!`

    let text_lazystudent =
        `Hi, as this upload has minimal tags/description, it could be the intent is to use Freesound as a file host.

Freesound is a creative and scientific community, see <a href="https://freesound.org/help/faq/#what-is-this-site-anyway">What is this site anyway?</a>

You can delete uploads at <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage sounds / moderation</a>.

See <a href="https://en.wikipedia.org/wiki/Comparison_of_file_hosting_services">file hosting services comparison on Wikipedia</a>.


Otherwise:

We would love to publish it but could you possibly add English title, description and tags first?

You can keep the original description and simply add the English text. This will ensure that your sounds are discoverable in the search, as our website and user-base primarily work with English.

Also, please include as much detail as you can in the description/tags (press "Edit sound description")

"<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info.

Please make sure each sound has their own tags/description that sets it apart from the other sounds.

Many thanks!

Please note this ticket might time out in two weeks without reply. <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage your files here</a>.`

    let text_musicbpm = `Thank you for sharing! Could you please add the "music" tag (due to a <a href="https://freesound.org/forum/bug-reports-errors-and-feature-requests/45088/">missing feature</a>), and if known please add the bpm, for example as a "123bpm" tag. Many thanks!`
    let text_lazytags =
        `Hey there. Thank you for contributing to Freesound.

Freesound being a community of creators and researchers means that sounds need to be findable in the sea of 650,000 other sounds. For this reason we ask to add more details describing this sound to set it apart from other files that have similar tags and descriptions.

For example adding some more tags could help others find this creation (press "Edit sound description")

"<a href="https://freesound.org/help/faq/#how-should-i-describe-my-sounds">How should I describe my sounds?</a>" has more info.

Many thanks!

Please note this ticket might time out in two weeks without reply. <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage your files here</a>.`

    // Add quick moderation buttons
    let text_all_buttons =
        `<a class='morebuttons' id='quick-device' data-text='` + text_deviceplz + `' title='✅ but 🎤?'>✅🎤?</a>` + text_sep +
        `<a class='morebuttons' id='quick-tools' data-text='` + text_toolsplz + `' title='✅ but 🔨?'>✅🔨?</a>` + text_sep +
        `<a class='morebuttons' id='quick-both' data-text='` + text_bothplz + `' title='✅ but 🎤🔨?'>✅🎤🔨?</a>` + text_sep +
        `<a class='morebuttons' id='quick-musictagplz' data-text='` + text_musictagplz + `' title="add 'music' tag">✅'music'</a>` + text_sep +
        `<a class='morebuttons' id='quick-shortmusic' data-text='` + text_shortmusicplz + `' title='✅🎵 but 1🕑/🔨?'>✅🎵/🕑/🔨?</a>` + text_sep +
        `<a class='morebuttons' id='quick-tags' data-text='` + text_tagsplz + `' title='✅ but 🏷?'>✅🏷?</a>` + text_sep +
        `<a class='morebuttons' id='quick-language' data-action='Defer' data-text='` + text_language + `' title='plz fix language'>✋🌎lng</a>` + text_sep +
        `<a class='morebuttons' id='quick-timeout' data-action='Defer' data-text='\n\nPlease note this ticket might time out in two weeks. <a href="https://freesound.org/home/sounds/manage/pending_moderation/">Manage your files here</a>.' title='timeout in 2 weeks '>✋🕑2w</a>` + text_sep +
        `<a class='morebuttons' id='quick-silent' data-action='Defer' data-text='` + text_silent + `' title='silent, please re-upload'>✋🔇</a>` + text_sep +
        `<a class='morebuttons' id='quick-recording' data-action='Defer' data-text='` + text_recording + `'>✋your 🎤rec﹖</a>` + text_sep +
        `<a class='morebuttons' id='quick-composition' data-action='Defer' data-text='` + text_composition + `'>✋your 🎶/🔊﹖</a>` + text_sep +
        `<a class='morebuttons' id='quick-musicbpm' data-action='Defer' data-text='` + text_musicbpm + `'>✋tag/bpm</a>` + text_sep +
        `<a class='morebuttons' id='quick-synth' data-action='Defer' data-text='` + text_synth + `'>✋🎹💻⚙️🎵sampled</a>` + text_sep +
        `<a class='morebuttons' id='quick-aimusic' data-action='Defer' data-text='` + text_aimusic + `'>✋🤖🎶﹖</a>` + text_sep +
        `<a class='morebuttons' id='quick-musicallow' data-action='Defer' data-text='` + text_musicallow + `'>✋🗎music🎹🎶﹖</a>` + text_sep +
        `<a class='morebuttons' id='quick-aigen' data-action='Defer' data-text='` + text_aigen + `'>✋🤖🤖🤖﹖</a>` + text_sep +
        `<a class='morebuttons' id='quick-clarify' data-action='Defer' data-text='` + text_clarify + `'>✋clarify origin﹖</a>` + text_sep +
        `<a class='morebuttons' id='quick-clarify' data-action='Defer' data-text='` + text_podcast + `'>✋🎙️podcast🎙️</a>` + text_sep +
        `<a class='morebuttons' id='quick-clarify' data-action='Defer' data-text='` + text_tax + `'>🎵tax🎵</a>` + text_sep +
        `<a class='morebuttons' id='quick-buggy' data-action='Defer' data-text='` + text_buggy + `' title='buggy'>✋💻💀﹖</a>` + text_sep +
        `<a class='morebuttons' id='quick-soundtrap' data-action='Defer' data-text='` + text_soundtrap + `'>✋🎵Soundtrap</a>` + text_sep +
        `<a class='morebuttons' id='quick-copyright' data-action='Defer' data-text='` + text_copyright + `'>✋©©©</a>` + text_sep +
        `<a class='morebuttons' id='quick-copymusic' data-action='Delete' data-text='` + text_copymusic + `'>🛇🎵©</a>` + text_sep +
        `<a class='morebuttons' id='quick-meme' data-action='Delete' data-text='` + text_meme + `'>🛇meme</a>` + text_sep +
        `<a class='morebuttons' id='quick-game' data-action='Delete' data-text='` + text_game + `'>🛇🎮🕹</a>` + text_sep +
        `<a class='morebuttons' id='quick-identify' data-action='Delete' data-text='` + text_identify + `'>🛇❓❓</a>` + text_sep +
        `<a class='morebuttons' id='quick-filehost' data-action='Defer' data-text='` + text_filehost + `' title='file host?'>✋📁host</a>` + text_sep +
        `<a class='morebuttons' id='quick-howto' data-text='` + text_howto + `'>﹖Howto</a>` + text_sep +
        `<a class='morebuttons' id='quick-` + youtube[0] + `' data-action='Defer' data-text='` + youtube[2] + `'>` + youtube[1] + `</a>` + text_sep +
        `<a class='morebuttons' id='quick-` + bgmusic[0] + `' data-action='Defer' data-text='` + bgmusic[2] + `'>` + bgmusic[1] + `</a>` + text_sep +
        `<a class='morebuttons' id='quick-` + title[0] + `' data-action='Defer' data-text='` + title[2] + `'>` + title[1] + `</a>` + text_sep +
        `<a class='morebuttons' id='quick-` + description[0] + `' data-action='Defer' data-text='` + description[2] + `'>` + description[1] + `</a>` + text_sep +
        `<a class='morebuttons' id='quick-lazystudent' data-action='Defer' data-text='` + text_lazystudent + `'>✋lazy🌎👨‍🎓</a>` + text_sep +
        `<a class='morebuttons' id='quick-lazytags' data-action='Defer' data-text='` + text_lazytags + `'>✋more tags 🎨🤝⚛🎓</a>` + text_sep +
        `<a class='morebuttons' id='quick-spam' data-action='Defer' data-text='spam'>✋💣spam</a>` + text_sep
    $("#template-responses > span:nth-child(1)").after(text_all_buttons);

    //console.log(text_all_buttons);

    $('a.morebuttons').click(function(){

        // insert text
        $('#id_message').get(0).value += $(this).attr('data-text');

        // spam special case
        if ($(this).attr('id') === 'quick-spam') {
            $('#id_moderator_only').prop('checked', true);
        } else {
            $('#id_moderator_only').prop('checked', false);
        }

        // activate action https://stackoverflow.com/a/1318091/188159
        let attr = $(this).attr('data-action');
        //console.log(attr);
        if (typeof attr !== 'undefined' && attr !== false) {
            console.log('trying to radio');
            $('#id_action label > input[value=' + attr + ']').parent().click();
        }

        // resize to fit + spare
        const $textarea = $("#id_message");
        const extraLines = 2;
        const lineHeight = parseFloat($textarea.css("line-height")) || 10;

        // Reset height to auto to get accurate scrollHeight
        $textarea.height('auto');

        const newHeight = $textarea[0].scrollHeight + (extraLines * lineHeight);
        $textarea.height(newHeight);

        $("#id_message").height( $("#id_message")[0].scrollHeight);

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
tr > td:nth-child(2).onlyone { background-color: PeachPuff !important; border-top: 1px solid #333; border-bottom: 1px solid #333; }
span.muischighlight {background-color: yellow;}
`
    // Insert CSS for flash animation
    style.innerHTML += `
.flash-beige {
		animation: flashBeige 0.3s ease-in-out;
}
@keyframes flashBeige {
		0% { background-color: beige; }
		33% { background-color: beige; }
		66% { background-color: beige; }
		100% { background-color: transparent; }
}
#preview-message {
		display: block !important;
}
.chat-uploader {
background-color: #f0f0f0;
margin-right: 8px;
padding: 4px;
}
.chat-mod {
background-color: #007bff !important; /* Blue background */
color: white !important;              /* White text */
margin-left: 8px;
padding: 4px;
}
.chat-mod .text-grey { color: #ccc; }
.chat-mod a { color: black; }`;
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

    // Unified date parser: handles "Jan. 2, 2025, 6:27 p.m.", "June 5, 2024, 5:40 p.m.", etc.
    function parseDate(dateStr) {
        if (!dateStr) return null;
        const cleaned = dateStr
        .replace(/(\d{1,2}) (p\.m\.|a\.m\.)/i, '$1:00 $2') // Add minutes to time
        .replace(/\(.*?\)/g, '')        // Remove "(x ago)" or similar
        .replace(/\./g, '')            // Remove all periods
        .replace(/\bpm\b/i, 'PM')      // Normalize pm
        .replace(/\bam\b/i, 'AM')      // Normalize am
        .trim();
        const date = new Date(cleaned);
        return isNaN(date) ? null : date;
    }

    // Calculate days hours minutes ago from now
    function timeAgoDetailed(date) {
        const now = new Date();
        let diffMs = now - date;
        if (diffMs < 0) diffMs = 0; // Future-proof

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

        return `${days}d ${hours}h ${minutes}m ago`;
    }

    // Core logic to check and modify content
    function checkCommentsSection() {
        const spans = document.querySelectorAll('#ticket-comments-section span.text-grey:not(.more-buttons-checked)');
        spans.forEach(span => {
            const date = parseDate(span.textContent);
            if (date) {
                const agoText = timeAgoDetailed(date);
                span.classList.add('more-buttons-checked');

                const tag = document.createElement('span');
                tag.textContent = ` (${agoText})`;
                tag.style.backgroundColor = (date < Date.now() - 30 * 24 * 60 * 60 * 1000) ? 'yellow' : 'lightgreen';
                tag.style.color = 'black';
                tag.style.marginLeft = '5px';

                span.insertAdjacentElement('afterend', tag);
            } else {
                console.log("Failed to parse in checkCommentsSection:", span.textContent);
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

            return; // prevent fallthrough
        }

        // --- Audio seeking ---
        if ((e.ctrlKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) && !e.originalEvent.repeat) {
            const target = e.target;
            const tag = target.tagName ? target.tagName.toLowerCase() : '';
            const isEditable =
                  target.isContentEditable ||
                  tag === 'textarea' ||
                  (tag === 'input' && !['button', 'checkbox', 'radio', 'submit', 'reset'].includes(target.type));

            console.log(`keydown detected: tag=${tag}, editable=${isEditable}`);

            if (isEditable) {
                console.log("Skipping audio seek: user is typing in an editable element.");
                return; // do nothing, let the browser handle it
            }

            // Find the first audio element that is currently playing
            const audios = document.querySelectorAll('audio');
            const playing = Array.from(audios).find(a => !a.paused && !a.ended);

            if (playing) {
                const step = 5; // seconds to seek
                if (e.key === 'ArrowLeft') {
                    playing.currentTime = Math.max(0, playing.currentTime - step);
                } else if (e.key === 'ArrowRight') {
                    playing.currentTime = Math.min(playing.duration, playing.currentTime + step);
                }
                e.preventDefault(); // prevent browser default (like tab switching)
            }
        }

    });

    /* 2025-06 upgrade: color users if present multiple times in list */

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

    // Add top/bottom borders for continuous blocks of same user
    const getUserId = $row => {
        const $link = $row.find('td:nth-child(2) a[data-modal-content-url]');
        const url = $link.attr('data-modal-content-url');
        const match = url?.match(/\/annotations\/(\d+)\//);
        return match ? match[1] : null;
    };

    let prevId = null;
    $rows.each(function (i) {
        const $row = $(this);
        const currId = getUserId($row);

        const nextId = i + 1 < $rows.length ? getUserId($rows.eq(i + 1)) : null;

        if (currId && currId !== prevId) {
            $row.css('border-top', '1px solid #000');
        }
        if (currId && currId !== nextId) {
            $row.css('border-bottom', '1px solid #000');
        }

        prevId = currId;
    });


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


    // 2025-08-03 Enhancement: reverse comment order, add html render preview

    function flipMessages() {

        document.querySelectorAll('.ticket-comments:not(.display-none)').forEach(ticket => {
            const messageWrapper = ticket;
            const messageDivs = Array.from(messageWrapper.querySelectorAll(':scope > div'))
            .filter(div => !div.matches('h4'));  // Exclude headers

            if (messageDivs.length <= 1) return;

            const firstMsgTime = extractTimestamp(messageDivs[0]);
            const secondMsgTime = extractTimestamp(messageDivs[1]);

            if (!firstMsgTime || !secondMsgTime) {
                console.log('Failed to extract timestamps, skipping flip.');
                return;
            }

            // If first message is older than second, reverse them
            if (firstMsgTime < secondMsgTime) {
                messageDivs.reverse().forEach(div => {
                    messageWrapper.appendChild(div);
                });

                // Flash the ticket container
                flashElement(ticket);
            }
        });
    }

    function extractTimestamp(msgDiv) {
        // Get all .text-grey spans
        const allSpans = msgDiv.querySelectorAll('span.text-grey');
        let timeSpan = null;

        // Look for the one that looks like a date
        for (const span of allSpans) {
            if (/\d{4},\s+\d{1,2}(?::\d{2})?\s*(?:a\.m\.|p\.m\.)?/i.test(span.textContent)) {
                timeSpan = span;
                break;
            }
        }

        if (!timeSpan) {
            console.log("No valid timestamp span.text-grey found in:", msgDiv);
            return null;
        }

        const date = parseDate(timeSpan.textContent);  // unified parser
        if (!date) {
            console.log("Failed to parse date:", timeSpan.textContent);
            return null;
        }

        return date.getTime();
    }


    function flashElement(element) {
        element.classList.add('flash-beige');
        setTimeout(() => element.classList.remove('flash-beige'), 300);
    }

    function createPreview() {
        const section = document.getElementById('ticket-comments-section');
        if (!section) return;

        if (document.getElementById('preview-message')) return; // Already exists

        const previewContainer = document.createElement('div');
        previewContainer.id = 'preview-message';
        previewContainer.className = 'ticket-comments v-spacing-2';
        previewContainer.dataset.ticketId = 'preview';

        const h4 = document.createElement('h4');
        h4.className = 'v-spacing-2 text-grey';
        h4.textContent = 'Preview Message';
        previewContainer.appendChild(h4);

        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'v-spacing-2 chat-mod';

        const headerDiv = document.createElement('div');
        headerDiv.innerHTML = `<a href="#">PREVIEW</a> <span class="h-spacing-left-1 h-spacing-1 text-grey">·</span><span class="text-grey">${formatCurrentDate()}</span>`;
        messageWrapper.appendChild(headerDiv);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'overflow-hidden';
        contentDiv.innerHTML = ''; // Will be filled live
        messageWrapper.appendChild(contentDiv);

        previewContainer.appendChild(messageWrapper);

        section.insertBefore(previewContainer, section.firstChild);
    }

    function updatePreview() {
        const textarea = document.getElementById('id_message');
        const contentDiv = document.querySelector('#preview-message .overflow-hidden');
        const previewContainer = document.getElementById('preview-message');
        if (!textarea || !contentDiv || !previewContainer) return;

        let text = textarea.value;
        text = text.replace(/\n/g, '<br>');
        contentDiv.innerHTML = text;

        flashElement(previewContainer);
    }

    function formatCurrentDate() {
        const now = new Date();
        const options = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' };
        const formatted = now.toLocaleString('en-US', options).replace(',', '').replace(' at', ',');
        const ampm = now.getHours() >= 12 ? 'p.m.' : 'a.m.';
        return `${formatted} ${ampm}`;
    }

    function throttleDebounceCombo(func, wait) {
        let timeout = null;
        let blocked = false;
        let pendingCall = false;

        return function(...args) {
            if (!blocked) {
                func.apply(this, args);  // Immediate call
                blocked = true;

                timeout = setTimeout(() => {
                    if (pendingCall) {
                        func.apply(this, args);  // Trailing call
                        pendingCall = false;
                    }
                    blocked = false;
                }, wait);
            } else {
                pendingCall = true;  // Remember that a change happened during the block
            }
        };
    }

    function startPreviewListener() {
        const textarea = document.getElementById('id_message');
        if (!textarea) return;

        textarea.addEventListener('input', throttleDebounceCombo(updatePreview, 500));
    }

    function patchTextareaInputEvent() {
        const textarea = document.getElementById('id_message');
        if (!textarea) return;

        const descriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
        if (!descriptor || !descriptor.set) return; // Safety check

        const originalSetter = descriptor.set;

        Object.defineProperty(textarea, 'value', {
            set: function(newValue) {
                originalSetter.call(this, newValue);
                const event = new Event('input', { bubbles: true });
                this.dispatchEvent(event);
            },
            get: descriptor.get
        });
    }

    // chat styles for messages
    function labelChatRoles() {
        const selectedInfo = document.getElementById('selected-sounds-info');
        if (!selectedInfo) return;

        const uploaderLink = selectedInfo.querySelector('a[href^="/people/"][title^="Username: "]');
        if (!uploaderLink) return;

        const uploaderName = uploaderLink.textContent.trim();

        document.querySelectorAll('.ticket-comments:not(.display-none)').forEach(ticket => {
            const messageBlocks = Array.from(ticket.querySelectorAll(':scope > div'))
            .filter(div => !div.matches('h4'));

            messageBlocks.forEach(block => {
                const authorLink = block.querySelector('a[href^="/people/"]');
                if (!authorLink) return;

                const authorName = authorLink.textContent.trim();

                // Remove any existing role classes to prevent duplicates
                block.classList.remove('chat-uploader', 'chat-mod');

                if (authorName === uploaderName) {
                    block.classList.add('chat-uploader');
                } else {
                    block.classList.add('chat-mod');
                }
            });
        });
    }


    // Main loop to keep flipping messages every 1s
    setInterval(() => {
        flipMessages();
        labelChatRoles();
    }, 1000);

    // Initial run
    flipMessages();
    createPreview();
    patchTextareaInputEvent();
    startPreviewListener();

    // Delete button confirmation

    (function() {
        'use strict';

        // Run when DOM is ready
        const interval = setInterval(() => {
            const form = document.querySelector('#moderate-form-wrapper form');
            const btn = form?.querySelector('button.btn-primary.w-100');
            if (!form || !btn) return;

            clearInterval(interval);

            btn.addEventListener('click', function(e) {
                const selected = form.querySelector('input[name="action"]:checked')?.value;

                if (selected === 'Delete') {
                    const ok = confirm("You selected DELETE.\nAre you sure you want to proceed?");
                    if (!ok) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                }

                // otherwise allow normal submission
            });
        }, 250);
    })();

    // Delete button confirmation END

})();
