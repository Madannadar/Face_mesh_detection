// 1. Install dependencies DONE
// 2. Import dependencies DONE
// 3. Setup webcam and canvas DONE
// 4. Define references to those DONE
// 5. Load posenet DONE
// 6. Detect function DONE
// 7. Drawing utilities from tensorflow DONE
// 8. Draw functions DONE


import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import React, {useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import Webcam from 'react-webcam';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // load facemesh

  const runFacemesh = async () => {
    try {
      const model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh, // ✅ Correct property name
        {
          runtime: "mediapipe",
          solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
        }
      );
  
      setInterval(() => {
        detect(model);
      }, 100);
    } catch (error) {
      console.error("Error loading face-mesh model:", error);
    }
  };

  // detect function
  const detect = async(net) => {
    if(
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const face = await net.estimateFaces({ input: video });
      console.log(face);

      // Get canvas context
      const ctx = canvasRef.current.getContext("2d");
      drawMesh(face, ctx);
    }
  }
  runFacemesh();
  return (
    <div className="App">
      <header className='App-header'>
        <Webcam 
        ref={webcamRef}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zindex: 9,
          width: 640,
          height: 480,
        }}/>
        <canvas 
        ref={canvasRef}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zindex: 9,
          width: 640,
          height: 480,
        }}/>
        </header>
    </div>
  )
}

export default App


