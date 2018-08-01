/**
* @typedef {object} PlainObject
*/
/**
* @typedef {null|boolean|string|module:MetaWebAppFind.JSON[]|PlainObject.<string, module:MetaWebAppFind.JSON>} module:MetaWebAppFind.JSON
*/
/**
* @typedef {PlainObject.<string, string|string[]|module:MetaWebAppFind.JSON>} module:MetaWebAppFind.Params
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
    }
    return `${s}&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  }, '').slice(1);
}

/**
 * @param {module:MetaWebAppFind.Params|module:MetaWebAppFind.Params[]} metaInfos
 * @returns {undefined}
 */
export function addMetas (metaInfos) {
    metaInfos = Array.isArray(metaInfos) ? metaInfos : [metaInfos];
    metaInfos.forEach((params) => {
      const meta = document.createElement('meta');
      meta.name = 'webappfind';
      meta.content = serializeParams(params);
      document.head.appendChild(meta);
    });
}

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
  binary: 'on',
  site: 'http://example.com'
},
{
  executableName: 'anotherExecName',
  args: {a: '&'}
}
*/
