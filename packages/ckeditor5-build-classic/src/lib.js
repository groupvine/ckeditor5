// Use normal jquery since we don't expect to see any Nunjucks
// instructions embedded in the content within the CKEditor (only
// used for incoming emails or in layout templates)

const $ = require( "jquery" );

const urlParse = require('url-parse');

function checkForMetaImg($doc, elem, options) {
    if (!options) { options = {}; }

    let change = false;
    let $elem = $(elem);
    let imgSrc;

    let tagName = $elem.get(0).tagName ? $elem.get(0).tagName.toLowerCase() : '';

    if (tagName === 'figure') {
        let $img = $elem.find('img');
        imgSrc = $img.attr('src');   // gets 'src' of first matched element
    } else {
        imgSrc = $elem.attr('src');
    }

    if (!imgSrc) {
        return false;
    }

    let parsed = urlParse(imgSrc, true);
    if (!parsed) {
        return false;
    }

    let host = parsed.hostname.toLowerCase();

    // TODO: Paramaterize?
    if (!host.startsWith('metaimg.localhost') &&
        !host.startsWith('metaimg.groupvine') &&
        !host.startsWith('metaimg.trivy')) {
        return false;
    }

    let parts = parsed.pathname.split('/');
    if (parts.length < 3) {
        return false;
    }

    let macroType = parts[1];
    let microType = parts[2];

    if (options.ewOnly) {
        if (macroType.toLowerCase() !== 'ew') {
            return false;
        }
    }

    let attNames = Object.keys(parsed.query);
    let dataAtts = [];
    for (let i = 0; i < attNames.length; i++) {
        dataAtts.push('data-' + attNames[i] + '=' + parsed.query[attNames[i]]);
    }

    let dataAttStr = dataAtts.join(' ');
    if (dataAttStr) {
        dataAttStr = ' ' + dataAttStr;
    }

    let newElem = `<span class="gv-metatag"${dataAttStr}>${macroType}/${microType}</span>`;

    if (tagName === 'figure') {
        newElem = `<p> ${newElem} </p>`;
    }
    
    $elem.replaceWith(newElem);

    return true;  // change was made
};


export function convertMetaImgsToView(data) {
    data = '<div>' + data + '</div>';   // put in overall wrapper
    let $doc = $(data);

    // Check <figure>s first, so we replace entire figure element
    // if the embedded img is a GV metaimg
    $doc.find('figure').each( (i, elem) => {
        checkForMetaImg($doc, elem);
    });

    // Then check individual images (i.e., include those that aren't
    // wrapped in <figure>s
    $doc.find('img').each( (i, elem) => {
        checkForMetaImg($doc, elem);
    });

    data = $doc.html();  // Render result within wrapper

    return data;
}

export function anyMetaImgEWs(data) {
    data = '<div>' + data + '</div>';   // put in overall wrapper
    let $doc = $(data);

    let isChange = false;

    // Check <figure>s first, so we replace entire figure element
    // if the embedded img is a GV metaimg
    $doc.find('figure').each( (i, elem) => {
        if ( checkForMetaImg($doc, elem, {ewOnly:true}) ) {
            isChange = true;
            return false;
        }
        return true;  // continue
    });

    if (isChange) {
        return true;
    }

    // Then check individual images (i.e., include those that aren't
    // wrapped in <figure>s
    $doc.find('img').each( (i, elem) => {
        if ( checkForMetaImg($doc, elem, {ewOnly:true}) ) {
            isChange = true;
            return false;
        }
        return true;  // continue
    });

    return isChange;
}

//
// Copied from gv-mailweb/client/.../window.service.ts
//

export function isMobile() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        return true;
    }
    let size = computeWindowSize();

    if ( (Math.min(size.width, size.height) <= 550) &&
         (Math.max(size.width, size.height) <= 1000) ) {
        return true;
    }

    return false;
}

export function computeWindowSize() {
    return  {
        height : window.innerHeight, 
        width  : window.innerWidth
    };
}
