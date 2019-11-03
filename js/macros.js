const StorageCtrl = (function() {
  function getUsersFromLS() {
    let users = localStorage.getItem("users");
    if (users === null) {
      users = [];
    } else {
      users = JSON.parse(users);
    }

    return users;
  }
  return {
    getUsersFromStorage: function() {
      return getUsersFromLS();
    },
    storeNewUser: function(newUser) {
      let users = getUsersFromLS();

      // Push new user
      users.push(newUser);

      // Set ls
      localStorage.setItem("users", JSON.stringify(users));
    },
    updateUserInStorage: function(updatedUser) {
      let users = getUsersFromLS();
      users.forEach((user, index) => {
        if (user.userId === updatedUser.userId) {
          users.splice(index, 1, updatedUser);
        }
      });
      localStorage.setItem("users", JSON.stringify(users));
    },
    deleteUserFromStorage: function(id) {
      let users = getUsersFromLS();
      users.forEach((user, index) => {
        if (user.userId === id) {
          users.splice(index, 1);
        }
      });

      localStorage.setItem("users", JSON.stringify(users));
    }
  };
})();

// UserCtrl is responsible for managing the users; adding them, updating them, deleting them, clearing them
const UserCtrl = (function() {
  class User {
    constructor(userInfo, userData, id) {
      this.userInfo = userInfo;
      this.userData = userData;
      this.userId = id;
    }
  }

  data = {
    currentUser: null,
    users: []
  };

  return {
    setCurrentUser: function(user) {
      data.currentUser = user;
    },
    createUser: function(userInfo, userData) {
      const id = data.users.length + 1;
      return new User(userInfo, userData, id);
    },
    addNewUser: function(user = data.currentUser) {
      data.users.push(user);
    },
    removeCurrentUser: function() {
      data.currentUser = null;
    },
    deleteUser: function(id) {
      data.users.forEach((user, index) => {
        if (user.userId === id) {
          data.users.splice(index, 1);
        }
      });
      this.removeCurrentUser();
    },
    updateUser: function(updatedUser) {
      data.users.forEach((user, index) => {
        if (user.userId === updatedUser.userId) {
          [user.userInfo, user.userData] = [
            updatedUser.userInfo,
            updatedUser.userData
          ];
        }
      });
    },
    getCurrentUserData: function() {
      return data.currentUser;
    },
    getUserDataById: function(id) {
      for (let i = 0; i < data.users.length; i++) {
        if (data.users[i].userId === id) {
          return data.users[i];
        }
      }
    }
  };
})();

const UICtrl = (function(UserCtrl) {
  const UISelectors = {
    calcBtn: "#calc-btn",
    saveBtn: "#save-btn",
    clearBtn: "#clear-btn",
    deleteBtn: ".delete-btn",
    updateBtn: ".edit-btn",
    cancelBtn: ".cancel-btn",
    tableBody: "#macro-data",
    macroForm: ".macro-input",
    macroOutput: ".macro-output",
    filterInput: "#filter-input",
    filterList: "#user-list",
    formInputs: ".macro-input .form-group input",
    textDataInputs: ".macro-input .form-group .data-input",
    nameInput: "#user-name",
    checkedSexInput: 'input[name="sex"]:checked',
    sexInputs: 'input[name="sex"]',
    ageInput: "#age",
    inchesInput: "#inches",
    feetInput: "#feet",
    weightInput: "#weight",
    freqInput: "#frequency",
    carbsRow: "#carbs-row",
    proteinRow: "#protein-row",
    fatRow: "#fat-row",
    totalCalories: ".calorie-wrap > h4",
    piechart: "#piechart"
  };

  let editState = false;

  function toggleButtons(toggleOn, buttonList) {
    buttonList.forEach(btnSelector => {
      const button = document.querySelector(btnSelector);
      if (toggleOn) {
        button.disabled = false;
        button.classList.replace("disabled-btn", "btn");
      } else {
        button.disabled = true;
        button.classList.replace("btn", "disabled-btn");
      }
    });
  }

  return {
    validateInput: function(e) {
      // Prevent invalid inches input
      const inches = document.querySelector(UISelectors.inchesInput);
      if (inches.value > 11 && e.keyCode !== 46 && e.keyCode !== 8) {
        e.preventDefault();
        inches.value = 0;
        return;
      }

      const inputs = document.querySelectorAll(UISelectors.textDataInputs);
      // Check for blank or negative inputs
      let valid = true;
      inputs.forEach(input => {
        if (input.value === "" || input.value < 0) {
          valid = false;
        }
      });

      // Enable button if valid
      if (editState) {
        ("Toggling update btn...");
        toggleButtons(valid, [UISelectors.updateBtn]);
      } else {
        toggleButtons(valid, [UISelectors.calcBtn]);
      }
    },
    addMacrosToTable: function(userData) {
      const calorieElement = document.querySelector(UISelectors.totalCalories);
      calorieElement.textContent = userData.totalCalories;

      const macrosMap = new Map();

      macrosMap.set("carbs", userData.macroData.carbs);
      macrosMap.set("protein", userData.macroData.protein);
      macrosMap.set("fat", userData.macroData.fat);

      macrosMap.forEach((macroInfo, key) => {
        const row = document.getElementById(key).children;
        [row[1].textContent, row[2].textContent, row[3].textContent] = [
          macroInfo.calories,
          macroInfo.grams,
          `${macroInfo.pct}%`
        ];
      });

      toggleButtons(false, [UISelectors.calcBtn]);
    },
    addUserInfoToForm: function(userInfo) {
      document.querySelector(UISelectors.nameInput).value = userInfo.name;
      document.querySelector(UISelectors.ageInput).value = userInfo.age;
      document.querySelector(UISelectors.feetInput).value = userInfo.feet;
      document.querySelector(UISelectors.inchesInput).value = userInfo.inches;
      document.querySelector(UISelectors.weightInput).value = userInfo.weight;

      let sexInputs = document.querySelectorAll(UISelectors.sexInputs);
      sexInputs.forEach(input => {
        if (input.getAttribute("value") === userInfo.sex) {
          input.checked = true;
        }
      });

      const freqSelect = document.querySelector(UISelectors.freqInput);
      freqSelect.value = userInfo.frequency;

      // Hide calc button and show edit button
    },
    addUserToList: function(currentUserData) {
      userLi = document.createElement("li");
      userLi.textContent = `${currentUserData.userInfo.name}, ${currentUserData.userInfo.sex}, ${currentUserData.userInfo.age}`;
      userLi.classList.add("b-bot");
      userLi.classList.add("user");
      userLi.id = `id-${currentUserData.userId}`;

      userList = document.querySelector(UISelectors.filterList);
      userList.appendChild(userLi);

      toggleButtons(false, [UISelectors.saveBtn, UISelectors.calcBtn]);
    },
    updateUserInList: function(updatedUser, userId) {
      userLis = Array.from(
        document.querySelector(UISelectors.filterList).children
      );

      userLis.forEach(userLi => {
        if (userLi.id === `id-${userId}`) {
          userLi.textContent = `
            ${updatedUser.name}, ${updatedUser.sex},
            ${updatedUser.age}`;
        }
      });
    },
    deleteUserFromList: function(userId) {
      const userLis = Array.from(
        document.querySelector(UISelectors.filterList).children
      );

      userLis.forEach(li => {
        if (li.id === `id-${userId}`) {
          li.remove();
        }
      });
    },
    drawPieChart: function(macroData) {
      let data = google.visualization.arrayToDataTable([
        ["Task", "Hours per Day"],
        ["Carbs", macroData.carbs.calories],
        ["Protein", macroData.protein.calories],
        ["Fat", macroData.fat.calories]
      ]);

      // Optional; add a title and set the width and height of the chart
      let options = {
        title: "Daily Caloric Breakdown",
        width: 300,
        height: 218
      };

      // Display the chart inside the <div> element with id="piechart"
      var chart = new google.visualization.PieChart(
        document.querySelector(UISelectors.piechart)
      );
      chart.draw(data, options);

      toggleButtons(true, [UISelectors.saveBtn, UISelectors.clearBtn]);
    },
    clearAllData: function() {
      // Clear form data
      document.querySelector(".macro-input form").reset();

      // Clear table data
      let tableRows = document.querySelector(UISelectors.tableBody).children;
      for (let j = 0; j < tableRows.length; j++) {
        let tds = tableRows[j].children;
        for (let i = 1; i < tds.length; i++) {
          tds[i].textContent = "";
        }
      }

      // Clear Calories
      calorieElement = document.querySelector(UISelectors.totalCalories);
      calorieElement.textContent = "----";

      // Clear graph
      piechartDiv = document.querySelector(UISelectors.piechart);
      piechart.firstChild.remove();

      // Toggle buttons off
      toggleButtons(false, [
        UISelectors.clearBtn,
        UISelectors.saveBtn,
        UISelectors.calcBtn
      ]);
    },
    showSavedUsers: function() {
      let filterList = document.querySelector(UISelectors.filterList);
      filterList.style.display = "block";
    },
    hideSavedUsers: function() {
      let filterList = document.querySelector(UISelectors.filterList);
      filterList.style.display = "none";
    },
    filterSavedUsers: function() {
      filterInput = document.querySelector(UISelectors.filterInput);
      filterRegex = new RegExp(filterInput.value, "i");

      usersLis = document.querySelector(UISelectors.filterList).children;
      for (let i = 0; i < usersLis.length; i++) {
        let name = usersLis[i].textContent.split(", ")[0];
        if (filterRegex.test(name)) {
          usersLis[i].style.display = "block";
        } else {
          usersLis[i].style.display = "none";
        }
      }
    },
    getSelectors: function() {
      return UISelectors;
    },
    getInputValues: function() {
      return {
        name: document.querySelector(UISelectors.nameInput).value,
        sex: document.querySelector(UISelectors.checkedSexInput).value,
        age: Number(document.querySelector(UISelectors.ageInput).value),
        feet: Number(document.querySelector(UISelectors.feetInput).value),
        inches: Number(document.querySelector(UISelectors.inchesInput).value),
        weight: Number(document.querySelector(UISelectors.weightInput).value),
        frequency: document.querySelector(UISelectors.freqInput).value
      };
    },
    toggleEditState: function() {
      editState = !editState;
      if (editState) {
        ("Entering edit state");
      }
      let updateBtn = document.querySelector(UISelectors.updateBtn);
      let deleteBtn = document.querySelector(UISelectors.deleteBtn);
      let cancelBtn = document.querySelector(UISelectors.cancelBtn);
      let mainButtons = [
        UISelectors.calcBtn,
        UISelectors.clearBtn,
        UISelectors.saveBtn
      ];

      if (editState) {
        mainButtons.forEach(btnSelector => {
          document.querySelector(btnSelector).style.display = "none";
        });
        updateBtn.style.display = "inline-block";
        deleteBtn.style.display = "inline-block";
        cancelBtn.style.display = "inline-block";
      } else {
        mainButtons.forEach(btnSelector => {
          document.querySelector(btnSelector).style.display = "inline-block";
        });
        updateBtn.style.display = "none";
        deleteBtn.style.display = "none";
        cancelBtn.style.display = "none";
      }
    },
    showMessage: function(message, className) {
      let messageDiv = document.createElement("div");
      messageDiv.textContent = message;
      messageDiv.classList.add(className);
      console.log(messageDiv);

      const macroWrap = document.querySelector(UISelectors.filterInput)
        .parentElement.parentElement;

      let macroOutput = document.querySelector(UISelectors.macroOutput);
      macroOutput.insertBefore(messageDiv, macroWrap);

      setTimeout(() => {
        messageDiv.remove();
      }, 2000);
    }
  };
})();

const AppCtrl = (function(StorageCtrl, UICtrl, UserCtrl) {
  [LOW, MODERATE, HIGH] = [1.375, 1.55, 1.725];

  // Load all event listeners
  const loadEventListeners = function() {
    ("Initializing App...");

    // Initializing google charts
    google.charts.load("current", { packages: ["corechart"] });

    // Get Selectors
    const UISelectors = UICtrl.getSelectors();

    document
      .querySelector(UISelectors.filterInput)
      .addEventListener("focus", UICtrl.showSavedUsers);

    // mousedown occurs before blur; blur occurs before click
    document
      .querySelector(UISelectors.filterList)
      .addEventListener("mousedown", displayUser);

    document
      .querySelector(UISelectors.filterInput)
      .addEventListener("blur", UICtrl.hideSavedUsers);

    document
      .querySelector(UISelectors.filterInput)
      .addEventListener("keyup", UICtrl.filterSavedUsers);

    document
      .querySelector(UISelectors.macroForm)
      .addEventListener("input", UICtrl.validateInput);

    document
      .querySelector(UISelectors.calcBtn)
      .addEventListener("click", userCalcSubmit);

    document
      .querySelector(UISelectors.saveBtn)
      .addEventListener("click", userSaveSubmit);

    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", userClearSubmit);

    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", userUpdateSubmit);

    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", userDeleteSubmit);

    document
      .querySelector(UISelectors.cancelBtn)
      .addEventListener("click", userCancelSubmit);
  };

  const userCalcSubmit = function(e) {
    // Is button enabled? No need to check, event won't work if disabled.
    ("Calculate Macros...");

    // Obtain provided info
    const userInfo = UICtrl.getInputValues();

    // Calculate Macro breakdown
    const userData = calculateMacros(userInfo);

    // Show the Macros on UI
    UICtrl.addMacrosToTable(userData);

    // Draw pie chart of calories
    UICtrl.drawPieChart(userData.macroData);

    // Create user (but don't save yet)
    const tempUser = UserCtrl.createUser(userInfo, userData);

    // Set current user
    UserCtrl.setCurrentUser(tempUser);

    e.preventDefault();
  };

  const userSaveSubmit = function(e) {
    ("Save data...");

    // Push new user -- by default it's the current user
    UserCtrl.addNewUser();

    const currentUser = UserCtrl.getCurrentUserData();

    // Add user to the list
    UICtrl.addUserToList(currentUser);

    StorageCtrl.storeNewUser(currentUser);

    e.preventDefault();
  };

  const userClearSubmit = function(e) {
    ("Clearing Data...");

    // Clear input and output data
    UICtrl.clearAllData();

    // Clear currentUser
    UserCtrl.removeCurrentUser();

    e.preventDefault();
  };

  const userUpdateSubmit = function(e) {
    ("Update user...");

    let updatedUser = {};

    // Get current user id
    updatedUser.userId = UserCtrl.getCurrentUserData().userId;

    // Obtain provided info
    updatedUser.userInfo = UICtrl.getInputValues();

    // Calculate Macro breakdown
    updatedUser.userData = calculateMacros(updatedUser.userInfo);

    // Clear the data in the UI
    UICtrl.clearAllData();

    // Update the user's info
    UserCtrl.updateUser(updatedUser);

    // Add new user info back to table
    UICtrl.addUserInfoToForm(updatedUser.userInfo);

    // Show the Macros on UI
    UICtrl.addMacrosToTable(updatedUser.userData);

    // Draw pie chart of calories
    UICtrl.drawPieChart(updatedUser.userData.macroData);

    // Update user in list
    UICtrl.updateUserInList(updatedUser.userInfo, updatedUser.userId);

    UICtrl.toggleEditState();

    // Update in storage
    StorageCtrl.updateUserInStorage(updatedUser);

    // Clear the data
    UICtrl.clearAllData();

    UICtrl.showMessage("Updated user succesfully!", "success");

    // The user being updated is still the current user!
    e.preventDefault();
  };

  const userDeleteSubmit = function(e) {
    if (confirm("Are you sure?")) {
      const currentUserId = UserCtrl.getCurrentUserData().userId;

      // Delete it from the list
      UICtrl.deleteUserFromList(currentUserId);

      // Delete from saved users
      UserCtrl.deleteUser(currentUserId);

      // Delete from storage
      StorageCtrl.deleteUserFromStorage(currentUserId);

      // Clear the data from form
      UICtrl.clearAllData();

      UICtrl.toggleEditState();

      UICtrl.showMessage("Deleted use successfully!", "success");
    }
    e.preventDefault();
  };

  const userCancelSubmit = function(e) {
    UICtrl.toggleEditState();

    e.preventDefault();
  };

  const calculateMacros = function(curInput) {
    // Convert to metric
    const kgWeight = curInput.weight / 2.2046;
    const cmHeight = (curInput.feet * 12 + curInput.inches) * 2.54;

    // Calculate MTB
    let MTB = 10 * kgWeight + 6.25 * cmHeight - 5 * curInput.age;

    // Gender contribution
    if (curInput.sex === "male") MTB += 5;
    else MTB -= 161;

    // Gym Frequency
    switch (curInput.frequency) {
      case "low":
        MTB *= LOW;
        break;
      case "moderate":
        MTB *= MODERATE;
        break;
      case "high":
        MTB *= HIGH;
    }

    // At this point, MTB is the daily caloric goal
    userData = {
      totalCalories: Math.round(MTB),
      macroData: {
        protein: { grams: Math.round(2.2 * kgWeight), calories: 0, pct: 0 },
        fat: { grams: Math.round(1 * kgWeight), calories: 0, pct: 0 },
        carbs: { grams: 0, calories: 0, pct: 0 }
      }
    };

    let macros = userData.macroData;

    macros.protein.calories = macros.protein.grams * 4;
    macros.fat.calories = Math.round(macros.fat.grams * 8.9);

    macros.carbs.calories =
      userData.totalCalories - macros.protein.calories - macros.fat.calories;
    macros.carbs.grams = Math.round(macros.carbs.calories / 4);
    macros.carbs.pct = Math.round(
      (macros.carbs.calories / userData.totalCalories) * 100
    );
    macros.protein.pct = Math.round(
      (macros.protein.calories / userData.totalCalories) * 100
    );
    macros.fat.pct = Math.round(
      (macros.fat.calories / userData.totalCalories) * 100
    );

    return userData;
  };

  const displayUser = function(e) {
    if (e.target.classList.contains("user")) {
      const userId = e.target.id.split("-")[1];
      const user = UserCtrl.getUserDataById(Number(userId));

      // Add User info to form
      UICtrl.addUserInfoToForm(user.userInfo);

      // Add user macros to table
      UICtrl.addMacrosToTable(user.userData);

      // Draw pie chart of calories
      UICtrl.drawPieChart(user.userData.macroData);

      // Set current user
      UserCtrl.setCurrentUser(user);

      // Show edit state
      UICtrl.toggleEditState();
    }
  };

  return {
    init: function() {
      loadEventListeners();

      // Get users from storage
      const users = StorageCtrl.getUsersFromStorage();

      users.forEach(user => {
        // Add new user
        UserCtrl.addNewUser(user);

        // Display new user in filter list
        UICtrl.addUserToList(user);
      });
    }
  };
})(StorageCtrl, UICtrl, UserCtrl);

AppCtrl.init();
