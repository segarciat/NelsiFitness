const bmiInputs = document.querySelectorAll('#bmi-tool input[type="number"]');
const bmiSubmit = document.querySelector('#bmi-submit');
const bmiTool = document.querySelector('#bmi-tool');

document.getElementById('open-bmi-tool').addEventListener('click', openBMITool);

document.getElementById('close-bmi').addEventListener('click', closeBMITool);
// keyup event pickedup from anywhere inside the BMI form
bmiTool.addEventListener('keyup', validateInputs);
bmiSubmit.addEventListener('click', calculateBMI);


function openBMITool() {
  bmiTool.style.display = 'block';
  bmiTool.children[0].animate(slideUp[0], slideUp[1]);
}

function closeBMITool(e) {
  bmiTool.children[0].animate(slideDown[0], slideDown[1]);
  setTimeout(() => { bmiTool.style.display = 'none';}, 500);
}

function calculateBMI(e) {
  const weight = Number(bmiInputs[0].value);
  const inches = Number(bmiInputs[1].value) * 12 + Number(bmiInputs[2].value);
  const bmi = 703 * weight/(inches*inches);
  showBMI(bmi);
  clearInputs();

  e.preventDefault();
}

function showBMI(bmi) {
  let weightStatus;
  if(bmi < 18.5) {
    weightStatus = "Underweight ";
  } else if(bmi < 24.9) {
    weightStatus = "Normal ";
  } else if(bmi < 29.9) {
    weightStatus = "Overweight ";
  } else {
    weightStatus = "Obese ";
  }

  const bmiElement = document.querySelector('#bmi h2');
  const bmiText = document.querySelector('#weight-status');
  bmiElement.innerHTML = `${bmi.toFixed(1)}`;
  bmiText.textContent = weightStatus;
}

function validateInputs() {
  let valid = true;
  bmiInputs.forEach((curInput) => {
    if(curInput.value < 0 || curInput.value === '') {
      valid = false;
    }
  });

  const inches = Number(bmiInputs[1].value) + Number(bmiInputs[2].value);
  if(inches === 0)
    valid = false;

  if(valid) {
    bmiSubmit.disabled = false;
    bmiSubmit.style.background = '#1977BE';
    bmiSubmit.style.cursor = 'pointer';
  }
  else {
    bmiSubmit.disabled = true;
    bmiSubmit.style.background = 'grey';
    bmiSubmit.style.cursor = 'default';
  }
}

function clearInputs() {
  bmiInputs.forEach((input) => {
    input.value = '';
  });

  validateInputs();
}

const slideUp = [
  [
    {top: '-50%'},
    {top: '30%'}
  ], 
  {
    duration: 500,
    easing: "ease-in-out",
    fill: "forwards"
  }];

const slideDown = [
  [
    {top: '30%'},
    {top: '-50%'}
  ], 
  {
    duration: 500,
    easing: "ease-in-out",
    fill: "forwards"
  }];