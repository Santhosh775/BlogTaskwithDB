/*drag and drop image upload*/
const dropArea = document.getElementById('drop-area');
const gallery = document.getElementById('gallery');
const errorMsg = document.createElement('p'); 
errorMsg.style.color = 'red';
errorMsg.style.display = 'none'; 
dropArea.parentNode.insertBefore(errorMsg, gallery); 

const MAX_FILE_SIZE_MB = 5; 
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; 

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.classList.add('highlight');
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.classList.remove('highlight');
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFiles(files) {
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';

    const fileArray = [...files];
    fileArray.forEach(file => {
        if (file.size > MAX_FILE_SIZE_BYTES) {
            // Show an error message if the file exceeds 5MB
            errorMsg.textContent = `Error: larger than ${MAX_FILE_SIZE_MB}MB.`;
            errorMsg.style.display = 'block';
        } else {
            saveImageToLocalStorage(file);
            displayFileName(file);
            updateFileInput(file);  // Update the file input element here
        }
    });
}

// Update the hidden file input with the selected file (manually for drag-and-drop)
function updateFileInput(file) {
    const dataTransfer = new DataTransfer();  
    dataTransfer.items.add(file);
    document.getElementById('fileElem').files = dataTransfer.files;
}


// Function to save the image to local storage
function saveImageToLocalStorage(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Convert image to base64 format
    reader.onloadend = function () {
        const base64Image = reader.result;
        // Store the image in local storage with the filename as the key
        localStorage.setItem(file.name, base64Image);
        console.log(`Image ${file.name} saved to local storage.`);
    }
}

// Function to display the file name in the gallery
function displayFileName(file) {
    gallery.innerHTML = `<p>File: ${file.name}</p>`;
}

// Optional: Button to retrieve and use the stored image (for another page)
function getImageFromLocalStorage(fileName) {
    const storedImage = localStorage.getItem(fileName);
    if (storedImage) {
        console.log(`Image retrieved: ${fileName}`);
        // Use the stored image as needed in another page (e.g., display it)
        return storedImage;
    } else {
        console.error(`No image found for the filename: ${fileName}`);
        return null;
    }
}

const titleInput = document.getElementById('titleInput');
const descInput = document.getElementById('descInput');
const countDisplay = document.getElementById('count');
const titleError = document.getElementById('titleError');

titleInput.addEventListener('input', function () {
    const currentLength = titleInput.value.trim().length;
    countDisplay.textContent = `${currentLength}/50`; 

    // Title validation
    if (currentLength > 50) {
        titleError.textContent = 'Title must be less than 50 characters.';
    } else {
        titleError.textContent = '';
    }
});

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // Text formatting
    ['blockquote', 'code-block'],                     // Block quotes, code
    [{ 'header': 1 }, { 'header': 2 }],               // Headers
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],    // Lists
    [{ 'script': 'sub' }, { 'script': 'super' }],     // Subscript/superscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],         // Indentation
    [{ 'direction': 'rtl' }],                         // Text direction
    [{ 'size': ['small', false, 'large', 'huge'] }],  // Font size
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],        // Header formatting
    [{ 'color': [] }, { 'background': [] }],          // Text color and background color
    [{ 'align': [] }],                                // Text alignment
    ['link', 'image', 'video'],                       // Media (links, images, videos)
    ['clean']                                         // Remove formatting
  ];

  const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: toolbarOptions
    }
  });

function showCards() {
    window.location.href = 'card.html'; // Redirect to card.html
}

document.addEventListener('DOMContentLoaded', function () {
    const cardsTableBody = document.querySelector('#cardsTable tbody');
    const cards = JSON.parse(localStorage.getItem('cards')) || [];

    // Function to display cards in table format
    function displayCards() {
        cardsTableBody.innerHTML = ''; // Clear existing rows

        if (cards.length === 0) {
            const noCardsRow = document.createElement('tr');
            const noCardsCell = document.createElement('td');
            noCardsCell.colSpan = 4;
            noCardsCell.textContent = "No cards available.";
            noCardsRow.appendChild(noCardsCell);
            cardsTableBody.appendChild(noCardsRow);
            return;
        }

        cards.forEach((card, index) => {
            const row = document.createElement('tr');

            // Title cell
            const titleCell = document.createElement('td');
            titleCell.textContent = card.title;
            row.appendChild(titleCell);

            // Description cell
            const descCell = document.createElement('td');
            descCell.textContent = card.description;
            row.appendChild(descCell);

            // Actions cell
            const actionsCell = document.createElement('td');

           // Edit button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit'); // Add the 'edit' class
            editButton.onclick = function () {
                editCard(index);
            };

            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete'); // Add the 'delete' class
            deleteButton.onclick = function () {
                deleteCard(index);
            };


            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);

            cardsTableBody.appendChild(row);
        });
    }

    // Function to delete a card
    function deleteCard(index) {
        cards.splice(index, 1); // Remove the card from the array
        localStorage.setItem('cards', JSON.stringify(cards)); // Update localStorage
        displayCards(); // Refresh the table
    }

    // Function to edit a card
    function editCard(index) {
        const card = cards[index];
        // Fill in the form inputs with the card details (you can customize this according to your form)
        document.getElementById('titleInput').value = card.title;
        document.getElementById('descInput').value = card.description;


        // Quill editor update (if you're using Quill)
        const quillEditor = document.querySelector('.ql-editor');
        quillEditor.innerHTML = card.content;

        // After editing, update the card
        document.querySelector('form').onsubmit = function (event) {
            event.preventDefault();
            card.title = document.getElementById('titleInput').value.trim();
            card.description = document.getElementById('descInput').value.trim();
            card.content = quillEditor.innerHTML.trim();

            // Save the updated card
            cards[index] = card;
            localStorage.setItem('cards', JSON.stringify(cards));
            displayCards(); // Refresh the table
        };
    }

    // Initially display the cards
    displayCards();
});
