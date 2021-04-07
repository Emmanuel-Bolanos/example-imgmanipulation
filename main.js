'use strict';

function spin() {
  const spinner = document.getElementById("spinner");
  let angle = 0;
  setInterval(() => {
    angle++;
    spinner.style.transform = `rotate(${angle}deg)`
  }, 10);
}

spin();

const fileInput = document.getElementById("fileinput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const srcImage = new Image();

let imgData = null;
let originalPixels = null;

const drawWorker = new Worker("./worker.js")

drawWorker.onmessage = event => {
  commitChanges(event.data);
};

function startProcessImage() {
  drawWorker.postMessage([srcImage.width, srcImage.height, originalPixels, "processImage"]);
};

fileInput.onchange = function(e) {
  if(e.target.files && e.target.files.item(0)) {
    srcImage.src = URL.createObjectURL(e.target.files[0]);
  }
};

srcImage.onload = function () {
  canvas.width = srcImage.width;
  canvas.height = srcImage.height;
  ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height);
  imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height);
  originalPixels = imgData.data.slice();
}

function commitChanges(currentPixels) {
  for (let i = 0; i < imgData.data.length; i++) {
    imgData.data[i] = currentPixels[i];
  }
  ctx.putImageData(imgData, 0, 0, 0, 0, srcImage.width, srcImage.height);
}
