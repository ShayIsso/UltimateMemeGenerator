'use strict';

function makeId(length = 6) {
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	var id = ''

	for (var i = 0; i < length; i++) {
		id += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return id
}

function togglePage(page) {
	if (page === 'editor') {
		document.querySelector('.meme-editor-page').classList.remove('hidden')
		document.querySelector('.meme-gallery-page').classList.add('hidden')
	} else if (page === 'gallery') {
		document.querySelector('.meme-gallery-page').classList.remove('hidden')
		document.querySelector('.meme-editor-page').classList.add('hidden')
	}
}

function setInputValue(inputClass, meme) {
	const elInput = document.querySelector(`.${inputClass}-input`)

	if (meme) {
		const { lines, selectedLineIdx } = gMeme
		const { txt } = lines[selectedLineIdx]

		elInput.value = txt
	} else {
		elInput.value = ''
	}
}