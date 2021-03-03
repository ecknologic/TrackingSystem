import React, { Component } from "react";
import { Document, Page } from "react-pdf";
import NoContent from "./NoContent";
import Spinner from "./Spinner";

export default class PDFViewer extends Component {
    state = {
        numPages: null
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    render() {
        return (
            <Document
                file={this.props.pdf}
                onLoadSuccess={this.onDocumentLoadSuccess}
                loading={<NoContent content={<Spinner />} />}
                className='document-viewer'
            >
                {Array.from(new Array(this.state.numPages), (el, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
            </Document>
        );
    }
}
