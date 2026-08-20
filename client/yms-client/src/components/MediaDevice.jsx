import {useState, useEffect} from 'react';

function MediaDevice() {
  const [mediaStream, setMediaStream] = useState(null)

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(requestedMedia)
        setMediaStream(stream)
      } catch(err) {
        console.log('error with media device', err.message)
      }
    }

    if (!mediaStream) {
      enableStream()
    } else {
      return function cleanUp() {
        mediaStream.getTracks().forEach(track => {
          track.stop()
        })
      }
    }
  }, [mediaStream, requestedMedia]

)

  return mediaStream
   
}

export default MediaDevice
