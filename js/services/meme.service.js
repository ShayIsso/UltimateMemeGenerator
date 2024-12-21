'use strict';

let gImgs
let gMemes


var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 20,
            color: red
        }
    ]
}

function getMeme() {
    return gMeme
}

function _createMemes() {
    gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['funny', 'dance'] }, { id: 2, url: 'img/2.jpg', keywords: ['funny', 'dog'] }]

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
                color: red
            }
        ]
    }
}