import { useRef, useState } from 'react';
import './App.css'; // Подключение файла стилей

const CameraCapture = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  console.log(cameraActive);

  // Определяем, какая камера будет использована в зависимости от устройства
  const getCameraConstraints = () => {
    const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobileDevice) {
      return {
        video: {
          facingMode: { exact: 'environment' } // Использование задней камеры на мобильных устройствах
        }
      };
    } else {
      return {
        video: true // Использование веб-камеры на десктопах
      };
    }
  };

  const startCamera = async () => {
    const constraints = getCameraConstraints();
    setCameraActive(true); // Включаем камеру
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream); // Сохраняем ссылку на поток
        await videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing the camera', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop()); // Останавливаем все треки потока
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Удаляем источник видео
      }
      setStream(null); // Очищаем состояние потока
      setCameraActive(false); // Выключаем камеру
    }
  };

  const takePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setPhotos((prevPhotos) => [...prevPhotos, dataUrl]);
      }

      if (photos.length + 1 >= 3) {
        stopCamera();
      }
    }
  };

  return (
    <div className="app-container">
      {!cameraActive && (
        <>
          <button onClick={startCamera} className="open-camera-btn">Open Camera</button>
          {photos.length > 0 && (
            <div className="photos-container">
              {photos.map((imgSrc, index) => (
                <img key={index} src={imgSrc} alt={`Captured ${index + 1}`} />
              ))}
            </div>
          )}
        </>
      )}
      {cameraActive && (
        <div className="camera-container">
          <video ref={videoRef} className="video-stream" />
          <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={480} />
          <div className="camera-controls">
            <span className="photo-count">{photos.length}/3</span>
            <button onClick={takePhoto} className="take-photo-btn">Take Photo</button>
            <button onClick={stopCamera} className="close-camera-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
