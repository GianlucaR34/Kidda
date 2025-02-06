import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Configurar la ruta del worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = "/node_modules/pdfjs-dist/build/pdf.worker.min.mjs";

const MagazineViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const getDimensions = (pageIndex, numPages) => {
    // Portada y contraportada con A4
    if (pageIndex === 0 || pageIndex === numPages - 1) {
      return { width: 595, height: 842 }; // A4
    }
    // Páginas intermedias con A3 apaisado
    return { width: 1190, height: 842 }; // A3 apaisado
  };

  const isSinglePage = (pageIndex, numPages) => pageIndex === 0 || pageIndex === numPages - 1;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#222", // Fondo gris oscuro
        color: "#fff", // Texto blanco si necesitas agregarlo
        padding: "20px",
        height: "100vh", // Asegura que ocupe toda la pantalla
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
                  backgroundColor: "#fff", // Fondo blanco para las páginas
                  overflow: "hidden",
                  margin: "0 auto",
                  position: "relative",
                  // Asegura que las páginas de la portada y contraportada se centren
                  paddingLeft: singlePage ? "50%" : "0", // Centra solo la portada/contraportada
                  transform: singlePage ? "translateX(-50%)" : "none", // Centrado para A4
                }}
              >
                <Page
                  pageNumber={index + 1}
                  width={width}
                  style={{
                    position: "absolute",
                    left: "0",
                    top: "0",
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
