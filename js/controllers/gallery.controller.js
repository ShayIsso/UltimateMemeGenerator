'use strict';

function onInit() {
    renderGallery()
}

function renderGallery() {
    const imgs = getImgs()
    const strHtmls = imgs.map(img => `
        <article class="meme-image">
            <img src="${img.url}" alt="funny meme" onclick="onImgSelect('${img.id}')">
        </article>
        `)

    document.querySelector('.meme-container').innerHTML = strHtmls.join('')
}

function onImgSelect(imgId) {
    setImg(imgId)
    showEditorPage() 
    initCanvas()
}

function showEditorPage() {
    document.querySelector('.meme-editor-page').classList.remove('hidden')
    document.querySelector('.meme-gallery-page').classList.add('hidden')
}