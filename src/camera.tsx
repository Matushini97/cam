import { useRef, useState } from 'react';
import './App.css';  // Подключение файла стилей

const CameraCapture = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photo, setPhoto] = useState(null);

  const startCamera = async () => {
    try {
      // Проверяем, что videoRef.current существует перед доступом
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing the camera', error);
    }
  };

  const takePhoto = () => {
    // Проверяем, что canvasRef.current и videoRef.current существуют перед доступом
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      context?.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const dataUrl: any = canvasRef.current.toDataURL('image/png');
      setPhoto(dataUrl);
    }
  };

  return (
    <div className="container">
      <video ref={videoRef} />
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={takePhoto}>Take Photo</button>
      <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={480} />
      {photo && <img src={photo} alt="Captured" />}
    </div>
  );
};

export default CameraCapture;
