# Character Count

A browser extension for viewing the number of characters in text selections. When activated, the count appears in the top-right corner of the browser window.

- Select text (with mouse or keyboard) to see the number of characters.
- Quickly view the number of characters on an entire page using keyboard shortcut (OS X: CMD-a, Windows: CTRL-a).
- Click the extension button to activate/deactivate. The ESC key can also be used to deactivate.


## Install

### Chrome

Install from the Chrome Web Store: [https://chrome.google.com/webstore/detail/character-count/bpjdkinahbalcimnlaijodhiigpfkmjf](https://chrome.google.com/webstore/detail/character-count/bpjdkinahbalcimnlaijodhiigpfkmjf)

Note: Tabs must be reloaded after installing Character Count.

### Safari

Not yet released. Follow development instructions for now.


## Develop

### Chrome

The `chrome-extension` directory contains all files needed by the extension, except the dependencies:

    $ cd chrome-extension
    $ bower install

After installing the dependencies, [load the unpacked extension](https://developer.chrome.com/extensions/getstarted#unpacked) from the `chrome-extension` directory.

### Safari

The `character-count.safariextension` directory contains all files needed by the extension, except the dependencies:

    $ cd character-count.safariextension
    $ bower install

After installing the dependencies, [add and install the extension using the Safari Extension Builder](https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/UsingExtensionBuilder/UsingExtensionBuilder.html#//apple_ref/doc/uid/TP40009977-CH2-SW5) from the `character-count.safariextension` directory.


## See also

- [Word Count](https://github.com/jbrudvik/word-count)
