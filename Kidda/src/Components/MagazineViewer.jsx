import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import { isMobile } from "react-device-detect"; // Importar para detectar dispositivo móvil
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Configurar la ruta del worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = "/node_modules/pdfjs-dist/build/pdf.worker.min.mjs";

const MagazineViewer = ({ pdfA3Url, pdfA4Url }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const getDimensions = (pageIndex, numPages) => {
    if (pageIndex === 0 || pageIndex === numPages - 1) {
      return { width: 595, height: 842 }; // A4
    }
    return { width: 1190, height: 842 }; // A3 apaisado
  };

  const isSinglePage = (pageIndex, numPages) => pageIndex === 0 || pageIndex === numPages - 1;

  // Determinar la URL del PDF según el dispositivo
  const pdfUrl = isMobile ? pdfA4Url : pdfA3Url;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#222",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra externa
      }}
    >
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <HTMLFlipBook
          width={1190} // A3 máximo
          height={842} // Altura fija
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
                  width: singlePage ? 595 : 1190, // A4 para portada/contraportada, A3 para el resto
                  height: 842, // Altura fija
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  overflow: "hidden",
                  margin: "0 auto", // Centrar el contenedor si es portada/contraportada
                  position: "relative",
                }}
              >
                <Page
                  pageNumber={index + 1}
                  width={width}
                  style={{
                    position: "absolute", // Asegura que el contenido esté alineado
                    left: singlePage ? "50%" : "0", // Centrar si es portada/contraportada
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
