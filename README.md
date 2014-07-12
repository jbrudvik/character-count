# Character Count

Counts characters in selections.

Character Count is a Google Chrome extension for viewing the number of characters in text selections. The count will appear in the top-right corner of the browser window.

- Select text (with mouse or keyboard) to see the number of characters.
- Quickly view the number of characters on an entire page using keyboard shortcut (OS X: CMD-a, Windows: CTRL-a).
- Click the extension button to activate/deactivate. The ESC key can also be used to deactivate.


## Install

Install from the Chrome Web Store: [https://chrome.google.com/webstore/detail/character-count/bpjdkinahbalcimnlaijodhiigpfkmjf](https://chrome.google.com/webstore/detail/character-count/bpjdkinahbalcimnlaijodhiigpfkmjf)

Note: Tabs must be reloaded after installing Character Count.


## Development

The `src` directory contains all files needed by the extension.

The `pxm` directory contains Pixelmator files from which image files used by the extension are generated.


### Dependencies

Before deploying the extension, dependencies must be installed:

    $ cd src
    $ bower install
