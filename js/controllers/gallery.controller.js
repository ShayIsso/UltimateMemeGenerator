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
    togglePage('editor') 
    initCanvas()
}

function onShowGalleryPage() {
    togglePage('gallery')
}