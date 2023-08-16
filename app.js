// ****** select items **********

//form: This variable holds a reference to the form element with the class name "grocery-form". 
//The form element is used to allow users to input new grocery items.
const form = document.querySelector(".grocery-form");

//alert: This variable holds a reference to an element with the class name "alert". 
//It's likely used to display alert messages to the user in response to different actions or inputs.
const alert = document.querySelector(".alert");

//grocery: This variable holds a reference to an input element with the ID "grocery". 
//This input field is where users can enter the name of a new grocery item.
const grocery = document.getElementById("grocery");

//submitBtn: This variable holds a reference to a button element with the class name "submit-btn". 
//This button is used to submit the form after entering a new grocery item.
const submitBtn = document.querySelector(".submit-btn");

//container: This variable holds a reference to an element with the class name "grocery-container". 
//This likely represents the container that holds the entire grocery list interface.
const container = document.querySelector(".grocery-container");

//list: This variable holds a reference to an element with the class name "grocery-list". 
//This is the container where individual grocery list items are displayed.
const list = document.querySelector(".grocery-list");

//clearBtn: This variable holds a reference to a button element with the class name "clear-btn". 
//This button is used to clear the entire grocery list.
const clearBtn = document.querySelector(".clear-btn");
// edit option
let editElement;
let editFlag = false;
let editID = "";
// ****** event listeners **********

// submit form
form.addEventListener("submit", addItem);
// clear list
clearBtn.addEventListener("click", clearItems);
// display items onload
window.addEventListener("DOMContentLoaded", setupItems);

// ****** functions **********

// add item
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();

  if (value !== "" && !editFlag) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
    // add event listeners to both buttons;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    // append child
    list.appendChild(element);
    // display alert
    displayAlert("item added to the list", "success");
    // show container
    container.classList.add("show-container");
    // set local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");

    // edit  local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  }
}
// display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// clear items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

// delete item

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");

  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}
// edit item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  //
  submitBtn.textContent = "edit";
}
// set backt to defaults
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// ****** local storage **********

// add to local storage
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}
//getLocalStorage(): This function retrieves the current list of items from the local storage. 
//It checks if the "list" key exists in local storage, and if it does, 
//it parses the stored JSON data to return an array of items. If the key doesn't exist, it returns an empty array.
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
//removeFromLocalStorage(id): This function removes an item from the local storage based on the provided id. 
//It retrieves the current list of items from local storage using the getLocalStorage function, 
//filters out the item with the specified id, and updates the local storage with the filtered array.
function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("list", JSON.stringify(items));
}
//editLocalStorage(id, value): This function is used to edit the value of an item in the local storage. 
//It takes an id and a new value as parameters. It retrieves the current list of items from local storage using 
//the getLocalStorage function, iterates through the items, and if an item with the specified id is found, it updates its value.
// Finally, it updates the local storage with the modified array.
function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// SETUP LOCALSTORAGE.REMOVEITEM('LIST');

// ****** setup items **********
//setupItems(): This function is responsible for setting up the list of items in your grocery list interface. 
//It retrieves the current list of items from the local storage using the getLocalStorage function
function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

//createListItem(id, value): This function is used to create an individual list item element for each grocery item. 
//It creates an article element, sets a custom data-id attribute with the id value, 
//adds the "grocery-item" class, and sets the inner HTML of the element to include the item's value 
//and buttons for editing and deleting the item. Event listeners are attached to the edit and delete buttons 
//to handle user interactions.

//The edit-btn button triggers the editItem function when clicked.
//The delete-btn button triggers the deleteItem function when clicked.
//The created article element with the item's details and buttons is then appended to the list element, 
//which is presumably the container for all the grocery list items.
function createListItem(id, value) {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
  // add event listeners to both buttons;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  // append child
  list.appendChild(element);
}
