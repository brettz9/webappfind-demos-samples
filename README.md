# webappfind-demos-samples

This repo contains web app demos which will work with the sample files it
also contains and which can be opened from the
desktop into [WebAppFind](https://github.com/brettz9/webappfind), a
[WebExtension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
that will open a targeted web app with the desktop file content (and
optionally be empowered to save changes back to disk).

This repo's demos now work with the 3.* version of WebAppFind.
Currently the add-on only works in Firefox, but it should be feasible to support
Chrome and other WebExtension environments with the necessary API support
with some extra development work (pull requests welcome).

(The `v2.0.0-v2` tag has the 2.0.0 version which was for a much earlier
version of Firefox and was Windows only. It is also missing some
dependencies such as Jamilih.)

## Adding to start-up

If you want these demos available from localhost when you start up the
machine, you can follow these steps:

1. Create an Automator Application
2. Add "Run Shell Script" with the following contents, adjusted to your path:

```shell
cd /Users/brett/webappfind-demos-samples

# Shell script has different path than terminal, so to get Node in it, use
# this (per https://stackoverflow.com/a/33941579/271577 )
PATH="/usr/local/bin:$PATH"

# Ensure we get right npm path for nvm
$(npm bin -g)/npm start
```

You may need to modify the PATH for NVM:

```shell
PATH="/usr/local/bin:/Users/brett/.nvm/versions/node/v12.9.1/bin:$PATH"
```

3. Go to `System Preferences -> Users & Groups -> Login Items` and click `+` and
    `Add` the application created in the above steps.

## Utility APIs

webappfind-demos-samples currently bundles two utilities.

### meta-webappfind.js

In order to provide suggested file extension and content type associations for
ExecutableBuilder, one's HTML must include `<meta name="webappfind">` tags in
the head of the document with the `content` attribute properly formatted. To
assist in this formatting, the utility `meta-webappfind.js` is provided.

#### `addMetas(metaInfos)`

If an array is not provided for `metaInfos`, the argument will be encapsulated
into an array.

The items in the provided (or resulting) array will adhere to the structure
of `params` described under `serializeParams`.

The serialized values will be added as the `content` of a `<meta name="webappfind">`
element and this element will be added to the document head.

#### `serializeParams(params)`

`params` is expected to be a plain object with any of the following types for
key values, and behaving as follows:

- Booleans: Adds "on" if `true`, and does not add any `meta` element if `false`
- String: Adds the literal string
- Array of strings: Adds the literal value of joining the strings together with a space
- JSON object: A JSON object that will be run against `JSON.stringify`
- Any other value types will be converted to a string by `encodeURIComponent`.

### webappfind.js

#### `waf = new WebAppFind(messageHandlers, options)`

This constructor can, for its `messageHandlers` argument, accept one or
both of two optional message handlers:

1. `view` - Triggered when a WebAppFind `view` message is received, indicating
    that content is available. The single object sent to the handler will
    have a `content` property set to the contents (string, or if the `binary`
    flag is set, as a (typed) array). The object will also have a `pathID`
    property which is currently required by WebAppFind (and as used internally
    to `webappfind.js`) when saving back to disk (when in `edit` mode).
2. `saveEnd` - Triggered when a WebAppFind `save-end` message is received (as
    a result of a prior `save` message being sent). The single object sent to
    the handler will have a `pathID` property.

The `options` object can have an optional `excludedMessages` array property
of string message types that, in addition to `view` and `save-end`, will not
trigger errors (defaults to `save`).

The WebAppFind instance, `waf`, that is returned can have its `save` method
be used to save back changes to disk (assuming a `view` message with pathID
has been received). This method returns a `Promise` which resolves to an
object with a `pathID` property upon a successful save back to disk.

## To-dos

1. Add TestCafe tests for demos (need to also call executables for simulating
    "Open with..." behavior)

## Possible "Demos" todos

1. CodeMirror demos
    1. Make scrollbars easier to use in CodeMirror demos
    1. Utilize <https://github.com/brettz9/requirejs-codemirror> in CodeMirror
        demos for cleaner HTML (actually should probably now be ES6 Modules)
    1. Use CodeMirror diffs/merge add-ons if version-control trigger types
        supported
    1. Add CodeMirror search/replace?
1. Misc. demos
    1. Give option for demos like txt to add `\r` back to `\r\n`
1. HTML
    1. Get CodeMirror to use closetag, html5complete, matchTags (in
        addition to JS ones if mixed mode can support), use the preview
        option?; <http://codemirror.net/demo/widget.html> for line bars in
        linting (html, css, javascript)? linting for HTML? (JSLint can do
        some); ensure JSLint (and CSSLint?) applied to mixed HTML; ESLint
        instead?
    1. Better integration of CodeMirror/CKEditor, using full (mixed
        HTML) features of latest CodeMirror
    1. Demos ought to use cookie for setting full screen option
    1. CKEditor: Use runmode for getting code syntax highlighting within
        CKEditor HTML (e.g., for doing blog posts):
        <http://codemirror.net/demo/runmode.html> and for a button to
        copy-HTML-(+css with styles inlined?)-to-clipboard in each of the html/javascript/css/svg/etc. modes
1. Docx
    1. Create demo supporting docx format (rather than requiring export
        to HTML for Word docs)
1. Markdown
    1. Add <http://pagedown.googlecode.com/hg/demo/browser/demo.html> buttons
        to Markdown editor?
1. OCR (currently PDF)
    1. Modify the OCR demo to support detection (by WebAppFind-injected URL
        params) of various image formats, SVG, and as per the Ocrad demo,
        drawing on a canvas which could in turn be saved to disk as an
        image or exported as a text file (or even [HTML-to](http://robert.ocallahan.org/2011/11/drawing-dom-content-to-canvas.html)[-canvas](http://people.mozilla.org/~roc/rendering-HTML-elements-to-canvas.html)?)
        images to OCR; also modify to allow clicks/keypress on arrow buttons
        to browse the PDF page-by-page
    1. [Ocrad](http://antimatter15.github.io/ocrad.js/demo.html) for text OCR export of an image (once export mode supported)
1. PDF demo (see also OCR)
    1. might use <https://github.com/MrRio/jsPDF> (see
        <http://parall.ax/products/jspdf> with HTML renderer demo) for
        writing, integrated into CodeMirror or even CKEditor if modified
        to support generation of the right format; if the same HTML
        format could be generated and accepted by the likes of [pdf2htmlEX](https://github.com/coolwanglu/pdf2htmlEX/) and
        jsPDF, there might be some round-tripping potential.
1. CSV
    1. Get CKeditor to allow WYSIWYG tables to be sortable for sake of
        CSV demo? Create view-only demo (i.e., just build table and insert)
1. JHTML: Ability to build [JHTML](http://brettz9.github.com/jhtml) with
    autocomplete (usable for saving as JSON or saving as HTML) once spec finalized (once &lt;i> approach used)
1. JS
    1. CodeMirror tern support? can this work or be made to work with
        JSDoc?
    1. Cookie to hold JSHint options
1. CSS
    1. Tweak change CSS autocomplete in CodeMirror to support
        color/background-color, support CSS lint options
    1. Cookie to hold CSS lint options
1. XML
    1. Cookie for remembering XML "schemaInfo"
    1. XML dialect demo with schema for CodeMirror xmlautocomplete
1. JSON
    1. JSON schema dialect demo for checking JSON dialects;
        autocomplete as well?
1. SVG
    1. Add CodeMirror to SVG Edit XML view
    1. Demos ought to use cookie for setting full screen option
    1. CKEditor support for popup or inline SVGEdit and SVGEdit support
        for CKEditor foreign objects (via `foreignObject` extension?)
1. Images/canvas: <http://www.picozu.com/editor/> ? Animated GIFs?
1. Ico already includes this? <https://gist.github.com/brettz9/7163724>
1. Animated SVG?
1. Audio: <http://plucked.de/> and <https://github.com/plucked/html5-audio-editor>?
1. Video - popcorn?
1. Music notations  - <http://www.vexflow.com/>
1. MIDI, etc.
1. Update my regex support in CodeMirror for regex type and for JS overlay:
    <http://codemirror.net/1/contrib/regex/index.html>
1. Integrate HTML/SVG (and then others) with [Together.js](https://togetherjs.com/)
    to allow **peer-to-peer collaboration** on one's local files
1. SVG OpenType Font editor (adapt <https://github.com/edf825/SVG-OpenType-Utils>?
    See <https://wiki.mozilla.org/SVGOpenTypeFonts>)
1. [Blockly](https://github.com/google/blockly) for arbitrary JavaScript:
    1. Object literals
    1. Variables (arrays or objects like functions, etc.) with right side for property access (static (can be detected for pull-down) or dynamic)
    1. `new` (with or w/o needing function definition)
        `new a()[new b()]`
        won't normally add new directly within property (and can't within static property)
    1. invocation (w/o needing function definition)
    1. Update to latest Blockly
1. Zip
    1. Do a concept for browsing or editing the file contents of a zip
        using the likes of <http://stuk.github.io/jszip/> or those mentioned at
        <http://stackoverflow.com/questions/2095697/unzip-files-using-javascript>
1. Special programs
    1. "Todo" webapp demo
    1. Web macro-script program for use with the web (including possibly
        AsYouWish), esp. for text processing (allowing XPath/CSS selectors
        or raw text searches, testing for content or replacing)
    1. Email/chat client which stores data locally (and optionally only
        locally); good open source options to adapt? Tie in together.js
        with chat (as in whiteboards) or even to write collaborative emails
    1. Sticky app
        1. See <https://gist.github.com/brettz9/8687257>
        1. power-user support for form controls like checkboxes (underlying
            events currently supported better in Chrome than in Firefox),
            paperclip links, etc.
        1. Modify WebAppFind to support display of independent data files
            (for multiple stickies in this case); or don't only associate
            a file path with individual URLs (file: or http:), but also
            allow associations with tab groups or bookmark folders so that
            if saving a new StickyBrains/CKEditor/word-processing file,
            it will save to a folder where one's ideas are already grouped
        1. Offer grid-like edit ability using SVG Edit with HTML controls
            like checkboxes within `foreignObject`
    1. Make especially the text and HTML editor demos extensible via
        `postMessage` from add-on site to editor which allows for
        introspection of the JavaScript to store for later evaluation and
        then will put into its own `localStorage` as an add-on. Could
        make the demo post the add-on origin site (and possibly code)
        back to the server (if not indicated as known within client
        code) and allow these to be discoverable by other users (though
        allow opting out of such reporting for privacy reasons).
    1. Demonstrate approach of allowing data files for download (so can
        store them anywhere)--if not AYW approach for namespaced shared
        browser access--as well as data files chosen from File selector
        (and save over such a file if within the protocol and user permits)
    1. Demo use of
        [Speech Synthesis](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#tts-section)
        with an HTML or text file (see
        [HTML5Rocks](http://updates.html5rocks.com/2014/01/Web-apps-that-talk---Introduction-to-the-Speech-Synthesis-API)) and
        [Voice recognition](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechreco-section)
        from an audio file. Also allow voice recognition as feature in normal
        text/HTML demos.
    1. Utilize <https://github.com/brettz9/octokit.js> to allow HTML, SVG,
        etc. demos to be pushed directly to a Github repo (no universal
        REST Git API?); could also use with AsYouWish and command line to
        update a local repo as well (and use cdn.rawgit.com for public
        sharing of content).
    1. With other add-ons/tools
        1. Demo WebAppFind usage with <http://kb.mozillazine.org/View_source.editor.external>
            and <http://kb.mozillazine.org/View_source.editor.path>
        1. Demo WebAppFind usage with external editing editor for textareas
            using [It's All Text! add-on](https://addons.mozilla.org/en-US/firefox/addon/its-all-text/)
            ([repo](https://github.com/docwhat/itsalltext/)); or adapt to
            allow optional embedding of web app in place in iframe?
    1. `filetypes.json` (once new version may restore this functionality)
        1. Desktop file to desktop app demo (using `filetypes.json`)?
        1. Demo of same-domain, CORS, or AsYouWish client checking
            `filetypes.json` on a server to determine how to serve?
            (as opposed to WebAppFind)
        1. Demo of server detecting its own `filetypes.json` (see
            possible todo above)
        1. Since WebAppFind relies on files downloaded to the user's desktop,
            demonstrate with the HTML5 "download" attribute how sites might
            deliver a data file that the user could then place and call (and
            optionally also supplying a `filetypes.json` file). Also
            demonstrate (once functionality is complete), the downloading of
            a remote document file and subsequent optional PUT request back
            to the server to save it there (and AsYouWish requesting to
            save multiple files at once in a particular directory or the
            zip example above).
    1. SendTo webappdir (once functionality restored)
        1. Demo to make a zip within the passed path
            (using [JSZip](https://github.com/Stuk/jszip)) from
            right-click (would require no local files besides
            WebAppFind/AsYouWish (or just WebAppFind if directory
            functionality added) and the SendTo batch file). Also ensure
            demos with files and folders together.
1. webappfind.js
    1. Adapt the webappfind.js utility class to reduce demo code (and
        allow better forward compatibility with any API changes).
