import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import "../styles/MagazineViewer.css";
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Configurar la ruta del worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `/node_modules/pdfjs-dist/build/pdf.worker.min.mjs`;

const MagazineViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <HTMLFlipBook width={600} height={800} showCover={true}>
          {Array.from(new Array(numPages), (_, index) => (
            <div key={index}>
              <Page pageNumber={index + 1} width={600} />
            </div>
          ))}
        </HTMLFlipBook>
      </Document>
    </div>
  );
};

export default MagazineViewer;
