'use strict';
let gElCanvas
let gCtx
let gStartPos
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']
const LINE_HEIGHT_STEP = 50

function initCanvas() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
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
        // focusOnInput()
    }
}

function drawImage(img) {
    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function drawText(lines, selectedLineIdx) {
    lines.forEach((line, idx) => {
        const { txt, size, fillColor, strokeColor, alignment, pos } = line

        gCtx.font = `800 ${size}px Poppins`
        gCtx.textAlign = alignment

        const x = pos ? pos.x : getStartX(alignment)
        const y = pos ? pos.y : LINE_HEIGHT_STEP * (idx + 1)

        gCtx.lineWidth = 2
        gCtx.fillStyle = fillColor
        gCtx.strokeStyle = strokeColor

        const { boxX, boxY, boxWidth, boxHeight } = getTextBoxSize(gCtx, txt, x, y, alignment)
        updateTextBoundingBox(idx, boxX, boxY, boxWidth, boxHeight)


        gCtx.strokeText(txt, x, y)
        gCtx.fillText(txt, x, y)
        if (idx === selectedLineIdx) {
            drawTextBox(idx, boxX, boxY, boxWidth, boxHeight)
        }
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
    // focusOnInput(true)
}

function onDeleteLine() {
    deleteLine()
    renderMeme()
}

function onSwitchLine() {
    switchLine()
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

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    //Listen for resize ev
    window.addEventListener('resize', resizeCanvas)
  }

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}


function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}

function onDown(ev) {
    const pos = getEvPos(ev)
    const { lines } = getMeme()
    
    const clickedLineIdx = lines.findIndex(({ boxX, boxY, boxWidth, boxHeight }) => {
        return pos.x >= boxX && pos.x <= boxX + boxWidth
            && pos.y >= boxY && pos.y <= boxY + boxHeight
    })
    
    if (clickedLineIdx !== -1) {
        setSelectedLineIdx(clickedLineIdx)
        const line = lines[clickedLineIdx]

        if (!line.pos) {
            line.pos = { x: pos.x, y: pos.y }
        }

        gStartPos = line.pos
        setLineDrag(true)
        document.body.style.cursor = 'grabbing'
    } else {
        setSelectedLineIdx(-1)
    }
    
    renderMeme()

}

function onMove(ev) {
    const meme = getMeme()
    const { lines, selectedLineIdx } = meme

    if (selectedLineIdx === -1 || !lines[selectedLineIdx] || !lines[selectedLineIdx].isDrag) return

    const pos = getEvPos(ev)

    const dx = pos.x - gStartPos.x 
    const dy = pos.y - gStartPos.y
    moveLine(dx, dy)

    gStartPos = pos
    renderMeme()
}

function onUp() {
    const meme = getMeme()
    const { selectedLineIdx } = meme
    
    if (selectedLineIdx !== -1) {
        setLineDrag(false)
        document.body.style.cursor = 'grab'
        renderMeme() 
        // focusOnInput() 
    }
}