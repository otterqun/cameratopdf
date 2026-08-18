# 📸 DocScanner Pro Live

A powerful, responsive, and serverless document scanner web application. Create PDFs from your camera or gallery, edit images, arrange page layouts, and apply professional vector watermarks — all processed 100% locally within your browser.

![UI Preview](https://via.placeholder.com/800x400.png?text=Place+Your+App+Screenshot+Here)

## ✨ Key Features

- **📸 Camera & Smart Guides:** Capture images directly from your webcam (mobile or PC) with real-world document dimension guides (A4, Receipts, & ID Cards).
- **✂️ Smart Image Cropping:** Integrated manual cropper to ensure only the important parts of the document are captured when uploading from the gallery.
- **🎨 Visual Image Editing:** Manually adjust image brightness, contrast, and saturation, along with an *Auto-Enhance* (Black & White) filter for sharper, cleaner text.
- **🗂 Smart Layouts (Collage):** Arrange multiple images into a single A4 page. Available layouts: 1 Image, 2 Images (Ideal for ID cards), 2x2 Grid, and 2x3 Grid. Includes an image scaling slider for perfect fits!
- **🔒 Vector Watermarks:** Watermark your PDFs for security purposes (e.g., "FOR BANK USE ONLY"). Supports adjustments for size, color, style (Center, Corners, Tiled/Pattern), and free positioning (X & Y Axis). Utilizes native vector text to ensure the PDF file size remains extremely light (in KBs).
- **📱 Dual-Mode Live Preview:** Real-time preview of your PDF whenever settings are adjusted. Uses an `<iframe/>` for speed on Desktops, and a custom **PDF.js** canvas rendering engine to fully support mobile browsers (iOS & Android).
- **⚡ Auto-Compression:** A built-in algorithm compresses large image files (MBs) down to a fraction of their size (KBs) before converting them to a PDF.

## 🛡️ Privacy & Data Security

This application is built on the principle of Client-Side Rendering. 
**No sensitive data, images, or scanned documents are sent to or stored on any external server or cloud.** All processing, image manipulation, and PDF generation occur entirely within your own device. (It even supports Offline usage once loaded).

## 🚀 Tech Stack

This project is built natively using Vanilla JS, powered by highly-optimized JavaScript libraries:

*   **UI/Styling:** HTML5 & [Tailwind CSS](https://tailwindcss.com/)
*   **Image Cropping:** [Cropper.js](https://fengyuanchen.github.io/cropperjs/)
*   **Image Compression:** [browser-image-compression](https://www.npmjs.com/package/browser-image-compression)
*   **PDF Generator:** [jsPDF](https://parall.ax/products/jspdf)
*   **Mobile PDF Rendering:** [PDF.js (Mozilla)](https://mozilla.github.io/pdf.js/)

## 💻 Usage & Installation

Because it is a fully client-side application, no *NPM Install*, local server, or database setup is required.

1. Download the repo or clone this project.
2. Ensure you have these three files together in the same directory:
   - `index.html`
   - `style.css`
   - `script.js`
3. Open the `index.html` file using any modern web browser (Chrome, Safari, Edge, Firefox).
4. You are ready to scan documents!

*(Note: Modern browsers require a secure context (HTTPS or localhost) for the Camera API to work).*

## 🤝 Contributing

Contributions from the community are highly welcomed! Whether it's a bug fix, adding new features, or just improving the UI. Feel free to open an *Issue* or submit a *Pull Request*.

## 📝 License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this software.