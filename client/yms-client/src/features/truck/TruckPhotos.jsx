import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux"
import { getContainerByID, getContainers, loadContainer, submitTruckImage, testPicPath } from "../../utils/apiFunctions";
import { useEffect } from "react";
import qrlogo from '../../assets/QrCode.png'
// import check from '../assets/checkmark.jpg'
import ScanTruckBarcode from "../../components/ScanTruckBarcode";
import { useState } from "react";
import styles from './TruckIDSubmit.module.css'
import { getObjectStore, clearObjectStore, addToDB, deleteDB, getItemByIndex, getAllItems, getItemById, deleteItemByID, openDatabase, deleteObjectStore } from "../../utils/truckImagesDB"
import Button from "../../ui/Button";
import { setUploadedImages, setPhotoCount } from "../pictures/pictureSlice";
import toast from "react-hot-toast";
import { Buffer } from "node:buffer";
import axios from "axios";

function TruckPhotos({onCloseModal}) {
  const [truckPhoto, setTruckPhoto] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [photoSubmitted, setPhotoSubmitted] = useState(false)
  const [photoUploaded, setPhotoUploaded] = useState(false)
  const [localPhoto, setLocalPhoto] = useState(null)
  // const [photoCount, setPhotoCount] = useState(0);
  const [images, setImages] = useState([])
  const username = useSelector((state) => state.user.username)
  const userID = useSelector((state) => state.user.userID)
  const orderNumber = useSelector((state) => state.order.orderNumber)
  const selectedTruck = useSelector((state) => state.truck.selectedTruck)
  const scannedContainer = useSelector((state) => state.picture.scannedContainer)
  const orgCode = useSelector((state) => state.user.orgCode)
  const uploadedImages = useSelector((state) => state.picture.uploadedImages)
  const photoCount = useSelector((state) => state.picture.photoCount)

  const dispatch = useDispatch()

  useEffect(() => {
    let array = []
    async function getPhotoFromLocal() {
      // const id = [userID, orderNumber, selectedTruck]
      const item = await getItemByIndex(selectedTruck)
      if (!item){
        console.log(`no local photo for ${selectedTruck}`)
        return;
      } 
      setImages(item)
      setPhotoUploaded(true)
    } 
    

    getPhotoFromLocal()
  }, [])

  const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    fileReader.onload = () => {
      resolve(fileReader.result)
    }

    fileReader.onerror = () => {
      reject(error)
    }

  })
}

  async function convertForSubmit(file) {
    const fd = new FormData()
    fd.append('image', file)
    try {
      const res = await axios.post('http://localhost:8080', fd)
      const {data} = res
      return data
    } catch (err) {
      console.log('error converting', err.message)
    }
  }
  
  const handleCapture = async (e) => {
    const file = e.target.files[0];
    try {
      if (file) {
        const data = await convertToBase64(file)
        setPhoto(data)
        const imageName = await convertForSubmit(file)
        const id = crypto.randomUUID()
        const date = new Date().toLocaleString()
        dispatch(setPhotoCount(photoCount + 1))
        const object = {
          id,
          org: orgCode,
          user: username,
          orderNumber,
          truck_id: selectedTruck,
          truck_image: data,
          image_name: imageName,
          date_uploaded: date
        }

        
        const notif = await addToDB( object)
        const imageData = notif.data;

        const {truck_image} = imageData;

        function convertToBuffer(data) {
          const b = Buffer.from(data, 'base64');
          return b
        }

        const photo = {
          truck_id: selectedTruck, truck_image: imageName
        }


        setPhotoSubmitted(true)
        setTruckPhoto(photo)
        const items = await getItemByIndex(selectedTruck)
        setImages(items)
      }
    }  catch (err) {
      console.log('error getting photo', err.message)
    }
  }

    async function handleUpload() {
    const items = await getItemByIndex(selectedTruck)
    for (let i = 0; i < items.length; i++) {
      const {truck_id, image_name, id} = items[i]
      const user_id = userID
      try {
        const result = await submitTruckImage(truck_id, user_id, image_name)
        deleteItemByID(id)
        const item = await getItemByIndex(selectedTruck)
        setImages(item)
      } catch (err) {
        console.log('error submitting', err.payload)
        console.log('test', err)
        toast.error(err.message)
      }
    }
    onCloseModal()
  }

  async function handleRemove(id) {
    const del = deleteItemByID(id)
    const item = await getItemByIndex(selectedTruck)
    setImages(item)
  }

  return (
    <div>
      <div className="grid">
        <h1 >Submit Truck Images for upload to {selectedTruck}</h1>
        <input className=" hover:cursor-pointer" id="camera-input" type="file" accept="image/" capture='environment' onChange={handleCapture} />
      </div>
      <br></br>
      <h1 className="text-center">{photoUploaded ? 'Images ready to be uploaded' : 'Images ready to upload will appear here'}</h1>
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Image</td>
            <td>Date Uploaded</td>
            <td>Remove</td>
          </tr>
        </thead>
        <tbody>
          {images.map((image) => (
            <tr key={image.id}>
              <td>{image.image_name}</td>
              <td><img src={image.truck_image} className="w-20" /></td>
              <td>{image.date_uploaded || null}</td>
              <td><button className="hover:cursor-pointer" onClick={() => handleRemove(image.id)}>Remove Image</button></td>
            </tr>
          ))} 

        </tbody>
      </table>
      <br></br>
      <Button type='primary' onClick={handleUpload}>Upload Image(s)</Button>
    </div>
  )
}

export default TruckPhotos
