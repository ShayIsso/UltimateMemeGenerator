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
        alignment: 'center',
        lineWidth: 0,
        lineHeight: 0,
        lineX: 0,
        lineY: 0,
    }
}

function setLineText(txt) {
    const { lines, selectedLineIdx } = gMeme
    if (selectedLineIdx === -1 || !lines || lines.length <= 0) return
    lines[selectedLineIdx].txt = txt
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
}

function setStrokeStyle(newColor) {
    const { lines, selectedLineIdx } = gMeme
    if (selectedLineIdx === -1 || !lines || lines.length <= 0) return
    lines[selectedLineIdx].strokeColor = newColor
}

function setFillStyle(newColor) {
    const { lines, selectedLineIdx } = gMeme
    if (selectedLineIdx === -1 || !lines || lines.length <= 0) return
    lines[selectedLineIdx].fillColor = newColor
}

function changeLineSize(diff) {
    const { lines, selectedLineIdx } = gMeme
    if (selectedLineIdx === -1 || !lines || lines.length <= 0) return
    lines[selectedLineIdx].size += diff
}

function setAlignment(newAlignment) {
    const { lines, selectedLineIdx } = gMeme
    if (selectedLineIdx === -1 || !lines || lines.length <= 0) return
    lines[selectedLineIdx].alignment = newAlignment
}

function addLine() {
    const { lines } = gMeme
    const newLine = _createLine()
    lines.push(newLine)
    gMeme.selectedLineIdx = lines.length - 1
}

function deleteLine() {
    const { lines, selectedLineIdx } = gMeme

    if (lines.length === 1) {
        lines.splice(0, 1)
        gMeme.selectedLineIdx = -1
    } else {
        lines.splice(selectedLineIdx, 1)
        gMeme.selectedLineIdx = Math.max(0, selectedLineIdx - 1)
    }
}

function switchLine() {
    const { selectedLineIdx, lines } = gMeme
    gMeme.selectedLineIdx = (selectedLineIdx < lines.length - 1) ? selectedLineIdx + 1 : 0
}

function updateTextBoundingBox(idx, boxX, boxY, boxWidth, boxHeight) {
    gMeme.lines[idx].lineWidth = boxWidth
    gMeme.lines[idx].lineHeight = boxHeight
    gMeme.lines[idx].lineX = boxX
    gMeme.lines[idx].lineY = boxY
}

function setSelectedLineIdx(idx) {
    gMeme.selectedLineIdx = idx
}