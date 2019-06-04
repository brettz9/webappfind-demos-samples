/**
 * @external JSONObject
 * @type {object}
 */
/**
 * @typedef {object} PlainObject
 */
/**
* @typedef {PlainObject.<string, boolean|string|string[]|external:JSONObject>}
* module:MetaWebAppFind.Params
*/

/**
 * @param {module:MetaWebAppFind.Params} params
 * @returns {string}
 */
export function serializeParams (params) {
    return Object.entries(params).reduce((s, [key, value]) => {
        if (Array.isArray(value)) {
            value = value.join(' ');
        } else if (value && typeof value === 'object') {
            value = JSON.stringify(value);
        } else if (typeof value === 'boolean') {
            if (!value) {
                return s;
            }
            value = 'on';
        }
        return `${s}&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }, '').slice(1);
}

/* eslint-disable max-len */
/**
 * @param {module:MetaWebAppFind.Params|module:MetaWebAppFind.Params[]} metaInfos
 * @returns {undefined}
 */
export function addMetas (metaInfos) {
    /* eslint-enable max-len */
    metaInfos = Array.isArray(metaInfos) ? metaInfos : [metaInfos];
    document.head.append(...metaInfos.map((params) => {
        const meta = document.createElement('meta');
        meta.name = 'webappfind';
        meta.content = serializeParams(params);
        return meta;
    }));
}

// For content types, find type, e.g. for CSS:
// defaults read
//   /System/Library/CoreServices/CoreTypes.bundle/Contents/Info.plist |
//   grep css

/*
{
  mode: 'view',
  file: 'aFile1.js',
  id: 'anID1',
  extensions: ['aaa', 'bbb', 'ccc'],
  contentTypes: ['text/plain', 'text/json']
},
{
  mode: 'edit',
  file: 'aFile2.js',
  id: 'anID2',
  extensions: ['aaa' 'bbb' 'ccc'],
  contentTypes: ['text/plain', 'text/json'],
  defaultExtensions: 'bbb',
  defaultContentTypes: 'text/json'
},
{
  executableName: 'anExecName',
  mode: 'edit',
  executablePath: 'some/path/'
  binary: true,
  site: 'http://example.com'
},
{
  executableName: 'anotherExecName',
  args: {a: '&'}
}
*/
