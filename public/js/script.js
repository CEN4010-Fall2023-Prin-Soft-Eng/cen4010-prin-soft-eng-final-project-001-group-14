// script.js

// DOM
const swiper = document.querySelector('#swiper');
const like = document.querySelector('#like');
const dislike = document.querySelector('#dislike');

// constants
const apiUrl = 'https://api.petfinder.com/v2'; // Update this URL based on your API endpoint

async function fetchDogData(zip, radius, set) {
  try {
    // Construct the API URL with user input
    const url = `${apiUrl}?zip_code=${zip}&radius=${radius}&set=${set}`;

    const response = await fetch(url);
    const data = await response.json();

    // Check if there is data
    if (data.length > 0) {
      // Display the first dog's information on the card
      const card = new Card({
        imageUrl: data[0].photoURL,
        onDismiss: () => {
          // Call fetchDogData again with the next set when the card is dismissed
          fetchDogData(zip, radius, parseInt(set) + 1);
        },
        onLike: () => {
          like.style.animationPlayState = 'running';
          like.classList.toggle('trigger');
        },
        onDislike: () => {
          dislike.style.animationPlayState = 'running';
          dislike.classList.toggle('trigger');
        }
      });

      // Update dog information inside the card
      const dogInfo = card.element.querySelector('.dog-info');
      dogInfo.querySelector('.dog-name').textContent = data[0].name;
      dogInfo.querySelector('.dog-age').textContent = `Age: ${data[0].age}`;
      dogInfo.querySelector('.dog-description').textContent = data[0].description;

      swiper.append(card.element);
    } else {
      // Handle case when no dogs are returned
      console.log('No dogs found.');
    }
  } catch (error) {
    console.error('Error fetching dog data:', error);
  }
}

// Attach fetchDogData function to the form submission
document.getElementById('pet-form').addEventListener('submit', function (event) {
  event.preventDefault();
  
  // Get user input from the form
  const zip = document.getElementById('zip').value;
  const radius = document.getElementById('radius').value;
  const set = document.getElementById('set').value;

  // Call fetchDogData with user input
  fetchDogData(zip, radius, set);
});
