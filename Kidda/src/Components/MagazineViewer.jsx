import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import { isMobile } from "react-device-detect";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import '../styles/MagazineViewer.css';

// Configurar la ruta del worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const MagazineViewer = ({ pdfA3Url, pdfA4Url }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const getDimensions = (pageIndex, numPages) => {
    if (pageIndex === 0 || pageIndex === numPages - 1 || isMobile) {
      return { width: 595, height: 842 }; // A4 en portada/contraportada y en móviles
    }
    return { width: 1190, height: 842 }; // A3 apaisado en escritorio
  };

  const isSinglePage = (pageIndex, numPages) =>
    pageIndex === 0 || pageIndex === numPages - 1 || isMobile;

  // Determinar la URL del PDF según el dispositivo
  const pdfUrl = isMobile ? pdfA4Url : pdfA3Url;

  console.log("URL del PDF mostrado:", pdfUrl);

  return (
    <div className="magazine-container">
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <HTMLFlipBook
          className="flipbook-container"
          width={isMobile ? 595 : 1190} // A4 en móviles, A3 en escritorio
          height={842}
          showCover={true}
          style={{
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          {Array.from(new Array(numPages), (_, index) => {
            const { width, height } = getDimensions(index, numPages);
            const singlePage = isSinglePage(index, numPages);

            return (
              <div
                key={index}
                style={{
                  width: width,
                  height: height,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  overflow: "hidden",
                  margin: "0 auto",
                  position: "relative",
                }}
              >
                <Page
                  pageNumber={index + 1}
                  width={width}
                  style={{
                    position: "absolute",
                    left: singlePage ? "50%" : "0",
                    transform: singlePage ? "translateX(-50%)" : "none",
                  }}
                />
              </div>
            );
          })}
        </HTMLFlipBook>
      </Document>
    </div>
  );
};

export default MagazineViewer;
