/*globals PDFJS, OCRAD, GOCR, FileReader, Uint8Array, ArrayBuffer*/
/*jslint todo: true, vars: true*/

/*
Todos:
1. Detect from the decoded URL "params" JSON object's fileType whether a PDF, image, or SVG has been opened and act accordingly in order to OCR.
*/

function $ (sel) {
    return document.querySelector(sel);
}

let pdfObj, canvas, context, initial, endValue, ocrEngine,
    saveMessage = 'save',
    excludedMessages = [saveMessage];

function getPDF (pgNum) {
    // Using promise to fetch the page
    pdfObj.getPage(pgNum).then(function(page) {
        var scale = 1.5;
        var viewport = page.getViewport(scale);

        // Prepare canvas using PDF page dimensions
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        page.render(renderContext).promise.then(function() {
            var string = ocrEngine(canvas);
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
        });
    });
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
    initial = parseInt($('#begin').value, 10) || 1;
    endValue = parseInt($('#end').value, 10);
    if (initial > pdfObj.numPages) {
        initial = pdfObj.numPages;
        $('#begin').value = pdfObj.numPages;
    }
    if (!endValue || endValue < initial) {
        endValue = initial;
        $('#end').value = initial;
    }
    else if (endValue > pdfObj.numPages) {
        endValue = pdfObj.numPages;
        $('#end').value = pdfObj.numPages;
    }
    ocrEngine = $('#ocrad').checked ? OCRAD : GOCR;
    getPDF(initial);
}

function setPDF (doc) {
    // Fetch the PDF document using promises
    //
    PDFJS.getDocument(
        doc
        // 'helloworld.pdf'
    ).then(function(pdf) {
      // $('#begin').min = $('#end').min = 1;
      $('#begin').max = $('#end').max = $('#end').placeholder = pdf.numPages;
      $('#begin').title = $('#end').title = 'Max: ' + pdf.numPages + ' pages';
      pdfObj = pdf;
      $('#begin').readOnly = false;
      $('#end').readOnly = false;
      $('#begin').addEventListener('change', resetPDF);
      $('#end').addEventListener('change', resetPDF);
  });
}

$('#pdfFile').addEventListener('change', function (ev) {

    var f = ev.target.files[0];

    var reader = new FileReader();
    reader.onload = function (e) {
        var arrayBuffer = e.target.result;
        var array = new Uint8Array(arrayBuffer);
        setPDF(array);
    };
    reader.readAsArrayBuffer(f);
});

let pathID;
window.addEventListener('message', function ({data, origin}) {
    let type, content;
    try {
        ({type, pathID, content} = data.webappfind); // May throw if data is not an object
        if (origin !== location.origin || // We are only interested in a message sent as though within this URL by our browser add-on
            excludedMessages.includes(type) // Avoid our post below (other messages might be possible in the future which may also need to be excluded if your subsequent code makes assumptions on the type of message this is)
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
    // Todo: We could allow raw editing of the PDF until such time as WYSIWYG editing becomes possible
    // case 'save-end':
        // alert(`save complete for pathID ${pathID}!`);
        // break;
    default:
        throw 'Unexpected mode: ' + type;
    }
});
