'use strict';
let gElCanvas
let gCtx

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    window.onresize = resizeCanvas

    renderMeme()
}


function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight

    renderMeme()
}

function renderMeme() {
    const { selectedImgId } = getMeme()
    const imgData = getImgById(selectedImgId)
    
    const img = new Image()
    img.src = imgData.url
    img.onload = () => {
        drawImage(img)
    }
}

function drawImage(img) {
    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}