'use strict';
const STORAGE_KEY = 'memeDB'

let gImgs = []
let gSavedMemes  = loadFromStorage(STORAGE_KEY) || []
let gMeme
let gKeywords = ['Happy', 'Sad', 'Crazy', 'Sarcastic', 'Funny']
let gKeywordSearchCountMap = {
    'Happy': 16,
    'Sad': 16,
    'Crazy': 16,
    'Sarcastic': 16,
    'Funny': 16
}

createMeme()
_createImgs()


function createMeme() {
    gMeme = {
        id: makeId(), 
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

function getKeywords() {
    return gKeywords
}

function getKeywordSize(keyword) {
    return gKeywordSearchCountMap[keyword]
}

function _createImgs() {
    gImgs = [
        { id: makeId(), url: 'imgs/001.jpg', keywords: ['funny', 'politics', 'trump'] },
        { id: makeId(), url: 'imgs/002.jpg', keywords: ['cute', 'dog', 'happy'] },
        { id: makeId(), url: 'imgs/003.jpg', keywords: ['cute', 'baby', 'dog', 'sleep'] },
        { id: makeId(), url: 'imgs/004.jpg', keywords: ['cute', 'cat', 'sleep'] },
        { id: makeId(), url: 'imgs/005.jpg', keywords: ['funny', 'baby', 'success'] },
        { id: makeId(), url: 'imgs/006.jpg', keywords: ['funny', 'history', 'science'] },
    ]
}

function addImgToGallery(imgDataUrl) {
    const newImage = {
        id: makeId(),
        url: imgDataUrl
    }
    gImgs.push(newImage)
    return newImage.id
}

function _createLine() {
    return {
        txt: 'Add Text Here',
        size: 25,
        font: 'Poppins',
        fillColor: 'white',
        strokeColor: 'black',
        alignment: 'center',
        pos: null,
        isDrag: false,
        boxSize: { x: 0, y: 0, width: 0, height: 0 },
    }
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
}

function createMemeWithImage(imgId) {
    createMeme()
    setImg(imgId)
}

function isValidLine(lines, selectedLineIdx) {
    return selectedLineIdx !== -1 && lines && lines.length > 0
}

function setLineText(txt) {
    const { lines, selectedLineIdx } = gMeme
    if (!isValidLine(lines, selectedLineIdx)) return
    lines[selectedLineIdx].txt = txt
}

function setStrokeStyle(newColor) {
    const { lines, selectedLineIdx } = gMeme
    if (!isValidLine(lines, selectedLineIdx)) return
    lines[selectedLineIdx].strokeColor = newColor
}

function setFillStyle(newColor) {
    const { lines, selectedLineIdx } = gMeme
    if (!isValidLine(lines, selectedLineIdx)) return
    lines[selectedLineIdx].fillColor = newColor
}

function changeLineSize(diff) {
    const { lines, selectedLineIdx } = gMeme
    if (!isValidLine(lines, selectedLineIdx)) return
    lines[selectedLineIdx].size += diff
}

function setAlignment(newAlignment) {
    const { lines, selectedLineIdx } = gMeme
    if (!isValidLine(lines, selectedLineIdx)) return
    lines[selectedLineIdx].alignment = newAlignment
}

function setFont(newFont) {
    const { lines, selectedLineIdx } = gMeme
    if (!isValidLine(lines, selectedLineIdx)) return
    lines[selectedLineIdx].font = newFont
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
    if (!isValidLine(lines, selectedLineIdx)) return
    gMeme.selectedLineIdx = (selectedLineIdx < lines.length - 1) ? selectedLineIdx + 1 : 0
}

function updateTextBoundingBox(idx, boxX, boxY, boxWidth, boxHeight) {
    gMeme.lines[idx].boxSize.x = boxX
    gMeme.lines[idx].boxSize.y = boxY
    gMeme.lines[idx].boxSize.width = boxWidth
    gMeme.lines[idx].boxSize.height = boxHeight
}

function setSelectedLineIdx(idx) {
    gMeme.selectedLineIdx = idx
}

function setLineDrag(isDrag) {
    const { selectedLineIdx, lines } = gMeme
    if (!isValidLine(lines, selectedLineIdx)) return
    lines[selectedLineIdx].isDrag = isDrag
}

function moveLine(dx, dy) {
    const { selectedLineIdx, lines } = gMeme
    if (!isValidLine(lines, selectedLineIdx)) return
    lines[selectedLineIdx].pos.x += dx 
    lines[selectedLineIdx].pos.y += dy    
}

function _saveMemesToStorage() {
    saveToStorage(STORAGE_KEY, gSavedMemes)
}

function saveMeme(imgData) {
    const memeToSave = { 
        ...structuredClone(gMeme), 
        imgData: imgData || getImgById(gMeme.selectedImgId)?.url 
    }

    gSavedMemes.push(memeToSave)
    _saveMemesToStorage()
}

function getSavedMemes() {
    return gSavedMemes
}

function updateSavedMemeImg(meme) {
    const img = getImgById(meme.selectedImgId)
    meme.imgData = img.url
}

function getFilteredImgs(searchTerm = '') {
    if (!searchTerm) return gImgs
    
    searchTerm = searchTerm.toLowerCase()
    return gImgs.filter(img => 
        img.keywords.some(keyword => 
            keyword.toLowerCase().includes(searchTerm)
        )
    )
}

function incrementKeyword(keyword) {
    const currentSize = gKeywordSearchCountMap[keyword] || 10
    const newSize = Math.min(30, currentSize + 2)
    gKeywordSearchCountMap[keyword] = newSize
}