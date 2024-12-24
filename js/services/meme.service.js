'use strict';

let gImgs = []
let gMeme 

createMeme()
_createImgs()


function createMeme() {
    gMeme = {
        selectedImgId: 1,
        selectedLineIdx: 0,
        lines: [_createLine()]
    }
}

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

function _createLine() {
    return {
        txt: 'Add Text Here',
        size: 25,
        fillColor: 'white',
        strokeColor: 'black',
        lineWidth: 0,
        lineHeight: 0,
        lineX: 0,
        lineY: 0,
    }
}

function setLineText(txt) {
    const { selectedLineIdx } = gMeme
    gMeme.lines[selectedLineIdx].txt = txt
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
}

function setStrokeStyle(newColor) {
    const { lines, selectedLineIdx } = gMeme
    lines[selectedLineIdx].strokeColor = newColor
}

function setFillStyle(newColor) {
    const { lines, selectedLineIdx } = gMeme
    lines[selectedLineIdx].fillColor = newColor
}

function changeLineSize(diff) {
    const { lines, selectedLineIdx } = gMeme
    lines[selectedLineIdx].size += diff
}

function addLine() {
    const { lines } = gMeme
    const newLine = _createLine()
    lines.push(newLine)
    gMeme.selectedLineIdx++
}

function switchLine() {
    const { selectedLineIdx, lines } = gMeme
    gMeme.selectedLineIdx = (selectedLineIdx < lines.length - 1) ? selectedLineIdx + 1 : 0
}

function updateLineBoundingBox(idx, rectX, rectY, rectWidth, rectHeight) {
    gMeme.lines[idx].lineWidth = rectWidth
    gMeme.lines[idx].lineHeight = rectHeight
    gMeme.lines[idx].lineX = rectX
    gMeme.lines[idx].lineY = rectY
}

function setSelectedLineIdx(idx){ 
    gMeme.selectedLineIdx = idx
}