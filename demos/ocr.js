/* globals PDFJS, OCRAD, GOCR */
/* eslint-disable no-console */
/* eslint-env browser */

/*
Todos:
1. Detect from the decoded URL "params" JSON object's fileType whether
    a PDF, image, or SVG has been opened and act accordingly in order to OCR.
*/

function $ (sel) {
  return document.querySelector(sel);
}

let pdfObj, canvas, context, initial, endValue, ocrEngine;
const saveMessage = 'save',
  excludedMessages = [saveMessage];

async function getPDF (pgNum) {
  // Using promise to fetch the page
  const page = await pdfObj.getPage(pgNum);
  const scale = 1.5;
  const viewport = page.getViewport(scale);

  // Prepare canvas using PDF page dimensions
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  // Render PDF page into canvas context
  const renderContext = {
    canvasContext: context,
    viewport
  };
  await page.render(renderContext).promise;
  const string = ocrEngine(canvas);
  $('#ocr-output').value += string;
  $('#ocr-output').blur();
  if (pgNum === endValue) {
    $('#ocr-output').readOnly = false;
    $('#begin').readOnly = false;
    $('#end').readOnly = false;
    $('#message').style.visibility = 'hidden';
    canvas.style.visibility = 'visible';
    return;
  }
  getPDF(++pgNum);
}
function resetPDF () {
  $('#begin').readOnly = true;
  $('#end').readOnly = true;
  $('#ocr-output').readOnly = true;
  $('#ocr-output').value = '';
  canvas = $('#the-canvas');
  context = canvas.getContext('2d');
  $('#message').style.visibility = 'visible';
  canvas.style.visibility = 'hidden';
  initial = parseInt($('#begin').value) || 1;
  endValue = parseInt($('#end').value);
  if (initial > pdfObj.numPages) {
    initial = pdfObj.numPages;
    $('#begin').value = pdfObj.numPages;
  }
  if (!endValue || endValue < initial) {
    endValue = initial;
    $('#end').value = initial;
  } else if (endValue > pdfObj.numPages) {
    endValue = pdfObj.numPages;
    $('#end').value = pdfObj.numPages;
  }
  ocrEngine = $('#ocrad').checked ? OCRAD : GOCR;
  getPDF(initial);
}

async function setPDF (doc) {
  // Fetch the PDF document using promises
  //
  const pdf = await PDFJS.getDocument(
    doc
    // 'helloworld.pdf'
  );
    // $('#begin').min = $('#end').min = 1;
  $('#begin').max = $('#end').max = $('#end').placeholder = pdf.numPages;
  $('#begin').title = $('#end').title = 'Max: ' + pdf.numPages + ' pages';
  pdfObj = pdf;
  $('#begin').readOnly = false;
  $('#end').readOnly = false;
  $('#begin').addEventListener('change', resetPDF);
  $('#end').addEventListener('change', resetPDF);
}

$('#pdfFile').addEventListener('change', function (ev) {
  const f = ev.target.files[0];

  const reader = new FileReader();
  reader.addEventListener('load', function (e) {
    const arrayBuffer = e.target.result;
    const array = new Uint8Array(arrayBuffer);
    setPDF(array);
  });
  reader.readAsArrayBuffer(f);
});

let pathID;
window.addEventListener('message', function ({data, origin: orig}) {
  let type, content;
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
