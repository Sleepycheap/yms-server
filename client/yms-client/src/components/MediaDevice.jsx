import {useState, useEffect, useRef} from 'react';

function MediaDevice() {
  const videoRef = useRef(null)
  const photoRef = useRef(null)
  const stripRef = useRef(null)
 

  useEffect(() => {
      async function startStream() {
        try {
          const constraints = {
            video: true,
            audio: false
          }
          navigator.mediaDevices.getUserMedia(constraints).then(stream => {
            let video = videoRef.current;
            video.srcObject = stream
            video.play()  
          })
        } catch(err) {
          console.log('error with media device', err.message)
        }
      }
      
      startStream()
    

  }, [])

  const paintToCanvas = () => {
    let video = videoRef.current;
    let photo = photoRef.current;
    let ctx = photo.getContext('2d');

    const width = 320;
    const height = 240;

    return setInterval(() => {
      ctx.drawImage(video, 0, 0, width, height)
    }, 200)

  };

  const stop = (e) => {
    const stream = video.srcObject;
    const tracks = stream.getTracks();

    for (let i = 0; i < tracks.length; i++) {
      let track = tracks[i]
      track.stop()
    }

    video.srcObject = null;
  }

  const takePhoto = () => {
    let photo = photoRef.current;
    let strip = stripRef.current

    const data = photo.toDataURL('image/jpeg')
    const link = document.createElement('a')
    link.href = data;
    link.setAttribute('downloand', 'myWebcam');
    link.innerHTML = `<img src='${data} alt='thumbnail/>`;
    strip.insertBefore(link, strip.firstChild)
  }


  return (
    <>
    <div>
      <video ref={videoRef} />
      <photo ref={photoRef} />
      <button onClick={() => takePhoto()}>Capture Photo</button>
    </div>
    </>
  )
   
}

export default MediaDevice
