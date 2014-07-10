# Character Count

A Google Chrome extension for viewing the number of characters in text selections.

When activated, Character Count shows the number of characters in the current selection in a small popup in the top-right corner of the browser window.

- Click the extension button to start showing number of characters in selections.
- Select text (with mouse or keyboard) to see the number of characters.
- Quickly view the number of characters on an entire page using keyboard shortcut (OS X: CMD-a, Windows: CTRL-a).
- Click the extension button to stop showing number of characters in selections. The ESC key can also be used to deactivate.


## Development

The `src` directory contains all files needed by the extension.

The `pxm` directory contains Pixelmator files from which image files used by the extension are generated.


## Dependencies

Before deploying the extension, dependencies must be installed:

    $ cd src
    $ bower install
