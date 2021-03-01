import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import NoContent from "./NoContent";
import Spinner from "./Spinner";

export default function PDFViewer({ pdf }) {
    const [numPages, setNumPages] = useState(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <Document
            file={pdf}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<NoContent content={<Spinner />} />}
            className='document-viewer'
        >
            {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
        </Document>
    );
}
