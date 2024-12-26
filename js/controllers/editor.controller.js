'use strict';
let gElCanvas
let gCtx
const LINE_HEIGHT_STEP = 50

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
    setInputValue('meme-text', meme)

    const { selectedImgId, lines, selectedLineIdx } = meme
    const imgData = getImgById(selectedImgId)

    const img = new Image()
    img.src = imgData.url
    img.onload = () => {
        drawImage(img)
        drawText(lines, selectedLineIdx)
        focusOnInput()
    }
}

function drawImage(img) {
    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function drawText(lines, selectedLineIdx) {
    lines.forEach((line, idx) => {
        const { txt, size, fillColor, strokeColor, alignment, lineX, lineY } = line

        gCtx.font = `800 ${size}px Poppins`
        gCtx.textAlign = alignment

        let x = getStartX(alignment)
        const y = LINE_HEIGHT_STEP * (idx + 1)

        gCtx.lineWidth = 2
        gCtx.fillStyle = fillColor
        gCtx.strokeStyle = strokeColor

        const { boxX, boxY, boxWidth, boxHeight } = getTextBoxSize(gCtx, txt, x, y, alignment)
        updateTextBoundingBox(idx, boxX, boxY, boxWidth, boxHeight)


        gCtx.strokeText(txt, x, y)
        if (idx === selectedLineIdx) {
            drawTextBox(idx, boxX, boxY, boxWidth, boxHeight)
        }

        gCtx.fillText(txt, x, y)
    })
}

function getTextBoxSize(gCtx, txt, x, y, alignment, padding = 10) {
    const measure = gCtx.measureText(txt)
    const txtWidth = measure.width
    const txtHeight = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent

    let boxX
    switch (alignment) {
        case 'left':
            boxX = x - padding
            break
        case 'right':
            boxX = x - txtWidth - padding
            break
        case 'center':
            boxX = x - (txtWidth / 2) - padding
            break
    }
    return {
        boxX: boxX,
        boxY: y - measure.actualBoundingBoxAscent - padding,
        boxWidth: txtWidth + (padding * 2),
        boxHeight: txtHeight + (padding * 2)
    }
}

function getStartX(alignment) {
    switch (alignment) {
        case 'left': return 20
        case 'right': return gElCanvas.width - 20
        case 'center': return gElCanvas.width / 2
    }
}

function drawTextBox(idx, boxX, boxY, boxWidth, boxHeight) {
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 2
    gCtx.strokeRect(boxX, boxY, boxWidth, boxHeight)

    updateTextBoundingBox(idx, boxX, boxY, boxWidth, boxHeight)
}

function onSetLineText(txt) {
    setLineText(txt.value)
    renderMeme()
}

function onDownloadImg(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg', 1.0)
    elLink.href = imgContent
    elLink.download = 'my-meme.jpeg'
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
    button.style.color = color
}

function onChangeLineSize(diff) {
    changeLineSize(diff)
    renderMeme()
}

function onAddLine() {
    addLine()
    renderMeme()
    focusOnInput(true)
}

function onDeleteLine() {
    deleteLine()
    renderMeme()
}

function onSwitchLine() {
    switchLine()
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

    clickedLineIdx !== -1 ? setSelectedLineIdx(clickedLineIdx) : setSelectedLineIdx(-1)
    renderMeme()
}

function onSetAlignment(align) {
    setAlignment(align)
    renderMeme()
}

function focusOnInput(clear = false) {
    const elInput = document.querySelector('.meme-text-input');
    if (!elInput) return;

    if (clear) elInput.value = ''
    elInput.focus()

    const txtLen = elInput.value.length
    elInput.setSelectionRange(txtLen, txtLen)
}