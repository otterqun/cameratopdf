#index.html 

<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DocScanner Pro Live</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.1/dist/browser-image-compression.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    
    <!-- Panggil Library PDF.js untuk custom render di Mobile -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
</head>
<body class="bg-gray-100 min-h-screen p-2 md:p-6 font-sans">
    <div class="max-w-[1400px] mx-auto">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6 flex items-center justify-center gap-3">
            <span class="text-3xl">📸</span>
            <h1 class="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">Scanner Mudah</h1>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
            
            <!-- KIRI: KAWALAN -->
            <div class="lg:col-span-5 flex flex-col gap-5">
                
                <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Langkah 1: Masukkan Gambar</h3>
                    <div class="grid grid-cols-2 gap-3 mb-3">
                        <button id="btnOpenCamera" class="w-full bg-blue-600 text-white text-center font-bold py-3.5 rounded-xl hover:bg-blue-700 shadow-sm transition flex items-center justify-center gap-2 active:scale-95">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>
                            Kamera
                        </button>
                        <label class="block w-full bg-indigo-500 text-white text-center font-bold py-3.5 rounded-xl cursor-pointer hover:bg-indigo-600 shadow-sm transition flex items-center justify-center gap-2 active:scale-95">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                            Galeri
                            <input type="file" accept="image/*" id="galleryInput" class="hidden">
                        </label>
                    </div>
                    <div class="flex items-center bg-gray-50 p-2.5 rounded-lg border border-gray-200 cursor-pointer" onclick="document.getElementById('autoEnhance').click()">
                        <input type="checkbox" id="autoEnhance" class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" checked>
                        <label class="ml-2 text-sm font-semibold text-gray-700 cursor-pointer select-none">✨ Auto-Enhance Teks (B&W)</label>
                    </div>
                </div>

                <div id="previewContainer" class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hidden">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Langkah 2: Semak Muka Surat</h3>
                        <span id="pageCountBadge" class="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">0 Helai</span>
                    </div>
                    
                    <div id="imageList" class="grid grid-cols-2 gap-3 mb-4 max-h-56 overflow-y-auto pr-1 custom-scrollbar"></div>

                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-3.5 rounded-xl text-sm shadow-inner flex flex-col gap-2">
                        <div class="flex justify-between items-center text-gray-500 text-xs font-medium">
                            <span>Saiz Asal: <span id="totalOriginal">0 KB</span></span>
                            <span>Selesai Kompres: <span id="totalCompressed" class="text-green-600 font-bold">0 KB</span></span>
                        </div>
                        <div class="w-full bg-blue-200 h-px"></div>
                        <div class="flex justify-between items-center">
                            <span class="font-extrabold text-blue-900">Saiz Akhir PDF:</span>
                            <span id="finalPdfSize" class="font-black text-blue-700 bg-white px-3 py-1 rounded-lg border border-blue-200 shadow-sm">Mengira...</span>
                        </div>
                    </div>
                </div>

                <div id="settingsContainer" class="hidden">
                    <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Langkah 3: Tetapan Tambahan (Pilihan)</h3>
                    
                    <details class="mb-3 bg-white border border-gray-200 rounded-2xl group shadow-sm overflow-hidden">
                        <summary class="font-bold text-gray-700 p-4 cursor-pointer select-none flex justify-between items-center hover:bg-gray-50 transition">
                            <div class="flex items-center gap-2"><span>📄</span> Susunan & Saiz Gambar</div>
                            <span class="group-open:rotate-180 transition-transform duration-300 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                            </span>
                        </summary>
                        <div class="p-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 mb-1">Pilihan Susunan (Collage)</label>
                                <select id="pdfLayoutSelect" class="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-medium">
                                    <option value="1">1 Gambar - 1 Muka Surat</option>
                                    <option value="2">2 Gambar - 1 Muka Surat (Sesuai IC)</option>
                                    <option value="4">4 Gambar - 1 Muka Surat (Grid 2x2)</option>
                                    <option value="6">6 Gambar - 1 Muka Surat (Grid 2x3)</option>
                                </select>
                            </div>
                            <div>
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-xs font-bold text-gray-500">Skala Saiz Gambar</span>
                                    <span id="imgScaleLabel" class="text-xs font-bold text-blue-600 bg-blue-100 px-2 rounded">100%</span>
                                </div>
                                <input type="range" id="imageScaleSlider" min="20" max="100" value="100" class="w-full accent-blue-600">
                                <p class="text-[10px] text-gray-400 mt-1 leading-tight">Guna ini jika gambar IC nampak terlalu besar dalam kertas A4.</p>
                            </div>
                        </div>
                    </details>

                    <details class="bg-white border border-gray-200 rounded-2xl group shadow-sm overflow-hidden">
                        <summary class="font-bold text-gray-700 p-4 cursor-pointer select-none flex justify-between items-center hover:bg-gray-50 transition">
                            <div class="flex items-center gap-2"><span>🔒</span> Cop Air (Watermark)</div>
                            <span class="group-open:rotate-180 transition-transform duration-300 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                            </span>
                        </summary>
                        <div class="p-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-4">
                            
                            <div class="flex gap-2">
                                <div class="flex-1">
                                    <label class="block text-xs font-bold text-gray-500 mb-1">Teks Watermark</label>
                                    <input type="text" id="watermarkInput" placeholder="Cth: URUSAN BANK" class="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 mb-1">Warna</label>
                                    <input type="color" id="watermarkColor" value="#646464" class="h-[38px] w-12 cursor-pointer rounded-lg border border-gray-300 bg-white p-0.5">
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-gray-500 mb-1">Gaya & Posisi Auto</label>
                                <select id="watermarkStyleSelect" class="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                                    <option value="top-left">Penjuru Kiri Atas (Sesuai IC)</option>
                                    <option value="center">Tengah Bersilang</option>
                                    <option value="top-right">Penjuru Kanan Atas</option>
                                    <option value="tiled">Penuh Berulang (Pattern)</option>
                                </select>
                            </div>

                            <details class="group/sub">
                                <summary class="text-xs font-bold text-blue-600 cursor-pointer select-none hover:underline">⚙️ Tetapan Halus (Saiz & Anjakan)</summary>
                                <div class="pt-3 pb-1 flex flex-col gap-3">
                                    <div>
                                        <div class="flex justify-between items-center mb-1"><span class="text-[10px] font-bold text-gray-500">Saiz Tulisan</span><span id="wmSizeLabel" class="text-[10px] font-bold text-gray-700">35</span></div>
                                        <input type="range" id="watermarkSize" min="15" max="90" value="35" class="w-full accent-blue-600">
                                    </div>
                                    <div>
                                        <div class="flex justify-between items-center mb-1"><span class="text-[10px] font-bold text-gray-500">Anjakan Kiri/Kanan (X)</span><span id="wmPosXLabel" class="text-[10px] font-bold text-gray-700">0</span></div>
                                        <input type="range" id="watermarkPosX" min="-100" max="100" value="0" class="w-full accent-blue-600">
                                    </div>
                                    <div>
                                        <div class="flex justify-between items-center mb-1"><span class="text-[10px] font-bold text-gray-500">Anjakan Atas/Bawah (Y)</span><span id="wmPosYLabel" class="text-[10px] font-bold text-gray-700">0</span></div>
                                        <input type="range" id="watermarkPosY" min="-100" max="100" value="0" class="w-full accent-blue-600">
                                    </div>
                                </div>
                            </details>

                        </div>
                    </details>
                </div>

                <!-- LANGKAH 4: MUAT TURUN -->
                <div id="downloadContainer" class="hidden bg-white p-5 rounded-2xl shadow-lg border border-green-100 sticky bottom-4 z-40 lg:relative lg:bottom-auto">
                    <h3 class="text-xs font-bold text-green-500 uppercase tracking-wider mb-2">Langkah 4: Simpan PDF</h3>
                    <div class="flex gap-2">
                        <input type="text" id="fileNameInput" placeholder="Nama Fail (Cth: Dokumen_Penting)" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 font-medium text-sm transition">
                    </div>
                    <button id="btnPdf" class="mt-3 w-full bg-green-600 text-white font-extrabold py-4 rounded-xl hover:bg-green-700 shadow-md transition flex items-center justify-center gap-2 opacity-70" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Muat Turun PDF
                    </button>
                </div>

                <p id="loadingText" class="text-center text-blue-500 font-semibold hidden mt-2">Memproses...</p>
            </div>

            <!-- KANAN: LIVE PREVIEW DUAL-MODE -->
            <div class="lg:col-span-7">
                <div class="bg-white p-4 rounded-2xl shadow-lg border border-gray-200 lg:sticky lg:top-6 flex flex-col h-[70vh] lg:h-[calc(100vh-3rem)]">
                    <div class="flex justify-between items-center mb-3 border-b pb-3 border-gray-100">
                        <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <span class="bg-gray-100 p-1.5 rounded-lg text-xl">📄</span> Paparan Langsung
                        </h2>
                        
                        <div class="flex gap-2 items-center">
                            <!-- Navigasi Muka Surat (Khas untuk Custom Viewer) -->
                            <div id="pdfNavControls" class="hidden flex items-center gap-2 mr-2 bg-gray-100 rounded-lg px-2 py-1">
                                <button id="btnPrevPage" class="text-gray-600 hover:text-blue-600 font-bold px-2 disabled:opacity-30 disabled:hover:text-gray-600">&lt;</button>
                                <span class="text-xs font-bold text-gray-700"><span id="currentPageNum">1</span> / <span id="totalPageNum">1</span></span>
                                <button id="btnNextPage" class="text-gray-600 hover:text-blue-600 font-bold px-2 disabled:opacity-30 disabled:hover:text-gray-600">&gt;</button>
                            </div>
                            
                            <span id="liveIndicator" class="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold hidden transition-colors duration-300 flex items-center gap-1">
                                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Sedia
                            </span>
                        </div>
                    </div>
                    
                    <div id="emptyPreviewState" class="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 m-2">
                        <div class="bg-white p-4 rounded-full shadow-sm mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <p class="font-semibold text-gray-500 text-center px-4">Sila masukkan gambar di Langkah 1<br>untuk melihat paparan PDF di sini.</p>
                    </div>
                    
                    <!-- DUAL MODE PREVIEW -->
                    <!-- 1. Iframe Native (Untuk Desktop) -->
                    <iframe id="livePdfFrame" class="w-full flex-1 rounded-xl border border-gray-200 hidden bg-gray-200 shadow-inner"></iframe>
                    
                    <!-- 2. Custom Canvas Viewer (Khas untuk Mobile Android/iOS yg sekat Iframe) -->
                    <div id="mobilePdfViewer" class="w-full flex-1 overflow-y-auto hidden bg-gray-200 rounded-xl border border-gray-200 flex flex-col items-center justify-start p-2 shadow-inner custom-scrollbar relative">
                        <canvas id="pdfCanvas" class="shadow-md bg-white max-w-full h-auto"></canvas>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- SEMUA MODAL -->
    <div id="cropModal" class="fixed inset-0 z-[70] hidden bg-black bg-opacity-90 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
        <div class="w-full max-w-lg bg-gray-900 rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-gray-700" style="height: 85vh;">
            <div class="p-4 bg-gray-800 text-white flex justify-between items-center border-b border-gray-700">
                <h3 class="font-bold">✂️ Potong Gambar</h3>
                <button onclick="closeCropModal()" class="text-gray-400 hover:text-red-500 font-bold text-xl bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition">✕</button>
            </div>
            <div class="flex-1 bg-black overflow-hidden flex items-center justify-center relative">
                <img id="cropImageTarget" src="" class="max-w-full max-h-full block">
            </div>
            <div class="p-4 bg-gray-800 flex gap-3 border-t border-gray-700">
                <button onclick="closeCropModal()" class="px-4 py-3 bg-gray-700 text-white rounded-xl font-bold w-1/3 hover:bg-gray-600 transition">Batal</button>
                <button id="btnConfirmCrop" class="px-4 py-3 bg-blue-600 text-white rounded-xl font-bold w-2/3 hover:bg-blue-700 transition">Sahkan & Proses</button>
            </div>
        </div>
    </div>

    <div id="liveCameraModal" class="fixed inset-0 z-50 hidden bg-black flex flex-col items-center justify-center">
        <!-- Kamera interface sama seperti sebelumnya -->
        <div class="relative w-full h-full max-w-md bg-black overflow-hidden flex flex-col justify-between">
            <div class="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black to-transparent z-10 flex justify-center gap-2">
                <button class="guide-btn bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold shadow transition" data-type="a4">A4</button>
                <button class="guide-btn bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow transition" data-type="resit">Resit</button>
                <button class="guide-btn bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow transition" data-type="id">Kad IC</button>
            </div>
            <div class="relative flex-1 flex items-center justify-center overflow-hidden">
                <video id="videoElement" class="absolute w-full h-full object-cover" autoplay playsinline></video>
                <div id="cameraGuide" class="relative border-2 border-yellow-400 border-dashed rounded bg-yellow-400 bg-opacity-10 transition-all duration-300 ease-in-out pointer-events-none" style="aspect-ratio: 1 / 1.414; width: 85%;">
                    <div class="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-yellow-400"></div>
                    <div class="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-yellow-400"></div>
                    <div class="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-yellow-400"></div>
                    <div class="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-yellow-400"></div>
                </div>
            </div>
            <div class="p-6 pb-10 flex gap-4 bg-gradient-to-t from-black to-transparent w-full justify-center z-10">
                <button id="btnCloseCamera" class="px-6 py-4 bg-red-600 text-white rounded-full font-bold shadow-lg hover:bg-red-700">Batal</button>
                <button id="btnCaptureFrame" class="px-8 py-4 bg-white text-black rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.7)] hover:bg-gray-200">📸 Tangkap</button>
            </div>
        </div>
    </div>

    <div id="editModal" class="fixed inset-0 z-[60] hidden bg-black bg-opacity-80 flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div class="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <h3 class="font-bold text-gray-800">🎨 Suntingan Warna</h3>
                <button onclick="closeEditModal()" class="text-gray-400 hover:text-red-500 font-bold text-xl bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center transition">✕</button>
            </div>
            <div class="p-5 flex-1 overflow-y-auto">
                <div class="bg-gray-900 rounded-xl h-48 mb-6 flex items-center justify-center overflow-hidden relative shadow-inner">
                    <img id="editPreviewImage" class="max-h-full object-contain transition-all duration-75" src="">
                </div>
                <div class="space-y-6 text-sm font-medium text-gray-700">
                    <div>
                        <div class="flex justify-between mb-2"><label>Kecerahan</label><span id="valBrightnessLabel" class="text-blue-600 font-bold bg-blue-50 px-2 rounded">100%</span></div>
                        <input type="range" id="sliderBrightness" min="50" max="200" value="100" class="w-full accent-blue-600">
                    </div>
                    <div>
                        <div class="flex justify-between mb-2"><label>Kontras</label><span id="valContrastLabel" class="text-blue-600 font-bold bg-blue-50 px-2 rounded">100%</span></div>
                        <input type="range" id="sliderContrast" min="50" max="250" value="100" class="w-full accent-blue-600">
                    </div>
                    <div>
                        <div class="flex justify-between mb-2"><label>Warna (Saturation)</label><span id="valSaturationLabel" class="text-blue-600 font-bold bg-blue-50 px-2 rounded">100%</span></div>
                        <input type="range" id="sliderSaturation" min="0" max="200" value="100" class="w-full accent-blue-600">
                    </div>
                </div>
            </div>
            <div class="p-4 border-t border-gray-100 flex gap-3 bg-gray-50">
                <button onclick="resetEdits()" class="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold w-1/3 hover:bg-gray-100 transition shadow-sm">Reset</button>
                <button onclick="saveEdits()" class="px-4 py-3 bg-blue-600 text-white rounded-xl font-bold w-2/3 hover:bg-blue-700 transition shadow-md">Terapkan</button>
            </div>
        </div>
    </div>

    <div id="imageModal" class="fixed inset-0 z-50 hidden bg-black bg-opacity-90 flex items-center justify-center p-4 backdrop-blur-md">
        <div class="relative w-full max-w-3xl flex justify-center">
            <button onclick="closeImageModal()" class="absolute -top-10 right-0 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold bg-gray-800 hover:bg-red-500 transition z-50">✕</button>
            <img id="modalImage" src="" class="max-w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl bg-white p-1">
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>


#style.css

/* style.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

body {
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Custom Scrollbar yang sangat minimalis */
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
input[type="color"]::-webkit-color-swatch { border: none; border-radius: 6px; }

details > summary { list-style: none; }
details > summary::-webkit-details-marker { display: none; }
details[open] summary ~ * { animation: sweep .3s ease-in-out; }

@keyframes sweep {
    0%    {opacity: 0; margin-top: -10px}
    100%  {opacity: 1; margin-top: 0px}
}

#script.js

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
    const a = document.createElement('a'); a.href = currentPdfUrl; a.download = customFileName;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
});
