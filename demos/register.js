// eslint-disable-next-line strict
'use strict';

/**
* @param {Array} arr Array of objects containing the properties,
*   "type" (type info to be added after 'web+local' withint the
*   protocol), "instructions" (for the visible button text), and "info"
*   (for the browser's own protocol message)
*/
// eslint-disable-next-line no-unused-vars
function addRegistrationHandlers (arr, url) { // lgtm [js/unused-local-variable]
    function $ (sel) {
        return document.querySelector(sel);
    }
    url = url || (window.location.href.replace(/\?.*$/u, '') + '?uri=%s');
    arr.forEach(function (method) {
        const button = document.createElement('button');
        button.id = method.type;
        button.style.margin = '7px';
        button.append(method.instructions);
        button.addEventListener('click', function (e) {
            try {
                navigator.registerProtocolHandler(
                    'web+local' + e.target.id, // e.g., web+localviewhtmltype:
                    url,
                    method.info
                );
            } catch (err) {
                if (url.match(/file:/u)) {
                    // eslint-disable-next-line no-alert
                    alert(
                        'You must host this file on a server in order ' +
                        'to register a protocol.'
                    );
                    return;
                }
                // eslint-disable-next-line no-alert
                alert(err);
            }
        });
        $('#actions').append(button);
        $('#actions').append(document.createElement('br'));
    });
}
