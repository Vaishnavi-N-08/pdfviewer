import React, { Component } from 'react';
import { Button, Container, Input, Typography, Box } from '@mui/material';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import './App.css';


// set the workerSrc
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


export default class App extends Component {

  // set the state
  state = {
    file: null,
    isPdf: false,
    numPages: null,
    pageNumber: 1,
    scale: 1.5,
    link: '',
  }


  // set the file
  onFileChange = (event) => {
    this.setState({
      file: event.target.files[0],
    });
  }

  // when form is submitted upload the file to localhost:5000/uploadFileAPI
  onFileUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.file);
    fetch('http://localhost:5000/uploadFileAPI', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        this.setState({
          link: data.link,
          isPdf: true,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }


  // set the number of pages
  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  // set the page number
  changePage = offset => this.setState(prevState => ({
    pageNumber: prevState.pageNumber + offset,
  }));

  // set the previous page
  previousPage = () => this.changePage(-1);

  // set the next page
  nextPage = () => this.changePage(1);

  // set the zoom in
  zoomIn = () => this.setState(prevState => ({
    scale: prevState.scale + 0.5,
  }));

  // set the zoom out with a minimum scale of 1.5
  zoomOut = () => this.setState(prevState => ({
    scale: prevState.scale > 1.5 ? prevState.scale - 0.5 : 1.5,
  }));

  render() {
    const { pageNumber, numPages } = this.state;

    return (
      <>
        <Container maxWidth="false" sx={{ margin: 0, backgroundColor: 'primary.main', display: 'flex', flexDirection: 'column',height:"500vh" }}>
          <Typography variant='h3' sx={{ textAlign: 'center', width: '100%' }}>
            Simple PDF Viewer
          </Typography>

            <Container maxWidth="lg" sx={{ backgroundColor: 'primary.second', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', flexDirection: { lg: 'row', md: 'row', xs: 'column' }, marginY: 5,paddingBottom:2 }}>

              <Container sx={{ marginY: 5, marginX: 0, display: 'flex', flexDirection: 'row', flexWrap: 'npwrap', alignItems: 'center', justifyContent: 'flex-start', width: "100%" }}>

                <Input accept="application/pdf" id="contained-button-file" sx={{ display: 'none' }} type="file" onChange={this.onFileChange} />

                <label htmlFor="contained-button-file">
                  <Button variant="contained" component="span">
                    <Typography variant='body2'>
                      Choose File
                    </Typography>
                  </Button>
                </label>

                <Typography variant='body2' sx={{ marginLeft: 5 }}>
                  {this.state.file ? this.state.file.name : "Upload a pdf file to view"}
                </Typography>

              </Container>

              <Button variant="contained" type='submit' onClick={this.onFileUpload} component="span">
                <Typography variant='body2'>
                  Upload
                </Typography>
              </Button>

            </Container>

            <Container maxWidth="lg" sx={{ backgroundColor: 'primary.second', paddingX: "5%", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

              {this.state.isPdf ?
                <>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%', backgroundColor:'primary.third' }}>
                  <Button type="button" disabled={pageNumber <= 1} onClick={this.previousPage}>
                      Previous
                    </Button>
                    <Button type="button" onClick={this.zoomIn}>
                      Zoom In
                    </Button>
                    <Typography variant='body1'>
                      Page {pageNumber} of {numPages}
                    </Typography>
                    <Button type="button" onClick={this.zoomOut}>
                      Zoom Out
                    </Button>
                    <Button type="button" disabled={pageNumber >= numPages} onClick={this.nextPage}>
                      Next
                    </Button>
                  </Box>


                  <Container sx={{ width: '90%', overflow: 'auto' }}>
                    <Document
                      file={this.state.link}
                      onLoadSuccess={this.onDocumentLoadSuccess}
                      options={{ workerSrc: "pdf.worker.js" }}
                    >
                      <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} scale={this.state.scale} />
                    </Document>
                  </Container>
                </>
                :
                <Typography variant='h6' sx={{ margin: 5 }}>
                  Upload a pdf file to view
                </Typography>
              }

            </Container>
          </Container>

      </>
    );
  }
}