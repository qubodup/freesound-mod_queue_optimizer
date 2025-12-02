# Freesound mod queue optimizer userstyle and userscript
Minimal full width moderation with color warnings

## what it looks like

### userstyle

PRESS PLAY TO SEE ANIMATION BELOW
> ![basic usage animation](https://github.com/qubodup/freesound-mod_queue_optimizer/blob/main/freesound_mod_queue_optimizer-preview.gif)
<br>(names and profile pictures are censored)

#### updated 2025-06 3 column layour to make room for comments + colored groups by same uploader

![Freesound_-_Moderation_-_Your_queue_-_Google_Chrom_25-06-07_22-46-43_65z](https://github.com/user-attachments/assets/f77d772e-9935-4649-b0aa-d994ae8b3501)

### updated 2025-12 message preview, more templates, deletion warning, compact navigation

<img width="1385" height="729" alt="Dec 2025 status preview with warning pop-up and preview kind of showing" src="https://github.com/user-attachments/assets/26e02940-f39e-4701-b024-47884acf4b4a" />

### userscript

> ![basic usage animation](https://github.com/qubodup/freesound-mod_queue_optimizer/blob/main/freesound_mod_queue_optimizer_userscript-preview.png)

## what it does

### userstyle

* Uses all the space for the moderation queue
* Adds color warning for currently selected action, including the submit button
* Removes whitelisting from UI

### userscript

* Adds buttons which pick the right action and insert text templates to moderation queue
* Requires confirmation before deleting
* Previews message entered
* Flips the order of messages, colors them like a chat, makes usable timestamps
* Highlights some key words like 'bpm'
* Makes table compact

## how to install

### userstyle

1. Have Stylus (Chrome/Firefox) extension installed in your browser
2. Download the file [freesound_mod_queue_optimizer.css](https://raw.githubusercontent.com/qubodup/freesound-mod_queue_optimizer/main/freesound_mod_queue_optimizer.css)
3. Import the userstyle file in the Stylus extension
4. Navigate to https://freesound.org/tickets/moderation/ , press "Your Queue" and enjoy

### userscript

1. Have Tampermonkey (Chrome) or Greasemonkey (Firefox) extension installed in your browser
2. Install https://raw.githubusercontent.com/qubodup/freesound-mod_queue_optimizer/main/freesound_mod_queue_more_buttons.user.js
3. Navigate to https://freesound.org/tickets/moderation/ , press "Your Queue" and enjoy
