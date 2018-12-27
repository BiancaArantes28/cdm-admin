import React, { Component } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import prototipo from './img/biancaarantes.jpg';
import {base64StringtoFile,
    downloadBase64File,
    extractImageFileExtensionFromBase64,
    image64toCanvasRef} from './ResuableUtils'

const imageMaxSize = 1000000000
const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => {return item.trim()})
export default class Cropp extends Component{

    // _crop(){
    //     // image in dataUrl
    //     // console.log(this.refs.cropper.getCroppedCanvas().toDataURL());
    //     console.log("aqui");
    // }

    constructor(props){
        super(props);
        this.imagePreviewCanvasRef = React.createRef()
        this.fileInputRef = React.createRef()
        this.state = {
            foto: '',
            imgSrc: null,
            imgSrcExt: null,
            crop: {
                aspect: 1/1
            }
        }
    }
    _crop = ( e ) => {
        const dataUrl = this.refs.cropper.getCroppedCanvas().toDataURL();
        this.setState({foto: dataUrl});
        var canvasData = document.getElementsByClassName('cropper-hidden') 
        [0].cropper.canvasData
        var cropBoxData = this.refs.cropper.getCropBoxData();
    
        if ( sessionStorage.getItem('shouldMove') === 'false' ) {
          sessionStorage.setItem( 'currentLeft', cropBoxData.left )
          sessionStorage.setItem( 'currentTop', cropBoxData.top )
          sessionStorage.setItem('shouldMove', true)
        }else {
          if (
            cropBoxData.left <= canvasData.left ||
            cropBoxData.top  <= canvasData.top  ||
            cropBoxData.left + cropBoxData.width > canvasData.width + 
            canvasData.left ||
            cropBoxData.top + cropBoxData.height > canvasData.height + 
            canvasData.top
          ) {
            cropBoxData.left = sessionStorage.getItem( 'currentLeft' )
            cropBoxData.top = sessionStorage.getItem( 'currentTop' )
            
          }
        }}

        verifyFile = (files) => {
            if(files && files.length > 0){
                const currentFile = files[0]
                const currentFileType = currentFile.type
                const currentFileSize = currentFile.size
    
                if(currentFileSize > imageMaxSize){
                    alert("This file is too big")
                    return false
                }
                if(!acceptedFileTypesArray.includes(currentFileType)){
                    alert("This file is not allowed. Only images are allowed");
                    return false
                }
                return true
            }
        }
        handleOnDrop = (files, rejectedFiles) => {
            console.log(files)
            console.log("rejeitado", rejectedFiles)
            if(rejectedFiles && rejectedFiles.length > 0){
                this.verifyFile(rejectedFiles)
            }
    
            if(files && files.length > 0){
                const isVerified = this.verifyFile(files)
                if(isVerified){
                    const currentFile = files[0]
                    const myFileItemReader = new FileReader()
                    myFileItemReader.addEventListener("load", () => {
                        // console.log(myFileItemReader.result)
                        const myResult = myFileItemReader.result
                        this.setState({
                            imgSrc: myFileItemReader.result,
                            imgSrcExt: extractImageFileExtensionFromBase64(myResult)
                        })
                    }, false)
                    
                    myFileItemReader.readAsDataURL(currentFile)
                }
            }
        }
    
        handleImageLoaded = (image) => {
            console.log(image)
        }
    
        handleOnCropChange = (crop) => {
            this.setState({crop: crop})
        }
    
        handleOnCropComplete = (crop, pixelCrop) => {
            console.log(crop, pixelCrop)
    
            const canvasRef = this.imagePreviewCanvasRef.current
            const {imgSrc} = this.state
            image64toCanvasRef(canvasRef, imgSrc, pixelCrop)
        }
    
        handleDownloadClick = (event) => {
            event.preventDefault()
            const {imgSrc} = this.state
            if(imgSrc){
                const canvasRef = this.imagePreviewCanvasRef.current
            
                const {imgSrcExt} = this.state
                const imageData64 = canvasRef.toDataURL("image/" + imgSrcExt)
                const myFilename = "previewFile." + imgSrcExt
    
                // file uploaded
                const myNewCroppedFile = base64StringtoFile(imageData64, myFilename)
    
                // download file
                downloadBase64File(imageData64, myFilename)
                this.handleClearToDefault()
            }
            
        }
    
        handleClearToDefault = event => {
            if(event) event.preventDefault()
            const canvas = this.imagePreviewCanvasRef.current
            const ctx = canvas.getContext("2d")
            ctx.clearRect(0, 0, canvas.width, canvas.height)
    
            this.setState({
                imgSrc: null,
                imgSrcExt: null,
                crop: {
                    aspect: 1/1
                }
            })
    
            this.fileInputRef.current.value = null
        }
    
        handleFileSelect = event => {
            // console.log(event)
            const files = event.target.files
            if(event.target.files && event.target.files.length > 0){
                
                const isVerified = this.verifyFile(files)
                if(isVerified){
                    const currentFile = files[0]
                    const myFileItemReader = new FileReader()
                    myFileItemReader.addEventListener("load", () => {
                        // console.log(myFileItemReader.result)
                        const myResult = myFileItemReader.result
                        this.setState({
                            imgSrc: myFileItemReader.result,
                            imgSrcExt: extractImageFileExtensionFromBase64(myResult)
                        })
                    }, false)
                    
                    myFileItemReader.readAsDataURL(currentFile)
                }
            }
        }
    render(){
        return(
            <div data-reactroot>
                <input ref={this.fileInputRef} type="file" multiple={false} accept={acceptedFileTypes} onChange={this.handleFileSelect} />
                <Cropper
                    ref='cropper'
                    src={this.state.imgSrc}
                    style={{height: 400, width: '100%'}}
                    // Cropper.js options
                    aspectRatio={3 / 4}
                    guides={true}
                    crop={this._crop} />
                <img src={this.state.foto}/>
            </div>
        );
    }
}