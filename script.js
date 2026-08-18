// script.js
let scannedImages = [];
let readyPdfBlob = null; 
let currentPdfUrl = null; 
let videoStream = null; 
let currentEditIndex = null; 
let cropperInstance = null;
let originalSelectedFilename = ""; 

// PDF.js variables (Untuk Custom Mobile Viewer)
let pdfDoc = null;
let pageNum = 1;
const pdfCanvas = document.getElementById('pdfCanvas');
const pdfCtx = pdfCanvas.getContext('2d');
// Check if user is on a mobile device (where iframes usually fail to render PDFs)
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const galleryInput = document.getElementById('galleryInput');
const btnOpenCamera = document.getElementById('btnOpenCamera');
const autoEnhanceCheckbox = document.getElementById('autoEnhance');

const previewContainer = document.getElementById('previewContainer');
const settingsContainer = document.getElementById('settingsContainer');
const downloadContainer = document.getElementById('downloadContainer');

const pdfLayoutSelect = document.getElementById('pdfLayoutSelect');
const imageScaleSlider = document.getElementById('imageScaleSlider'); 
const imgScaleLabel = document.getElementById('imgScaleLabel'); 

const watermarkInput = document.getElementById('watermarkInput'); 
const watermarkStyleSelect = document.getElementById('watermarkStyleSelect'); 
const watermarkSizeSlider = document.getElementById('watermarkSize');
const watermarkPosXSlider = document.getElementById('watermarkPosX'); 
const watermarkPosYSlider = document.getElementById('watermarkPosY'); 
const watermarkColorInput = document.getElementById('watermarkColor'); 
const wmSizeLabel = document.getElementById('wmSizeLabel');
const wmPosXLabel = document.getElementById('wmPosXLabel'); 
const wmPosYLabel = document.getElementById('wmPosYLabel'); 

const imageList = document.getElementById('imageList');
const btnPdf = document.getElementById('btnPdf');
const loadingText = document.getElementById('loadingText');
const fileNameInput = document.getElementById('fileNameInput');

const emptyPreviewState = document.getElementById('emptyPreviewState');
const livePdfFrame = document.getElementById('livePdfFrame');
const mobilePdfViewer = document.getElementById('mobilePdfViewer'); // Mobile container
const liveIndicator = document.getElementById('liveIndicator');

// Mobile Nav Controls
const pdfNavControls = document.getElementById('pdfNavControls');
const btnPrevPage = document.getElementById('btnPrevPage');
const btnNextPage = document.getElementById('btnNextPage');
const currentPageNumSpan = document.getElementById('currentPageNum');
const totalPageNumSpan = document.getElementById('totalPageNum');

const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');

const liveCameraModal = document.getElementById('liveCameraModal');
const videoElement = document.getElementById('videoElement');
const btnCloseCamera = document.getElementById('btnCloseCamera');
const btnCaptureFrame = document.getElementById('btnCaptureFrame');

const editModal = document.getElementById('editModal');
const editPreviewImage = document.getElementById('editPreviewImage');
const sliderBrightness = document.getElementById('sliderBrightness');
const sliderContrast = document.getElementById('sliderContrast');
const sliderSaturation = document.getElementById('sliderSaturation');

const cropModal = document.getElementById('cropModal');
const cropImageTarget = document.getElementById('cropImageTarget');
const btnConfirmCrop = document.getElementById('btnConfirmCrop');
const cameraGuide = document.getElementById('cameraGuide');
const guideBtns = document.querySelectorAll('.guide-btn');

guideBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        guideBtns.forEach(b => { b.classList.remove('bg-yellow-500', 'text-black'); b.classList.add('bg-gray-700', 'text-white'); });
        e.target.classList.remove('bg-gray-700', 'text-white'); e.target.classList.add('bg-yellow-500', 'text-black');
        const type = e.target.dataset.type;
        if (type === 'a4') { cameraGuide.style.aspectRatio = '1 / 1.414'; cameraGuide.style.width = '85%'; } 
        else if (type === 'resit') { cameraGuide.style.aspectRatio = '1 / 2.5'; cameraGuide.style.width = '45%'; } 
        else if (type === 'id') { cameraGuide.style.aspectRatio = '1.58 / 1'; cameraGuide.style.width = '85%'; }
    });
});

pdfLayoutSelect.addEventListener('change', calculateActualPdfSize);
watermarkStyleSelect.addEventListener('change', calculateActualPdfSize);

imageScaleSlider.addEventListener('input', (e) => {
    imgScaleLabel.innerText = e.target.value + "%";
    clearTimeout(window.wmTimeout); window.wmTimeout = setTimeout(calculateActualPdfSize, 300);
});

watermarkInput.addEventListener('input', () => { 
    clearTimeout(window.wmTimeout); window.wmTimeout = setTimeout(calculateActualPdfSize, 500); 
});
watermarkColorInput.addEventListener('input', () => { 
    clearTimeout(window.wmTimeout); window.wmTimeout = setTimeout(calculateActualPdfSize, 300); 
});

watermarkSizeSlider.addEventListener('input', (e) => {
    wmSizeLabel.innerText = e.target.value;
    clearTimeout(window.wmTimeout); window.wmTimeout = setTimeout(calculateActualPdfSize, 300);
});

watermarkPosXSlider.addEventListener('input', (e) => {
    wmPosXLabel.innerText = e.target.value;
    clearTimeout(window.wmTimeout); window.wmTimeout = setTimeout(calculateActualPdfSize, 300);
});

watermarkPosYSlider.addEventListener('input', (e) => {
    wmPosYLabel.innerText = e.target.value;
    clearTimeout(window.wmTimeout); window.wmTimeout = setTimeout(calculateActualPdfSize, 300);
});

function formatBytes(bytes) {
    if (!+bytes) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 100, g: 100, b: 100 };
}

async function enhanceImage(file) {
    return new Promise((resolve) => {
        const img = new Image(); const url = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.filter = 'grayscale(100%) contrast(160%) brightness(110%)';
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => { URL.revokeObjectURL(url); resolve(new File([blob], file.name, { type: 'image/jpeg' })); }, 'image/jpeg', 0.7); 
        };
        img.src = url;
    });
}

async function processImageFile(file) {
    loadingText.classList.remove('hidden');
    try {
        let fileToProcess = autoEnhanceCheckbox.checked ? await enhanceImage(file) : file;
        const compressedFile = await imageCompression(fileToProcess, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
        const baseUrl = URL.createObjectURL(compressedFile);
        const imgElement = new Image(); imgElement.src = baseUrl;
        await new Promise((resolve) => { imgElement.onload = resolve; });

        scannedImages.push({ 
            baseFile: compressedFile, baseUrl: baseUrl, file: compressedFile, url: baseUrl,                             
            fileName: file.name || `Gambar_${Date.now()}.jpg`, rawOriginalSize: file.size, rawCompressedSize: compressedFile.size,     
            originalSize: formatBytes(file.size), compressedSize: formatBytes(compressedFile.size), 
            imgWidth: imgElement.width, imgHeight: imgElement.height, filters: { brightness: 100, contrast: 100, saturation: 100 } 
        });
        renderImages();
    } catch (error) { alert("Ralat"); console.error(error); } 
    finally { loadingText.classList.add('hidden'); }
}

galleryInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        originalSelectedFilename = file.name; cropImageTarget.src = URL.createObjectURL(file); cropModal.classList.remove('hidden');
        if (cropperInstance) cropperInstance.destroy();
        setTimeout(() => { cropperInstance = new Cropper(cropImageTarget, { viewMode: 2, autoCropArea: 0.9, background: false }); }, 100); 
        e.target.value = ''; 
    }
});

btnConfirmCrop.addEventListener('click', () => {
    if (!cropperInstance) return;
    cropperInstance.getCroppedCanvas({ maxWidth: 4096, maxHeight: 4096 }).toBlob((blob) => {
        processImageFile(new File([blob], originalSelectedFilename || `Crop_${Date.now()}.jpg`, { type: 'image/jpeg' }));
        closeCropModal();
    }, 'image/jpeg', 0.95);
});
window.closeCropModal = function() { cropModal.classList.add('hidden'); if (cropperInstance) cropperInstance.destroy(); cropImageTarget.src = ''; };

btnOpenCamera.addEventListener('click', async () => {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 }, advanced: [{ focusMode: "continuous" }] } });
        videoElement.srcObject = videoStream; liveCameraModal.classList.remove('hidden');
    } catch (err) {
        try {
            videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            videoElement.srcObject = videoStream; liveCameraModal.classList.remove('hidden');
        } catch (fbErr) { alert("Gagal mengakses kamera."); }
    }
});

function stopCamera() { if (videoStream) { videoStream.getTracks().forEach(t => t.stop()); videoStream = null; } liveCameraModal.classList.add('hidden'); }
btnCloseCamera.addEventListener('click', stopCamera);

btnCaptureFrame.addEventListener('click', () => {
    const vRect = videoElement.getBoundingClientRect(); const gRect = cameraGuide.getBoundingClientRect();
    const scale = Math.max(vRect.width / videoElement.videoWidth, vRect.height / videoElement.videoHeight);
    const cropX = (gRect.left - vRect.left + (videoElement.videoWidth * scale - vRect.width) / 2) / scale;
    const cropY = (gRect.top - vRect.top + (videoElement.videoHeight * scale - vRect.height) / 2) / scale;
    const cWidth = gRect.width / scale; const cHeight = gRect.height / scale;
    const canvas = document.createElement('canvas'); canvas.width = cWidth; canvas.height = cHeight;
    canvas.getContext('2d').drawImage(videoElement, cropX, cropY, cWidth, cHeight, 0, 0, cWidth, cHeight);
    canvas.toBlob((blob) => { if (blob) { processImageFile(new File([blob], `Kamera_${Date.now()}.jpg`, { type: "image/jpeg" })); stopCamera(); } }, 'image/jpeg', 1.0); 
});

// TOAST NOTIFICATION FUNCTION
function showToast() {
    const toast = document.getElementById('toastNotification');
    toast.classList.remove('-translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('-translate-y-24', 'opacity-0');
    }, 3500); // Hilang selepas 3.5 saat
}

function renderImages() {
    if (scannedImages.length > 0) { 
        previewContainer.classList.remove('hidden'); 
        settingsContainer.classList.remove('hidden'); 
        downloadContainer.classList.remove('hidden'); 
        document.getElementById('pageCountBadge').innerText = `${scannedImages.length} Keping`;
    } 
    else { 
        previewContainer.classList.add('hidden'); 
        settingsContainer.classList.add('hidden'); 
        downloadContainer.classList.add('hidden'); 
        readyPdfBlob = null; calculateActualPdfSize(); return; 
    }
    
    imageList.innerHTML = ''; 
    let totalOrig = 0; let totalComp = 0;

    scannedImages.forEach((img, index) => {
        totalOrig += img.rawOriginalSize; totalComp += img.rawCompressedSize;
        const imgDiv = document.createElement('div');
        imgDiv.className = 'relative border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col bg-white group/card hover:border-blue-300 transition-colors';
        imgDiv.innerHTML = `
            <div class="relative group cursor-pointer" onclick="openImageModal('${img.url}')">
                <img src="${img.url}" class="w-full h-28 object-cover transition duration-300 group-hover:opacity-70 group-hover:scale-105">
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
                    <span class="bg-black bg-opacity-70 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">🔍 Lihat Besar</span>
                </div>
                <button onclick="event.stopPropagation(); removeImage(${index})" class="absolute top-1 right-1 bg-white/90 text-red-500 hover:bg-red-500 hover:text-white transition rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-sm z-10 font-bold backdrop-blur-md">✕</button>
                <button onclick="event.stopPropagation(); openEditModal(${index})" class="absolute top-1 right-9 bg-white/90 text-blue-500 hover:bg-blue-500 hover:text-white transition rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-sm z-10 backdrop-blur-md">🎨</button>
                <div class="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md z-10 font-bold backdrop-blur-sm shadow">${index + 1}</div>
            </div>
            <div class="p-2 text-xs text-gray-700 flex flex-col gap-1 border-t bg-gray-50">
                <div class="font-medium text-gray-900 truncate mb-1 border-b pb-1" title="${img.fileName}">${img.fileName}</div>
                <div class="flex justify-between items-center text-[10px]"><span>Kini:</span> <span class="font-bold text-green-600">${img.compressedSize}</span></div>
            </div>
        `;
        imageList.appendChild(imgDiv);
    });

    document.getElementById('totalOriginal').innerText = formatBytes(totalOrig);
    document.getElementById('totalCompressed').innerText = formatBytes(totalComp);
    calculateActualPdfSize();
}

window.removeImage = function(index) { scannedImages.splice(index, 1); renderImages(); };

window.openEditModal = function(index) {
    currentEditIndex = index; const imgData = scannedImages[index];
    sliderBrightness.value = imgData.filters.brightness; sliderContrast.value = imgData.filters.contrast; sliderSaturation.value = imgData.filters.saturation;
    document.getElementById('valBrightnessLabel').innerText = sliderBrightness.value + '%';
    document.getElementById('valContrastLabel').innerText = sliderContrast.value + '%';
    document.getElementById('valSaturationLabel').innerText = sliderSaturation.value + '%';
    editPreviewImage.src = imgData.baseUrl;
    editPreviewImage.style.filter = `brightness(${sliderBrightness.value}%) contrast(${sliderContrast.value}%) saturate(${sliderSaturation.value}%)`;
    editModal.classList.remove('hidden');
};
window.closeEditModal = function() { editModal.classList.add('hidden'); };
[sliderBrightness, sliderContrast, sliderSaturation].forEach(s => s.addEventListener('input', (e) => {
    if(e.target.id === 'sliderBrightness') document.getElementById('valBrightnessLabel').innerText = e.target.value + '%';
    if(e.target.id === 'sliderContrast') document.getElementById('valContrastLabel').innerText = e.target.value + '%';
    if(e.target.id === 'sliderSaturation') document.getElementById('valSaturationLabel').innerText = e.target.value + '%';
    editPreviewImage.style.filter = `brightness(${sliderBrightness.value}%) contrast(${sliderContrast.value}%) saturate(${sliderSaturation.value}%)`;
}));
window.resetEdits = function() { sliderBrightness.value = 100; sliderContrast.value = 100; sliderSaturation.value = 100; sliderBrightness.dispatchEvent(new Event('input')); };
window.saveEdits = async function() {
    if (currentEditIndex === null) return;
    const imgData = scannedImages[currentEditIndex];
    imgData.filters = { brightness: sliderBrightness.value, contrast: sliderContrast.value, saturation: sliderSaturation.value };
    editModal.classList.add('hidden');
    const img = new Image();
    img.onload = async () => {
        const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.filter = `brightness(${sliderBrightness.value}%) contrast(${sliderContrast.value}%) saturate(${sliderSaturation.value}%)`;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(async (blob) => {
            const finalComp = await imageCompression(new File([blob], imgData.fileName, { type: 'image/jpeg' }), { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
            imgData.file = finalComp; imgData.url = URL.createObjectURL(finalComp); renderImages(); 
        }, 'image/jpeg', 0.85); 
    };
    img.src = imgData.baseUrl; 
};

window.openImageModal = function(url) { modalImage.src = url; imageModal.classList.remove('hidden'); };
window.closeImageModal = function() { imageModal.classList.add('hidden'); setTimeout(() => { modalImage.src = ''; }, 300); };
imageModal.addEventListener('click', (e) => { if (e.target === imageModal) closeImageModal(); });

// --- RENDER PDF.js UNTUK MOBILE ---
const renderPdfPage = async (num) => {
    if(!pdfDoc) return;
    pdfNavControls.classList.remove('hidden');
    
    const page = await pdfDoc.getPage(num);
    const viewport = page.getViewport({ scale: 1.5 }); // Besarkan sikit supaya jelas di fon
    
    // Fit to container width
    const containerWidth = mobilePdfViewer.clientWidth - 16; 
    const scale = containerWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale: scale * 1.5 });

    pdfCanvas.height = scaledViewport.height;
    pdfCanvas.width = scaledViewport.width;

    const renderContext = {
        canvasContext: pdfCtx,
        viewport: scaledViewport
    };
    
    await page.render(renderContext).promise;
    
    currentPageNumSpan.innerText = num;
    btnPrevPage.disabled = num <= 1;
    btnNextPage.disabled = num >= pdfDoc.numPages;
};

btnPrevPage.addEventListener('click', () => {
    if (pageNum <= 1) return;
    pageNum--;
    renderPdfPage(pageNum);
});

btnNextPage.addEventListener('click', () => {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    renderPdfPage(pageNum);
});

function calculateActualPdfSize() {
    if (scannedImages.length === 0) {
        emptyPreviewState.classList.remove('hidden');
        livePdfFrame.classList.add('hidden');
        mobilePdfViewer.classList.add('hidden');
        pdfNavControls.classList.add('hidden');
        liveIndicator.classList.add('hidden');
        document.getElementById('finalPdfSize').innerText = "0 KB";
        btnPdf.disabled = true; btnPdf.classList.add('opacity-70', 'cursor-not-allowed');
        return;
    }

    document.getElementById('finalPdfSize').innerText = "Kira...";
    btnPdf.disabled = true; btnPdf.classList.add('opacity-70', 'cursor-not-allowed');
    btnPdf.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Memproses...`;
    
    liveIndicator.classList.remove('hidden');
    liveIndicator.innerHTML = `<span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span> Mengemas kini...`;
    liveIndicator.className = "text-[10px] bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full font-bold flex items-center gap-1 border border-yellow-200";

    setTimeout(() => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        
        const pageWidth = pdf.internal.pageSize.getWidth(); 
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15; const spacing = 10; 

        const layoutType = parseInt(pdfLayoutSelect.value);
        let cols = 1, rows = 1;
        if (layoutType === 2) { cols = 1; rows = 2; } else if (layoutType === 4) { cols = 2; rows = 2; } else if (layoutType === 6) { cols = 2; rows = 3; }

        const imgScale = parseInt(imageScaleSlider.value) / 100;
        const watermarkText = watermarkInput.value.trim();
        const watermarkStyle = watermarkStyleSelect.value; 
        const userFontSizePt = parseInt(watermarkSizeSlider.value); 
        const userPosXVal = parseInt(watermarkPosXSlider.value); 
        const userPosYVal = parseInt(watermarkPosYSlider.value); 
        const wmColorRgb = hexToRgb(watermarkColorInput.value);

        for (let i = 0; i < scannedImages.length; i++) {
            const positionOnPage = i % (cols * rows);
            if (positionOnPage === 0 && i > 0) pdf.addPage();

            const colIndex = positionOnPage % cols; const rowIndex = Math.floor(positionOnPage / cols);
            const cellWidth = (pageWidth - (margin * 2) - (spacing * (cols - 1))) / cols;
            const cellHeight = (pageHeight - (margin * 2) - (spacing * (rows - 1))) / rows;
            const cellX = margin + (colIndex * (cellWidth + spacing));
            const cellY = margin + (rowIndex * (cellHeight + spacing));

            const imgWidth = scannedImages[i].imgWidth; const imgHeight = scannedImages[i].imgHeight;
            
            const ratio = Math.min(cellWidth / imgWidth, cellHeight / imgHeight);
            const newWidth = imgWidth * ratio * imgScale; 
            const newHeight = imgHeight * ratio * imgScale;
            
            const finalX = cellX + (cellWidth - newWidth) / 2;
            const finalY = cellY + (cellHeight - newHeight) / 2;

            pdf.addImage(scannedImages[i].url, "JPEG", finalX, finalY, newWidth, newHeight);

            if (watermarkText !== "") {
                try { pdf.setGState(new window.jspdf.GState({opacity: 0.4})); } catch(e) {}
                pdf.setTextColor(wmColorRgb.r, wmColorRgb.g, wmColorRgb.b); 
                pdf.setDrawColor(wmColorRgb.r, wmColorRgb.g, wmColorRgb.b); 
                pdf.setFontSize(userFontSizePt);
                const ptToMm = 25.4 / 72; const fontSizeMm = userFontSizePt * ptToMm;
                const textWMm = pdf.getTextWidth(watermarkText);
                const linePaddingMm = Math.max(10, fontSizeMm * 1.5); 
                const lineLenMm = (textWMm / 2) + linePaddingMm;
                const lineOffsetMm = fontSizeMm * 0.8; 
                pdf.setLineWidth(Math.max(0.3, fontSizeMm * 0.05));

                let cx = finalX + newWidth / 2; let cy = finalY + newHeight / 2; let angleDeg = 45; 
                if (watermarkStyle === 'top-left') { cx = finalX + (newWidth * 0.15); cy = finalY + (newHeight * 0.15); angleDeg = 45; } 
                else if (watermarkStyle === 'top-right') { cx = finalX + newWidth - (newWidth * 0.15); cy = finalY + (newHeight * 0.15); angleDeg = -45; }

                const offsetX_mm = (userPosXVal / 100) * (newWidth / 2);
                const offsetY_mm = (userPosYVal / 100) * (newHeight / 2);

                const drawWM = (xCenter, yCenter, ang) => {
                    const rad = ang * Math.PI / 180; const dx = Math.cos(rad); const dy = -Math.sin(rad); const nx = Math.sin(rad); const ny = Math.cos(rad);
                    const textStartX = xCenter - (textWMm / 2) * dx + (fontSizeMm * 0.3) * nx;
                    const textStartY = yCenter - (textWMm / 2) * dy + (fontSizeMm * 0.3) * ny;
                    pdf.text(watermarkText, textStartX, textStartY, { angle: ang });

                    const drawLine = (yOffMm) => {
                        pdf.line(xCenter - lineLenMm * dx + yOffMm * nx, yCenter - lineLenMm * dy + yOffMm * ny, 
                                 xCenter + lineLenMm * dx + yOffMm * nx, yCenter + lineLenMm * dy + yOffMm * ny);
                    };
                    drawLine(-lineOffsetMm); drawLine(lineOffsetMm);  
                };

                if (watermarkStyle === 'tiled') {
                    const stepX = (lineLenMm * 2) + 20; const stepY = fontSizeMm * 5;
                    for(let tx = finalX - newWidth; tx < finalX + newWidth*2; tx += stepX) {
                        for(let ty = finalY - newHeight; ty < finalY + newHeight*2; ty += stepY) { 
                            drawWM(tx + offsetX_mm, ty + offsetY_mm, 45); 
                        }
                    }
                } else { 
                    drawWM(cx + offsetX_mm, cy + offsetY_mm, angleDeg); 
                }
                try { pdf.setGState(new window.jspdf.GState({opacity: 1.0})); } catch(e) {}
            }
        }
        
        readyPdfBlob = pdf.output('blob');
        if (currentPdfUrl) URL.revokeObjectURL(currentPdfUrl); 
        currentPdfUrl = URL.createObjectURL(readyPdfBlob);
        
        // PAPARAN MENGIKUT DEVICE
        emptyPreviewState.classList.add('hidden');
        
        if (isMobile) {
            // Gunakan PDF.js Canvas untuk Mobile
            livePdfFrame.classList.add('hidden');
            mobilePdfViewer.classList.remove('hidden');
            
            // Convert Blob URL ke ArrayBuffer untuk PDF.js
            const reader = new FileReader();
            reader.onload = function(e) {
                const pdfData = new Uint8Array(e.target.result);
                pdfjsLib.getDocument({data: pdfData}).promise.then(doc => {
                    pdfDoc = doc;
                    totalPageNumSpan.innerText = doc.numPages;
                    // Pastikan pageNum tak lebih dari total page lepas edit susunan
                    if (pageNum > doc.numPages) pageNum = doc.numPages; 
                    renderPdfPage(pageNum);
                });
            };
            reader.readAsArrayBuffer(readyPdfBlob);
            
        } else {
            // Gunakan Iframe native untuk Desktop/Laptop (lebih laju & boleh print)
            mobilePdfViewer.classList.add('hidden');
            pdfNavControls.classList.add('hidden'); // Sembunyikan navigasi manual di desktop
            livePdfFrame.classList.remove('hidden');
            livePdfFrame.src = currentPdfUrl;
        }
        
        document.getElementById('finalPdfSize').innerText = formatBytes(readyPdfBlob.size);
        
        btnPdf.disabled = false; 
        btnPdf.classList.remove('opacity-70', 'cursor-not-allowed');
        btnPdf.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Muat Turun PDF`;
        
        liveIndicator.innerHTML = `<span class="w-2 h-2 rounded-full bg-green-500"></span> Sedia`;
        liveIndicator.className = "text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-full font-bold flex items-center gap-1 border border-green-200 transition-colors duration-500";
        
    }, 150);
}

btnPdf.addEventListener('click', () => {
    if (!currentPdfUrl) return;
    
    let customFileName = fileNameInput.value.trim() || "Dokumen_Scan";
    if (!customFileName.toLowerCase().endsWith('.pdf')) customFileName += ".pdf";
    
    const a = document.createElement('a'); 
    a.href = currentPdfUrl; 
    a.download = customFileName;
    document.body.appendChild(a); 
    a.click(); 
    document.body.removeChild(a);
    
    // Panggil fungsi pop-up berjaya di sini
    showToast();
});


