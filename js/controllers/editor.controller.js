'use strict';
let gElCanvas
let gCtx

function initCanvas() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight

    renderMeme()
}

function renderMeme() {
    const meme = getMeme()
    const { selectedImgId, lines, selectedLineIdx } = meme
    const imgData = getImgById(selectedImgId)

    const img = new Image()
    img.src = imgData.url
    img.onload = () => {
        drawImage(img)
        drawText(lines, selectedLineIdx)
    }
}

function drawImage(img) {
    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function drawText(lines, selectedLineIdx) {
    let lineHeight = 50
    lines.forEach((line, idx) => {
        const { txt, size, fillColor, strokeColor } = line

        gCtx.font = `800 ${size}px Poppins`
        gCtx.textAlign = 'center'

        const x = gElCanvas.width / 2
        const y = lineHeight

        gCtx.lineWidth = 2
        gCtx.fillStyle = fillColor
        gCtx.strokeStyle = strokeColor
    
        gCtx.strokeText(txt, x, y)
        if (idx === selectedLineIdx) {
            drawTextFrame(x, y, gCtx.measureText(txt), idx)
        }

        gCtx.fillText(txt, x, y)
        lineHeight+=50
    })
}

function drawTextFrame(x, y, { width: txtWidth, actualBoundingBoxAscent, actualBoundingBoxDescent }, idx) {
    const padding = 10
    const txtHeight = actualBoundingBoxAscent + actualBoundingBoxDescent
    const rectX = x - (txtWidth / 2) - padding
    const rectY = y - actualBoundingBoxAscent - padding
    const rectWidth = txtWidth + (padding*2)
    const rectHeight = txtHeight + (padding*2)

    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 2
    gCtx.strokeRect(rectX, rectY, rectWidth, rectHeight)

    updateLineBoundingBox(idx, rectX, rectY, rectWidth, rectHeight)
}

function onSetLineText(txt) {
    setLineText(txt.value)
    renderMeme()
}

function onDownloadImg(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg', 1.0)
    elLink.href = imgContent
    elLink.download  = 'my-meme.jpeg'
}

function onSetStrokeStyle(elColor) {
    const newColor = elColor.value
    setStrokeStyle(newColor)
    setButtonBackgroundColor(newColor, 'stroke')
    renderMeme()
}

function onSetFillStyle(elColor) {
    const newColor = elColor.value
    setFillStyle(newColor)
    setButtonBackgroundColor(newColor, 'fill')
    renderMeme()
}

function setButtonBackgroundColor(color, type) {
    const button = document.querySelector(`.${type}-color`) 
    button.style.backgroundColor = color
}

function onChangeLineSize(diff) {
    changeLineSize(diff)
    renderMeme()
}

function onAddLine() {
    addLine()
    renderMeme()
}

function onDeleteLine() {
    deleteLine()
    renderMeme()
}

function onSwitchLine() {    
    switchLine()
    setInputValue('meme-text', getMeme())
    renderMeme()
}

function onLineClick(ev) {
    const meme = getMeme()
    const { offsetX, offsetY } = ev
    const { lines } = meme

    const clickedLineIdx = lines.findIndex(({ lineX, lineY, lineWidth, lineHeight }) => {
      return offsetX >= lineX && offsetX <= lineX + lineWidth
        && offsetY >= lineY && offsetY <= lineY + lineHeight
    })
    
    if (clickedLineIdx !== -1) {
        setSelectedLineIdx(clickedLineIdx)
        setInputValue('meme-text', meme)
        renderMeme()
    }
}    
