'use strict'

let currentPixels = null;
let imageWidth = null;
let imageHeight = null;
let originalPixels = null;

function getIndex(x, y) {
  return (x + y * imageWidth) * 4
}

function clamp(value) {
  return Math.max(0, Math.min(Math.floor(value), 255));
}

const R_OFFSET = 0;
const G_OFFSET = 1;
const B_OFFSET = 2;

function setGrayscale(x, y) {
  const redIndex = getIndex(x, y) + R_OFFSET;
  const greenIndex = getIndex(x, y) + G_OFFSET;
  const blueIndex = getIndex(x, y) + B_OFFSET;

  const redValue = currentPixels[redIndex];
  const greenValue = currentPixels[greenIndex];
  const blueValue = currentPixels[blueIndex];
  
  const mean = ( redValue + greenValue + blueValue) / 3;

  currentPixels[redIndex] = clamp(mean);
  currentPixels[greenIndex] = clamp(mean);
  currentPixels[blueIndex] = clamp(mean);
}

function processImage() {
  currentPixels = originalPixels.slice();
  
  for (let i = 0; i < imageHeight; i++){
    for (let j = 0; j < imageWidth; j++) {
      setGrayscale(j, i, imageWidth);
    }
  }
  postMessage(currentPixels);
}

onmessage = event => {
  imageWidth = event.data[0];
  imageHeight = event.data[1];
  originalPixels = event.data[2];

  if (event.data[3] === "processImage") processImage();
};

// make it elegant now!