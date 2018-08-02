/*
TODOS
1. Employ this across all demos, adapting as needed
*/

class WebAppFind {
    constructor (messageHandlers, options) {
        messageHandlers = messageHandlers || {};
        options = options || {};
        if (!(this instanceof WebAppFind)) {
            return new WebAppFind();
        }
        this.view = messageHandlers.view; // Accepts as arguments: content, pathID
        this.saveEnd = messageHandlers.saveEnd;
        this.excludedMessages = options.excludedMessages || ['save'];
        this.init();
    }

    init () {
        if (!document.body) {
            window.addEventListener('DOMContentLoaded', this.addListeners.bind(this));
        }
        else {
            this.addListeners();
        }
    }

    addListeners () {
        var that = this;
        window.addEventListener('message', function ({data, origin}) {
            // Could allow config to loosen for whitelisted sites
            let type, content;
            try {
                ({type, pathID, content} = data.webappfind); // May throw if data is not an object
                if (origin !== location.origin || // We are only interested in a message sent as though within this URL by our browser add-on
                    that.excludedMessages.includes(type) // Avoid our post below (other messages might be possible in the future which may also need to be excluded if your subsequent code makes assumptions on the type of message this is)
                ) {
                    return;
                }
                Object.assign(that, {type, pathID, content});
            } catch (err) {
                return;
            }
            switch (type) {
            case 'view':
                // Populate the contents
                that.view(content, that.pathID);
                break;
            case 'save-end':
                that.saveEnd(pathID);
                break;
            default:
                throw 'Unexpected mode: ' + type;
            }
        });
    }

    save (content, errBack) {
        if (!this.pathID) {
            if (!errBack) {
                alert('No pathID set by Firefox yet! Remember to invoke this file from an executable or command line and in edit mode.');
                return;
            }
            errBack();
            return;
        }
        window.postMessage({
            webappfind: {
                type: 'save',
                pathID: this.pathID,
                content
            }
        }, location.origin); // Could make origin configurable if wished to leak info to other sites
    }
}

// EXPORTS
export default WebAppFind;
