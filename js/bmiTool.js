const BMITool = (() => {
  // BMI tool elements
  const bmiTool = document.querySelector("#bmi-tool");
  const bmiOpen = document.getElementById("open-bmi-tool");
  const bmiX = document.getElementById("close-bmi");
  const bmiInputs = bmiTool.querySelectorAll('input[type="number"]');
  const bmiSubmit = document.querySelector("#bmi-submit");

  // Flag for smaller devices
  const tablet = window.matchMedia("(max-width: 1200px)");

  const loadEventListeners = () => {
    bmiOpen.addEventListener("click", openBMITool);
    bmiX.addEventListener("click", closeBMITool);
    // keyup event pickedup from anywhere inside the BMI form
    bmiTool.addEventListener("keyup", validateInputs);
    bmiSubmit.addEventListener("click", calculateBMI);
  };

  const openBMITool = () => {
    // For tablets and smaller, scroll to the tool
    if (tablet.matches) {
      bmiTool.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      // For larger screens, slide in
    } else {
      bmiTool.style.display = "block";
      bmiTool.children[0].animate(slideUp[0], slideUp[1]);
    }
  };

  function closeBMITool(e) {
    bmiTool.children[0].animate(slideDown[0], slideDown[1]);
    setTimeout(() => {
      bmiTool.removeAttribute("style");
    }, 500);
  }

  function calculateBMI(e) {
    const weight = Number(bmiInputs[0].value);
    const inches = Number(bmiInputs[1].value) * 12 + Number(bmiInputs[2].value);
    const bmi = (703 * weight) / (inches * inches);
    showBMI(bmi);
    clearInputs();

    e.preventDefault();
  }

  function showBMI(bmi) {
    let weightStatus;
    if (bmi < 18.5) {
      weightStatus = "Underweight ";
    } else if (bmi < 24.9) {
      weightStatus = "Normal ";
    } else if (bmi < 29.9) {
      weightStatus = "Overweight ";
    } else {
      weightStatus = "Obese ";
    }

    const bmiElement = document.querySelector("#bmi h2");
    const bmiText = document.querySelector("#weight-status");
    bmiElement.innerHTML = `${bmi.toFixed(1)}`;
    bmiText.textContent = weightStatus;
  }

  function validateInputs() {
    let valid = true;
    bmiInputs.forEach(curInput => {
      if (curInput.value < 0 || curInput.value === "") {
        valid = false;
      }
    });

    const inches = Number(bmiInputs[1].value) + Number(bmiInputs[2].value);
    if (inches === 0) valid = false;
    toggleSubmit(valid);
  }

  function toggleSubmit(valid) {
    if (valid) {
      bmiSubmit.disabled = false;
      bmiSubmit.style.background = "#1977BE";
      bmiSubmit.style.cursor = "pointer";
    } else {
      bmiSubmit.disabled = true;
      bmiSubmit.style.background = "grey";
      bmiSubmit.style.cursor = "default";
    }
  }

  function clearInputs() {
    bmiInputs.forEach(input => {
      input.value = "";
    });

    // validateInputs();
  }

  const createAnimations = vertOffset => {
    const slideUp = [
      [{ top: "-50%" }, { top: vertOffset }],
      {
        duration: 500,
        easing: "ease-in-out",
        fill: "forwards"
      }
    ];

    const slideDown = [
      [{ top: vertOffset }, { top: "-50%" }],
      {
        duration: 500,
        easing: "ease-in-out",
        fill: "forwards"
      }
    ];

    return [slideUp, slideDown];
  };

  let vertOffset;
  tablet.matches ? (vertOffset = "25%") : (vertOffset = "30%");
  const [slideUp, slideDown] = createAnimations(vertOffset);
  loadEventListeners();
})();
