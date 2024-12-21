'use strict';

let gImgs
let gMeme

_createMemes()

function getMeme() {
    return gMeme
}

function getImgById(imgId) {
    return gImgs.find(img => img.id === imgId)
}

function _createMemes() {
    gImgs = [{ id: 1, url: 'img/001.jpg', keywords: ['funny', 'dance'] }, { id: 2, url: 'img/002.jpg', keywords: ['funny', 'dog'] }]

    gMeme = _createMeme(1)
}

function _createMeme(imgId) {
    return {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'I sometimes eat Falafel',
                size: 20,
                color: 'red'
            }
        ]
    }
}