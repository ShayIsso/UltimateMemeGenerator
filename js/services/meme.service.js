'use strict';

let gImgs = []
let gMeme

_createImgs()
_createMeme()

function getMeme() {
    return gMeme
}

function getImgs() {
    return gImgs
}

function getImgById(imgId) {
    return gImgs.find(img => img.id === imgId)
}

function _createMeme(imgId = gImgs[0].id) {
    gMeme = {
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
    return gMeme
}

function _createImgs() {
    for (let i = 1; i <= 25; i++) {
        const formattedId = i < 10 ? `0${i}` : `${i}`;
        const url = `img/${i < 10 ? `00${i}` : `0${i}`}.jpg`;

        gImgs.push({
            id: i,
            formattedId: formattedId,
            url: url,
            keywords: ['funny', 'dance']
        });
    }
}

function setLineText(txt) {
    gMeme.lines[0].txt = txt
}

function setImg(imgId) {
   _createMeme(imgId)
}