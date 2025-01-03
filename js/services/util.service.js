'use strict';

function makeId(length = 6) {
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	var id = ''

	for (var i = 0; i < length; i++) {
		id += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return id
}

function getRandomInt(min, max) {
	const minCeiled = Math.ceil(min)
	const maxFloored = Math.floor(max)
	return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
  }

function togglePage(page) {
	if (page === 'editor') {
		document.querySelector('.meme-editor-page').classList.remove('hidden')
		document.querySelector('.meme-gallery-page').classList.add('hidden')
		document.querySelector('.meme-saved-page').classList.add('hidden')
	} else if (page === 'gallery') {
		document.querySelector('.meme-gallery-page').classList.remove('hidden')
		document.querySelector('.meme-editor-page').classList.add('hidden')
		document.querySelector('.meme-saved-page').classList.add('hidden')
	} else if (page === 'saved') {
		document.querySelector('.meme-saved-page').classList.remove('hidden')
		document.querySelector('.meme-editor-page').classList.add('hidden')
		document.querySelector('.meme-gallery-page').classList.add('hidden')

	}
}

function setInputValue(inputClass, meme) {
	const line = meme && meme.lines && meme.lines[meme.selectedLineIdx]
	const elInput = document.querySelector(`.${inputClass}-input`)

	elInput.value = line ? line.txt : ''
}