'use strict';

function onInit() {
    renderGallery()

    if (gSavedMemes.length > 0) {
        renderSaved()
        console.log(gSavedMemes)
    }
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
    createMemeWithImage(imgId)
    togglePage('editor') 
    // initEditor()
    initCanvas()
    // renderMeme()
}

function onShowGalleryPage() {
    togglePage('gallery')
    setInputValue('meme-text')
}

function onShowSavedPage() {
    togglePage('saved')
    renderSaved()
}

function renderSaved() {
    const savedMemes = getSavedMemes()
    if (!savedMemes.length) {
        document.querySelector('.meme-saved-page main').innerHTML = '<p>No saved memes found.</p>'
        return
    }

    const strHtmls = savedMemes.map((meme, idx) => `
        <article class="meme-image">
            <img src="${meme.imgData}" alt="Saved Meme ${idx + 1}" onclick="onLoadSavedMeme(${idx})">
        </article>
    `).join('');
    document.querySelector('.meme-saved-page .meme-container').innerHTML = strHtmls
}

function onLoadSavedMeme(memeIdx) {
    const memeToLoad = gSavedMemes[memeIdx]
    if (!memeToLoad) return

    gMeme = structuredClone(memeToLoad)
    // initEditor()

    togglePage('editor')
    renderMeme()
}

function onImgInput(ev) {
    loadImageFromInput(ev, (img) => {
        const imgDataUrl = img.src
        const imgId = handleUploadedImage(imgDataUrl)
        createMemeWithImage(imgId)
        togglePage('editor')
        renderMeme()
    })
}
function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader();

    reader.onload = function (event) {
        const img = new Image()
        img.onload = () => {
            onImageReady(img)}
        img.src = event.target.result
    }

    reader.readAsDataURL(ev.target.files[0]);
}

function onImageReady(img) {
    const imgDataUrl = img.src
    saveUploadedImg(imgDataUrl)
    renderGallery()
}


function handleUploadedImage(imgDataUrl) {
    return addImgToGallery(imgDataUrl)
}