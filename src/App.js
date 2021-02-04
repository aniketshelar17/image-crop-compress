import logo from './logo.svg';
import './App.css';
import {Row, Col, Container, Button } from 'react-bootstrap'
import { useState, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function App() {

  const [ fileName, setFileName ] = useState('');
  const [ fileSrc, setFileSrc ] = useState('');
  const [ fileObject, setFileObject ] = useState();
  const [ cropped, setCropped ] = useState(
    {
      unit: '%',
      aspect: 16 / 16,
      width: 50,
      height: 50,
    }
  )
  const [ croppedImage, setCroppedImage ] = useState(
    {
      imageRef: '',
      blobObject: [],
    }
  )

  useEffect(() => {
    if(fileName !== ''){
      const render = new FileReader();
      render.addEventListener('load', () =>{
          setFileSrc(render.result)
      });
      render.readAsDataURL(fileObject);
    }
  }, [fileObject])

  const fileOnClick = (e) => {
    setFileName(e.target.files[0].name);
    setFileObject(e.target.files[0])
  }

  const onImageLoaded = (image) => {
    croppedImage.imageRef = image;
  };

  const onCropComplete = (crop) => {
      makeClientCrop(crop);
  };

  const onCropChange = (crop, percentCrop) => {
    setCropped(crop);
  };

  const makeClientCrop = async (crop) => {
      if (croppedImage.imageRef && crop.width && crop.height) {
          const croppedImageUrl = await getCroppedImg(
          croppedImage.imageRef,
          crop,
          fileName
        );
      }
  }

  const getCroppedImg = (image, crop, fileName) => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = (crop.width + 200 < 500)? crop.width + 200 : 500;
      canvas.height = (crop.height + 200 < 500)? crop.height + 200 : 500;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
          
      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (!blob) {
            return;
          }
          croppedImage.blobObject = blob;
          console.log(blob);
        }, 'image/jpeg',1);
      });
      
    }
  
  const getCroppedImage = () => {
    var element = document.createElement("a");
    console.log(croppedImage.blobObject);
    element.href = window.URL.createObjectURL(croppedImage.blobObject);
    element.download = fileName;
    element.click();
  }

  return (
    <div>
      <div className="file-input">
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroupFileAddon01">
              Upload Image
            </span>
          </div>
          <div className="custom-file">
            <input
              type="file"
              className="custom-file-input"
              id="inputGroupFile01"
              aria-describedby="inputGroupFileAddon01"
              onChange = { (e) => fileOnClick(e)}
            />
            <label className="custom-file-label" htmlFor="inputGroupFile01">
              { ( fileName ) ? fileName :'Choose file' }
            </label>
          </div>
        </div>
      </div>
      <div className="seperator"></div>
      <Container>
        <Row>
        <Col xs={1} md={3} lg={3}></Col>
          <Col xs={10} md={6} lg={6}>
            {(fileSrc) && ( 
              <ReactCrop 
                src={fileSrc} 
                crop={cropped} 
                ruleOfThirds
                onImageLoaded={e => { onImageLoaded(e) } }
                onComplete={e => { onCropComplete(e) } }
                onChange={e => { onCropChange(e) }}
              />
              )}
            {(fileSrc) && ( 
              <div className ="MainContainer">
                <div className="TextViewStyle">
                    <p className="TextStyle" onClick={ () => 
                getCroppedImage() }>Download Cropped Image</p>
                </div>  
              </div>
              )}
          </Col>
          <Col xs={1} md={3} lg={3}></Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
