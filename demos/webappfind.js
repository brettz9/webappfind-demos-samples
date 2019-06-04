/*
TODOS
1. Employ this across all demos, adapting as needed
*/

/**
* @typedef {object} PlainObject
*/
/**
 * @callback module:WebAppFind.SaveEndCallback
 * @param {PlainObject} results
 * @param {string} results.pathID
 */
/**
 * @callback module:WebAppFind.ViewCallback
 * @param {PlainObject} results
 * @param {string|TypedArray} results.content
 * @param {string} results.pathID
 */

/**
* @typedef {PlainObject} module:WebAppFind.MessageHandlers
* @property {module:WebAppFind.ViewCallback} [view]
* @property {module:WebAppFind.SaveEndCallback} [saveEnd]
*/
/**
* @typedef {PlainObject} module:WebAppFind.Options
* @property {string[]} [excludedMessages=["save"]] Array of
*   message types to avoid erring upon encountering (besides
*   `view` and `save-end`)
*/

class WebAppFind {
    /**
     * @param {module:WebAppFind.MessageHandlers} [messageHandlers]
     * @param {module:WebAppFind.Options} [options]
     */
    constructor (messageHandlers, options) {
        messageHandlers = messageHandlers || {};
        options = options || {};
        // Accepts as arguments: content, pathID
        this.view = messageHandlers.view;
        this.saveEnd = messageHandlers.saveEnd;
        this.excludedMessages = options.excludedMessages || ['save'];
        this.resolvers = [];
        this.init();
    }

    /**
     * @returns {undefined}
     */
    init () {
        if (!document.body) {
            window.addEventListener(
                'DOMContentLoaded',
                this.addListeners.bind(this)
            );
        } else {
            this.addListeners();
        }
    }

    /**
     * @returns {undefined}
     */
    addListeners () {
        window.addEventListener('message', ({data, origin: orig}) => {
            // Could allow config to loosen for whitelisted sites
            let type, content, pathID;
            try {
                // May throw if data is not an object
                ({type, pathID, content} = data.webappfind);
                // We are only interested in a message sent as though within
                //   this URL by our browser add-on
                if (orig !== location.origin ||
                    // Avoid our post below (other messages might be possible in
                    //  the future which may also need to be excluded to avoid
                    //  the error below)
                    this.excludedMessages.includes(type)
                ) {
                    return;
                }
                Object.assign(this, {type, pathID, content});
            } catch (err) {
                // eslint-disable-next-line no-console
                console.log('err', err);
                return;
            }
            switch (type) {
            case 'view':
                // Populate the contents
                if (this.view) { // Probably should exist, but could be excluded
                    this.view({content, pathID: this.pathID});
                }
                break;
            case 'save-end':
                if (this.saveEnd) {
                    this.saveEnd({pathID});
                }
                if (this.resolvers.length) {
                    const [resolve] = this.resolvers.shift();
                    resolve({pathID});
                }
                break;
            default:
                throw new Error('Unexpected mode: ' + type);
            }
        });
    }

    /**
     * @param {string|TypedArray} content Content to save
     * @returns {Promise} Resolves to an object with a `pathID` string
     * @todo Get WebAppFind to provide incrementing or unique ID, so can ensure
     * Promise is the correct one!
     */
    save (content) {
        if (!this.pathID) {
            throw new Error(
                'No pathID set by Firefox yet! Remember to invoke this ' +
                'file from an executable or command line and in edit mode.'
            );
        }
        // eslint-disable-next-line promise/avoid-new
        return new Promise((resolve, reject) => {
            this.resolvers.push([resolve, reject]);
            window.postMessage({
                webappfind: {
                    type: 'save',
                    pathID: this.pathID,
                    content
                }
            // Could make origin configurable if wished to leak info
            //   to other sites
            }, location.origin);
        });
    }
}

// EXPORTS
export default WebAppFind;
