'use strict';

let gImgs = []
let gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 20,
            color: 'red'
        }
    ]
}

_createImgs()

function getMeme() {
    return gMeme
}

function getImgs() {
    return gImgs
}

function getImgById(imgId) {
    return gImgs.find(img => img.id === imgId)
}

function _createImgs() {
    for (let i = 1; i <= 25; i++) {
        const urlNum = i < 10 ? `00${i}` : `0${i}`
        const url = `imgs/${urlNum}.jpg`;

        gImgs.push({
            id: makeId(),
            url: url,
            keywords: ['funny', 'dance']
        });
    }
}

function setLineText(txt) {
    gMeme.lines[0].txt = txt
}

function setImg(imgId) {
   gMeme.selectedImgId = imgId
}