// function saveCard() {
//     const title = document.getElementById('titleInput').value.trim();
//     const description = document.getElementById('descInput').value.trim();
//     const quillEditor = document.querySelector('.ql-editor');
//     let content = quillEditor.innerHTML.trim();
//     const imageFile = document.getElementById('fileElem').files[0];
//     const category = document.querySelector('input[name="blogType"]:checked')?.value;

//     // Sanitize the content by removing empty tags (optional but can help)
//     content = content.replace(/<p><br><\/p>/g, '').trim(); // Remove empty paragraphs

//     if (!title || !description || !content || !imageFile || !category) {
//         alert("Please fill all fields, select an image, and choose a category.");
//         return;
//     }

//     const reader = new FileReader();
//     reader.readAsDataURL(imageFile);
//     reader.onloadend = function () {
//         const imageData = reader.result;

//         const card = {
//             title: title,
//             description: description,
//             content: content,
//             image: imageData,
//             category: category
//         };

//         const cards = JSON.parse(localStorage.getItem('cards')) || [];
//         cards.push(card);
//         localStorage.setItem('cards', JSON.stringify(cards));

//         alert("Card added successfully!");
//         window.location.href = 'card.html';
//     };
// }
function saveCard() {
    const title = document.getElementById('titleInput').value.trim();
    const description = document.getElementById('descInput').value.trim();
    const quillEditor = document.querySelector('.ql-editor');
    let content = quillEditor.innerHTML.trim();
    const imageFile = document.getElementById('fileElem').files[0];
    const category = document.querySelector('input[name="blogType"]:checked')?.value;

    content = content.replace(/<p><br><\/p>/g, '').trim();

    if (!title || !description || !content || !imageFile || !category) {
        alert("Please fill all fields, select an image, and choose a category.");
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('image', imageFile);

    fetch('http://localhost:3000/createPost', {  
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert("Post created successfully!");
            window.location.href = 'card.html';
        } else {
            alert("Failed to create post.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error occurred while creating post.");
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('http://localhost:3000/getPosts');
      const posts = await response.json();
      
      const cardsContainer = document.getElementById('cardsContainer');
      cardsContainer.innerHTML = ''; // Clear any previous content

      if (posts.length === 0) {
        const noCardsMessage = document.createElement('p');
        noCardsMessage.textContent = "No cards available.";
        cardsContainer.appendChild(noCardsMessage);
        return;
      }

      // Loop through posts and create cards
      posts.forEach(post => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';

        const img = document.createElement('img');
        img.src = `data:image/jpeg;base64,${post.image}`;
        img.alt = 'Card Image';

        const title = document.createElement('h3');
        title.textContent = post.title;

        const desc = document.createElement('p');
        desc.textContent = post.description;

        const viewButton = document.createElement('button');
        viewButton.textContent = 'View Details';
        viewButton.addEventListener('click', () => {
          // Store post ID in localStorage or pass it via query parameters
          window.location.href = `content.html?id=${post._id}`;
        });

        cardDiv.appendChild(img);
        cardDiv.appendChild(title);
        cardDiv.appendChild(desc);
        cardDiv.appendChild(viewButton);

        cardsContainer.appendChild(cardDiv);
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  });





