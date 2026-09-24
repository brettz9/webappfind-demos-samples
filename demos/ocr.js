/* globals OCRAD, GOCR -- Non-ESM */
/* eslint-disable no-console -- Debugging */

/*
Todos:
1. Detect from the decoded URL "params" JSON object's fileType whether
    a PDF, image, or SVG has been opened and act accordingly in order to OCR.
*/

import * as PDFJS from 'pdfjs-dist';

/**
 * @param {string} sel
 * @returns {HTMLElement}
 */
function $ (sel) {
  // We are ensuring our elements always exist
  return /** @type {HTMLElement} */ (document.querySelector(sel));
}

/**
 * @param {string} sel
 * @returns {HTMLInputElement}
 */
function $i (sel) {
  // We are ensuring our elements always exist
  return /** @type {HTMLInputElement} */ (document.querySelector(sel));
}
/**
 * @param {string} sel
 * @returns {HTMLTextAreaElement}
 */
function $t (sel) {
  // We are ensuring our elements always exist
  return /** @type {HTMLTextAreaElement} */ (document.querySelector(sel));
}

/** @type {import('pdfjs-dist').PDFDocumentProxy} */
let pdfObj,
  /** @type {HTMLCanvasElement} */
  canvas,
  /** @type {CanvasRenderingContext2D} */
  context,
  initial,
  /** @type {number} */
  endValue,
  /** @type {(canvas: HTMLCanvasElement) => string} */
  ocrEngine;
const saveMessage = 'save',
  excludedMessages = [saveMessage];

/**
 * @param {number} pgNum
 * @returns {Promise<void>}
 */
async function getPDF (pgNum) {
  // Using promise to fetch the page
  const page = await pdfObj.getPage(pgNum);
  const scale = 1.5;
  // eslint-disable-next-line no-shadow -- Convenient
  const viewport = page.getViewport({scale});

  // Prepare canvas using PDF page dimensions
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  // Render PDF page into canvas context
  const renderContext = {
    canvas,
    canvasContext: context,
    viewport
  };
  await page.render(renderContext).promise;
  const string = ocrEngine(canvas);
  $t('#ocr-output').value += string;
  $t('#ocr-output').blur();
  if (pgNum === endValue) {
    $t('#ocr-output').readOnly = false;
    $i('#begin').readOnly = false;
    $i('#end').readOnly = false;
    $('#message').style.visibility = 'hidden';
    canvas.style.visibility = 'visible';
    return;
  }
  getPDF(pgNum + 1);
}

/**
 * @returns {void}
 */
function resetPDF () {
  $i('#begin').readOnly = true;
  $i('#end').readOnly = true;
  $t('#ocr-output').readOnly = true;
  $t('#ocr-output').value = '';
  canvas = /** @type {HTMLCanvasElement} */ ($('#the-canvas'));
  context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
  $('#message').style.visibility = 'visible';
  canvas.style.visibility = 'hidden';
  initial = parseInt($i('#begin').value, 10) || 1;
  endValue = parseInt($i('#end').value, 10);
  if (initial > pdfObj.numPages) {
    initial = pdfObj.numPages;
    $i('#begin').value = String(pdfObj.numPages);
  }
  if (!endValue || endValue < initial) {
    endValue = initial;
    $i('#end').value = String(initial);
  } else if (endValue > pdfObj.numPages) {
    endValue = pdfObj.numPages;
    $i('#end').value = String(pdfObj.numPages);
  }
  // Todo: Switch to `tesseract.js` for greater accuracy (and TypeScript as well)
  ocrEngine = $i('#ocrad').checked
    // @ts-expect-error -- No types
    ? OCRAD
    // @ts-expect-error -- No types
    : GOCR;
  getPDF(initial);
}

/**
 * @param {{data: Uint8Array|string}} doc
 * @returns {Promise<void>}
 */
async function setPDF (doc) {
  // Fetch the PDF document using promises
  //
  const pdf = await (PDFJS.getDocument(
    doc
    // 'helloworld.pdf'
  ).promise);
    // $('#begin').min = $('#end').min = 1;
  $i('#begin').max = $i('#end').max = $i('#end').placeholder = String(pdf.numPages);
  $i('#begin').title = $i('#end').title = 'Max: ' + pdf.numPages + ' pages';
  pdfObj = pdf;
  $i('#begin').readOnly = false;
  $i('#end').readOnly = false;
  $i('#begin').addEventListener('change', resetPDF);
  $i('#end').addEventListener('change', resetPDF);
}

$i('#pdfFile').addEventListener('change', async function (ev) {
  const f = /** @type {File} */ (
    /** @type {HTMLInputElement} */ (ev.target)?.files?.[0]
  );

  const arrayBuffer = await f.arrayBuffer();
  const array = new Uint8Array(arrayBuffer);
  setPDF({data: array});
});

let pathID;
window.addEventListener('message', function ({data, origin: orig}) {
  let type,
    /** @type {{data: string}} */
    content;
  try {
    // May throw if data is not an object
    ({type, pathID, content} = data.webappfind);
    // We are only interested in a message sent as though within
    //  this URL by our browser add-on
    if (orig !== location.origin ||
            // Avoid our post below (other messages might be possible in
            //  the future which may also need to be excluded if your
            //  subsequent code makes assumptions on the type of
            //  message this is)
            excludedMessages.includes(type)
    ) {
      return;
    }
  } catch (err) {
    return;
  }
  switch (type) {
  case 'view':
    // Populate the contents
    /*
        const raw = content;
        const rawLength = raw.length;
        const array = new Uint8Array(new ArrayBuffer(rawLength));
        for (let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        } */
    setPDF({data: content.data});
    // $('#save').disabled = false;
    break;
    // Todo: We could allow raw editing of the PDF until such time
    //   as WYSIWYG editing becomes possible
  case 'save-end':
    // alert(`save complete for pathID ${pathID}!`);
    console.log(`save complete for pathID ${pathID}!`);
    break;
  default:
    throw new Error('Unexpected mode: ' + type);
  }
});
