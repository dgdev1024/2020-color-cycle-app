// DOM Elements
const startingColorError = document.querySelector('#starting-color-error')
const startingColorInput = document.querySelector('#starting-color');
const redChangeInput = document.querySelector('#red-change');
const greenChangeInput = document.querySelector('#green-change');
const blueChangeInput = document.querySelector('#blue-change');
const changeIntervalInput = document.querySelector('#change-interval');
const startStopButton = document.querySelector('#start-stop-button');
const previousColors = document.querySelector('#cc-previous-colors');
const clearPreviousColorsButton = document.querySelector('#cc-previous-colors-clear');

// Constants
const colorHexadecimalRegex = /#[0-9a-f]{6}/i;

// Variables
let cycleStarted = false;
let cycleInterval = null;
let currentColor = [0, 0, 0];

// Functions
const hexToRgb = (hex) => {
  const redHex = hex.slice(1, 3);
  const greenHex = hex.slice(3, 5);
  const blueHex = hex.slice(5);

  return [
    parseInt(redHex, 16),
    parseInt(greenHex, 16),
    parseInt(blueHex, 16)
  ];
};

const rgbToHex = (rgb) => {
  const [red, green, blue] = rgb;
  let redHex = red.toString(16);
  let greenHex = green.toString(16);
  let blueHex = blue.toString(16);
  redHex = redHex.length === 1 ? `0${redHex}` : redHex;
  greenHex = greenHex.length === 1 ? `0${greenHex}` : greenHex;
  blueHex = blueHex.length === 1 ? `0${blueHex}` : blueHex;
  return `#${redHex}${greenHex}${blueHex}`.toUpperCase();
}

const clamp = (number, min, max) => {
  if (number < min) { return min; }
  else if (number > max) { return max; }
  else { return number; }
}

const rgbAsInt = (color) => {
  return color[0] + color[1] + color[2];
}

const areColorsEqual = (first, second) => {
  return first[0] === second[0] && first[1] === second[1] && first[2] === second[2];
}

const addColor = (color) => {
  const currentColorHex = rgbToHex(color);
  const currentColorInt = rgbAsInt(color);

  previousColors.innerHTML += `
    <div class='cc-previous-color' style='background-color:${currentColorHex}; color:${currentColorInt < 383 ? '#FFFFFF' : '#000000'};'>
      <small>${currentColorHex}</small>
    </div>
  `;

  previousColors.scrollLeft = previousColors.scrollWidth;
  previousColors.scrollTop = previousColors.scrollHeight;
}

const onColorCycleInterval = () => {
  const newColor = [
    clamp(currentColor[0] + parseInt(redChangeInput.value || 0), 0, 255),
    clamp(currentColor[1] + parseInt(greenChangeInput.value || 0), 0, 255),
    clamp(currentColor[2] + parseInt(blueChangeInput.value || 0), 0, 255)
  ];

  const currentColorHex = rgbToHex(currentColor);
  document.body.style.backgroundColor = currentColorHex;
  startingColorInput.value = currentColorHex;

  if (areColorsEqual(currentColor, newColor)) {
    addColor(newColor);
    stopCycle();
  } else {
    addColor(currentColor);
    currentColor = newColor;
  }
};

const startCycle = () => {
  startingColorInput.readOnly = true;
  redChangeInput.readOnly = true;
  greenChangeInput.readOnly = true;
  blueChangeInput.readOnly = true;
  changeIntervalInput.readOnly = true;
  clearPreviousColorsButton.disabled = true;

  cycleStarted = true;
  cycleInterval = setInterval(onColorCycleInterval, changeIntervalInput.value);

  startStopButton.innerHTML = 'Stop';
};

const stopCycle = () => {
  cycleStarted = false;
  clearInterval(cycleInterval);

  startingColorInput.readOnly = false;
  redChangeInput.readOnly = false;
  greenChangeInput.readOnly = false;
  blueChangeInput.readOnly = false;
  changeIntervalInput.readOnly = false;
  clearPreviousColorsButton.disabled = false;

  startStopButton.innerHTML = 'Start';
}

const clearPreviousColors = () => {
  previousColors.innerHTML = '';
};

const checkColorInput = (value) => {
  if (colorHexadecimalRegex.test(value) === false) {
    startingColorError.innerHTML = 'Must be in the form #XXXXXX.';
    startingColorInput.select();
    return false;
  } else {
    startingColorError.innerHTML = '';
    currentColor = hexToRgb(value);

    const newColor = [
      clamp(currentColor[0] + parseInt(redChangeInput.value || 0), 0, 255),
      clamp(currentColor[1] + parseInt(greenChangeInput.value || 0), 0, 255),
      clamp(currentColor[2] + parseInt(blueChangeInput.value || 0), 0, 255)
    ];
    if (areColorsEqual(newColor, currentColor)) {
      startingColorError.innerHTML = 'No change in colors. Nothing to be done.';
      return false;
    }

    return true;
  }
}

const onStartStopButtonClicked = () => {
  if (cycleStarted === false) {
    const { value } = startingColorInput;
    if (checkColorInput(value) === true) {
      startCycle();
    }
  } else {
    stopCycle();
  }
};

// Event Handlers
startStopButton.addEventListener('click', onStartStopButtonClicked);
clearPreviousColorsButton.addEventListener('click', clearPreviousColors);
