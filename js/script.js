const editorContent = document.getElementById('editorContent');
const articleContentHidden = document.getElementById('articleContentHidden');
const articleForm = document.getElementById('articleForm');
const linkModal = document.getElementById('linkModal');
const linkText = document.getElementById('linkText');
const linkUrl = document.getElementById('linkUrl');
const previewModal = document.getElementById('previewModal');
const previewHtmlContent = document.getElementById('previewHtmlContent');
const imageOptionsModal = document.getElementById('imageOptionsModal');
const imageAltText = document.getElementById('imageAltText');
const imageCaption = document.getElementById('imageCaption');
const imageAlignment = document.getElementById('imageAlignment');
const wordCountDisplay = document.getElementById('wordCount');

let savedRange = null;
let activeImage = null;

let history = [];
let historyIndex = -1;
const maxHistoryStates = 50; 

const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');

function saveState() {
    const currentHTML = editorContent.innerHTML;
    if (history[historyIndex] === currentHTML) {
        return;
    }

    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }

    history.push(currentHTML);
    if (history.length > maxHistoryStates) {
        history.shift(); 
    }
    historyIndex = history.length - 1;
    updateUndoRedoButtons();
    updateHiddenContent();
    updateWordCount();
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        editorContent.innerHTML = history[historyIndex];
        placeCaretAtEnd(editorContent); 
        updateUndoRedoButtons();
        updateHiddenContent();
        updateWordCount();
        deselectImage();
    }
}

function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        editorContent.innerHTML = history[historyIndex];
        placeCaretAtEnd(editorContent);
        updateUndoRedoButtons();
        updateHiddenContent();
        updateWordCount();
        deselectImage();
    }
}

function updateUndoRedoButtons() {
    undoBtn.disabled = historyIndex <= 0;
    redoBtn.disabled = historyIndex >= history.length - 1;
}

function placeCaretAtEnd(el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false); 
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

document.addEventListener('DOMContentLoaded', () => {
    saveState();
    updateWordCount();
});
editorContent.addEventListener('input', saveState);
editorContent.addEventListener('blur', saveState);

function formatDoc(command, value = null) {
    editorContent.focus(); 
    document.execCommand(command, false, value);
    saveState(); 
}

function getSelectionText() {
    const selection = window.getSelection();
    return selection.toString();
}

function insertCodeBlock() {
    editorContent.focus();
    const currentSelection = getSelectionText();
    // Translated 'Votre code ici' to 'Your code here'
    const codeContent = currentSelection || 'Your code here'; 
    const codeBlock = `<pre><code>${escapeHtml(codeContent)}</code></pre>`;
    document.execCommand('insertHTML', false, codeBlock);
    saveState();
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

let isResizing = false;
let startX, startY, startWidth, startHeight, currentResizer;

editorContent.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        selectImage(e.target);
    } else if (activeImage && !e.target.classList.contains('resizer') && !e.target.closest('.resizer-wrapper') && !e.target.closest('figure')) {
        deselectImage();
    }
});

editorContent.addEventListener('dblclick', (e) => {
    if (e.target.tagName === 'IMG') {
        selectImage(e.target);
        openImageOptionsModal();
    }
});

editorContent.addEventListener('keydown', (e) => {
    if (activeImage && (e.key === 'Delete' || e.key === 'Backspace')) {
        const parentFigure = activeImage.closest('figure');
        const elementToRemove = parentFigure || activeImage;
        
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (range.commonAncestorContainer.contains(elementToRemove) || elementToRemove.contains(range.commonAncestorContainer)) {
                e.preventDefault();
                elementToRemove.remove();
                deselectImage();
                saveState();
            }
        }
    }
});

function selectImage(img) {
    deselectImage(); 
    
    activeImage = img;
    activeImage.classList.add('selected');
    
    let parentElementForResizers = activeImage;

    let figureParent = activeImage.closest('figure');
    if (figureParent) {
        figureParent.classList.add('selected');
        figureParent.style.outline = `2px solid ${getComputedStyle(document.documentElement).getPropertyValue('--primary-color')}`;
        parentElementForResizers = figureParent;
    } else {
        let wrapper = activeImage.parentElement;
        if (!wrapper || !wrapper.classList.contains('resizer-wrapper')) {
            wrapper = document.createElement('span');
            wrapper.className = 'resizer-wrapper';
            activeImage.parentNode.insertBefore(wrapper, activeImage);
            wrapper.appendChild(activeImage);
        }
        parentElementForResizers = wrapper;
    }

    parentElementForResizers.classList.remove('float-left', 'float-right');
    if (activeImage.classList.contains('float-left')) {
        parentElementForResizers.classList.add('float-left');
    } else if (activeImage.classList.contains('float-right')) {
        parentElementForResizers.classList.add('float-right');
    }

    Array.from(parentElementForResizers.querySelectorAll('.resizer')).forEach(r => r.remove());

    const resizers = ['nw', 'ne', 'sw', 'se'];
    resizers.forEach(direction => {
        const resizer = document.createElement('div');
        resizer.className = `resizer ${direction}`;
        parentElementForResizers.appendChild(resizer); 
        resizer.addEventListener('mousedown', initResize);
    });
}

function deselectImage() {
    if (activeImage) {
        activeImage.classList.remove('selected');
        let parentOfActiveImage = activeImage.parentElement;

        let elementWithResizers = null;
        if (activeImage.closest('figure') && activeImage.closest('figure').classList.contains('selected')) {
            elementWithResizers = activeImage.closest('figure');
        } else if (parentOfActiveImage && parentOfActiveImage.classList.contains('resizer-wrapper')) {
            elementWithResizers = parentOfActiveImage;
        }

        if (elementWithResizers) {
            Array.from(elementWithResizers.querySelectorAll('.resizer')).forEach(r => r.remove());
            elementWithResizers.classList.remove('selected', 'float-left', 'float-right');
            elementWithResizers.style.outline = 'none';

            if (elementWithResizers.classList.contains('resizer-wrapper')) {
                elementWithResizers.parentNode.insertBefore(activeImage, elementWithResizers);
                elementWithResizers.remove();
            }
        }
        activeImage = null;
    }
}

function initResize(e) {
    e.preventDefault();
    e.stopPropagation(); 
    isResizing = true;
    currentResizer = e.target;
    startX = e.clientX;
    startY = e.clientY;
    
    startWidth = activeImage.offsetWidth; 
    startHeight = activeImage.offsetHeight;

    document.addEventListener('mousemove', resizeImage);
    document.addEventListener('mouseup', stopResize);
}

function resizeImage(e) {
    if (!isResizing || !activeImage) return;
    window.getSelection().removeAllRanges();

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;

    switch (currentResizer.classList[1]) {
        case 'nw':
            newWidth = startWidth - dx;
            newHeight = startHeight - dy;
            break;
        case 'ne':
            newWidth = startWidth + dx;
            newHeight = startHeight - dy;
            break;
        case 'sw':
            newWidth = startWidth - dx;
            newHeight = startHeight + dy;
            break;
        case 'se':
            newWidth = startWidth + dx;
            newHeight = startHeight + dy;
            break;
    }

    newWidth = Math.max(50, newWidth); 
    newHeight = Math.max(50, newHeight);

    const currentAspectRatio = startWidth / startHeight;
    if (currentResizer.classList[1].includes('w') || currentResizer.classList[1].includes('e')) {
        newHeight = newWidth / currentAspectRatio;
    } else {
        newWidth = newHeight * currentAspectRatio;
    }
    
    activeImage.style.width = `${newWidth}px`;
    activeImage.style.height = `${newHeight}px`;

    let parentForResizers = activeImage.closest('figure') || activeImage.parentElement.closest('.resizer-wrapper');
    if (parentForResizers) {
         parentForResizers.style.width = `${newWidth}px`;
         parentForResizers.style.height = 'auto'; 
    }
}

function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', resizeImage);
    document.removeEventListener('mouseup', stopResize);
    
    if (activeImage) {
        activeImage.setAttribute('width', activeImage.offsetWidth);
        activeImage.setAttribute('height', activeImage.offsetHeight);
        
        activeImage.style.width = ''; 
        activeImage.style.height = ''; 
        
        let parentForResizers = activeImage.closest('figure') || activeImage.parentElement.closest('.resizer-wrapper');
        if (parentForResizers) {
            parentForResizers.style.width = '';
            parentForResizers.style.height = '';
        }

        saveState();
    }
}

function handleImageInsert(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const imgUrl = e.target.result;
        const img = new Image();
        img.src = imgUrl;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const maxWidth = 1200;
            const quality = 0.8;

            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

            const newImgElement = document.createElement('img');
            newImgElement.src = compressedDataUrl;
            // Translated 'Image insérée' to 'Inserted image'
            newImgElement.alt = "Inserted image"; 
            newImgElement.setAttribute('width', width);
            newImgElement.setAttribute('height', height);

            editorContent.focus();
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(newImgElement);
                range.setStartAfter(newImgElement);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                editorContent.appendChild(newImgElement);
            }
            selectImage(newImgElement);
            openImageOptionsModal();
            saveState(); 
        };
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

function openImageOptionsModal() {
    if (!activeImage) return;

    imageAltText.value = activeImage.alt || '';

    const parentFigure = activeImage.closest('figure');
    if (parentFigure && parentFigure.querySelector('figcaption')) {
        imageCaption.value = parentFigure.querySelector('figcaption').textContent;
    } else {
        imageCaption.value = '';
    }

    if (activeImage.classList.contains('float-left')) {
        imageAlignment.value = 'left';
    } else if (activeImage.classList.contains('float-right')) {
        imageAlignment.value = 'right';
    } else {
        imageAlignment.value = 'none';
    }

    imageOptionsModal.style.display = 'flex';
}

function closeImageOptionsModal() {
    imageOptionsModal.style.display = 'none';
}

function applyImageOptions() {
    if (!activeImage) {
        closeImageOptionsModal();
        return;
    }

    const altText = imageAltText.value.trim();
    const captionText = imageCaption.value.trim();
    const alignment = imageAlignment.value;

    activeImage.alt = altText;

    let currentFigure = activeImage.closest('figure');

    if (captionText) {
        if (!currentFigure) {
            currentFigure = document.createElement('figure');
            const imgWidth = activeImage.getAttribute('width') || activeImage.offsetWidth;
            const imgHeight = activeImage.getAttribute('height') || activeImage.offsetHeight;
            currentFigure.setAttribute('width', imgWidth);
            currentFigure.setAttribute('height', imgHeight);

            activeImage.parentNode.insertBefore(currentFigure, activeImage);
            currentFigure.appendChild(activeImage);
        }
        let figcaption = currentFigure.querySelector('figcaption');
        if (!figcaption) {
            figcaption = document.createElement('figcaption');
            currentFigure.appendChild(figcaption);
        }
        figcaption.textContent = captionText;
    } else {
        if (currentFigure && currentFigure.querySelector('figcaption')) {
            currentFigure.querySelector('figcaption').remove();
            let hasOtherNodes = false;
            for(let i = 0; i < currentFigure.children.length; i++) {
                if (currentFigure.children[i] !== activeImage && currentFigure.children[i].tagName !== 'FIGCAPTION') {
                    hasOtherNodes = true;
                    break;
                }
            }
            if (!hasOtherNodes) {
                currentFigure.parentNode.insertBefore(activeImage, currentFigure);
                currentFigure.remove();
                currentFigure = null;
            }
        }
    }

    activeImage.classList.remove('float-left', 'float-right');
    let oldParentForFloat = activeImage.closest('figure') || activeImage.parentElement.closest('.resizer-wrapper');
    if (oldParentForFloat) {
        oldParentForFloat.classList.remove('float-left', 'float-right');
    }

    if (currentFigure) {
        currentFigure.classList.remove('float-left', 'float-right');
        currentFigure.style.float = 'none';
        if (alignment === 'left') {
            currentFigure.classList.add('float-left');
        } else if (alignment === 'right') {
            currentFigure.classList.add('float-right');
        }
        if (alignment === 'none') {
            currentFigure.style.margin = '15px auto'; 
        } else {
            currentFigure.style.margin = '';
        }
    } else {
        activeImage.style.float = 'none';
        if (alignment === 'left') {
            activeImage.classList.add('float-left');
        } else if (alignment === 'right') {
            activeImage.classList.add('float-right');
        }
         if (alignment === 'none') {
            activeImage.style.margin = '15px auto'; 
        } else {
            activeImage.style.margin = '';
        }
    }
    
    deselectImage();
    selectImage(activeImage);

    saveState();
    closeImageOptionsModal();
}

function openLinkModal() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        savedRange = selection.getRangeAt(0); 
        let currentLink = savedRange.commonAncestorContainer.closest('a');
        if (currentLink) {
            linkText.value = currentLink.textContent;
            linkUrl.value = currentLink.href;
        } else {
            linkText.value = selection.toString(); 
            linkUrl.value = '';
        }
    } else {
        savedRange = null;
        linkText.value = '';
        linkUrl.value = '';
    }
    linkModal.style.display = 'flex';
}

function closeLinkModal() {
    linkModal.style.display = 'none';
    savedRange = null; 
    linkText.value = '';
    linkUrl.value = '';
}

function applyLink() {
    editorContent.focus();
    if (savedRange) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(savedRange);
    }

    const url = linkUrl.value.trim();
    let text = linkText.value.trim();

    if (!url) {
        // Translated 'Veuillez entrer une URL valide.' to 'Please enter a valid URL.'
        alert("Please enter a valid URL."); 
        return;
    }

    if (text === '') { 
        text = url;
    }
    
    if (window.getSelection().toString().length > 0) {
        document.execCommand('createLink', false, url);
        const selection = window.getSelection();
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        if (range) {
            const linkElement = range.commonAncestorContainer.closest('a');
            if (linkElement) {
                linkElement.textContent = text;
                linkElement.href = url;
            }
        }
    } else {
        const linkHTML = `<a href="${url}" target="_blank">${text}</a>`;
        document.execCommand('insertHTML', false, linkHTML);
    }
    saveState(); 
    closeLinkModal();
}

function openPreviewModal() {
    const htmlContent = editorContent.innerHTML;
    previewHtmlContent.value = cleanHtmlForPreview(htmlContent);
    previewModal.style.display = 'flex';
}

function closePreviewModal() {
    previewModal.style.display = 'none';
}

function copyHtmlToClipboard() {
    previewHtmlContent.select();
    document.execCommand('copy');
    // Translated 'HTML copié dans le presse-papiers !' to 'HTML copied to clipboard!'
    alert('HTML copied to clipboard!'); 
    window.getSelection().removeAllRanges();
}

function cleanHtmlForPreview(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    tempDiv.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'));
    tempDiv.querySelectorAll('[selected]').forEach(el => el.classList.remove('selected'));
    
    tempDiv.querySelectorAll('.resizer-wrapper').forEach(wrapper => {
        const img = wrapper.querySelector('img');
        if (img) {
            wrapper.parentNode.insertBefore(img, wrapper);
            wrapper.remove();
        }
    });
    tempDiv.querySelectorAll('.resizer').forEach(resizer => resizer.remove());
    
    tempDiv.querySelectorAll('img').forEach(img => {
        if (img.offsetWidth > 0 && img.offsetHeight > 0) {
            img.setAttribute('width', img.offsetWidth);
            img.setAttribute('height', img.offsetHeight);
        }
        img.style.width = ''; 
        img.style.height = ''; 
    });

    tempDiv.querySelectorAll('figure').forEach(figure => {
        const imgInside = figure.querySelector('img');
        if (imgInside) {
            figure.setAttribute('width', imgInside.getAttribute('width') || imgInside.offsetWidth);
            figure.setAttribute('height', (imgInside.getAttribute('height') || imgInside.offsetHeight) + (figure.querySelector('figcaption') ? figure.querySelector('figcaption').offsetHeight : 0));
        }
        figure.style.width = '';
        figure.style.height = '';
    });

    return tempDiv.innerHTML;
}

function updateWordCount() {
    const text = editorContent.textContent || editorContent.innerText; 
    const words = text.split(/\s+/).filter(word => word.length > 0).length;
    const characters = text.length;
    // Translated 'Mots : ${words} | Caractères : ${characters}' to 'Words: ${words} | Characters: ${characters}'
    wordCountDisplay.textContent = `Words: ${words} | Characters: ${characters}`; 
}

function updateHiddenContent() {
    articleContentHidden.value = cleanHtmlForPreview(editorContent.innerHTML);
}

articleForm.onsubmit = function() {
    deselectImage();
    updateHiddenContent();
    return true;
};

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
    }
});