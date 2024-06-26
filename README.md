# Freesound mod queue optimizer userstyle and userscript
Minimal full width moderation with color warnings

## what it looks like

PRESS PLAY TO SEE ANIMATION BELOW

### userstyle
> ![basic usage animation](https://github.com/qubodup/freesound-mod_queue_optimizer/blob/main/freesound_mod_queue_optimizer-preview.gif)
<br>(names and profile pictures are censored)

### userscript

> ![basic usage animation](https://github.com/qubodup/freesound-mod_queue_optimizer/blob/main/freesound_mod_queue_optimizer_userscript-preview.png)

## what it does

### userstyle

* Uses all the space for the moderation queue
* Adds color warning for currently selected action

### userscript

* adds buttons which pick the right action and insert text templates to moderation queue

## how to install

### userstyle

1. Have Stylus (Chrome/Firefox) extension installed in your browser
2. Download the file [freesound_mod_queue_optimizer.css](https://raw.githubusercontent.com/qubodup/freesound-mod_queue_optimizer/main/freesound_mod_queue_optimizer.css)
3. Import the userstyle file in the Stylus extension
4. Navigate to https://freesound.org/tickets/moderation/ , press "Your Queue" and enjoy

### userscript

1. Have Tampermonkey (Chrome) or Greasemonkey (Firefox) extension installed in your browser
2. Copy the text content of https://raw.githubusercontent.com/qubodup/freesound-mod_queue_optimizer/main/freesound_mod_queue_more_buttons.js
3. Create a new script in the Tampermonkey/Greasemonkey extension
4. Paste the text (overwriting the defaults) and save
4. Navigate to https://freesound.org/tickets/moderation/ , press "Your Queue" and enjoy
