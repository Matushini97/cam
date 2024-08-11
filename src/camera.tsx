import { useRef, useState, useEffect } from 'react';
import './App.css';  // Подключение файла стилей

const CameraCapture = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

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
    try {
      if (videoRef.current) {
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
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
    }
  };

  const takePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setPhoto(dataUrl);
        console.log(dataUrl);
      }
    }
  };

  // Автоматически запускать камеру при загрузке компонента
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera(); // Останавливаем камеру при размонтировании компонента
    };
  }, []);

  return (
    <div className="container">
      <video ref={videoRef} />
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={takePhoto}>Take Photo</button>
      <button onClick={stopCamera} disabled={!stream}>Stop Camera</button>
      <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={480} />
      {photo && <img src={photo} alt="Captured" />}
    </div>
  );
};

export default CameraCapture;
