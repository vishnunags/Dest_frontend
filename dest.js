document.addEventListener('DOMContentLoaded', function () {
    const destinationsContainer = document.getElementById('destinations');
    const addDestinationBtn = document.getElementById('add-destination-btn');
    const addDestinationForm = document.getElementById('add-destination-form');
    const submitDestinationBtn = document.getElementById('submit-destination');
    const formModal = document.getElementById('form-modal');
    const formCloseBtn = document.querySelector('.close');

    // Fetch destinations from the backend
    function fetchDestinations() {
        fetch('http://ec2-34-205-29-69.compute-1.amazonaws.com:9002/api/destinations')
            .then(response => response.json())
            .then(destinations => {
                destinationsContainer.innerHTML = ''; // Clear current destinations
                destinations.forEach(destination => {
                    const destinationDiv = document.createElement('div');
                    destinationDiv.classList.add('destination');
                    
                    destinationDiv.innerHTML = `
                        <h3>${destination.name}</h3>
                        <img src="${destination.image}" alt="${destination.name}" />
                        <button class="interested-btn" data-id="${destination.id}">Interested</button>
                    `;
                    
                    destinationsContainer.appendChild(destinationDiv);
                });

                // Add event listeners to "Interested" buttons
                document.querySelectorAll('.interested-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        const destinationId = this.getAttribute('data-id');
                        showForm(destinationId);
                    });
                });
            })
            .catch(error => console.error('Error fetching destinations:', error));
    }

    fetchDestinations(); // Initial fetch

    // Show the add destination form
    addDestinationBtn.addEventListener('click', function () {
        addDestinationForm.style.display = 'block';
    });

    // Handle form submission
    submitDestinationBtn.addEventListener('click', function () {
        const name = document.getElementById('name').value;
        const image = document.getElementById('image').value;

        fetch('http://ec2-34-205-29-69.compute-1.amazonaws.com:9002/api/destinations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, image })
        })
        .then(response => response.json())
        .then(data => {
            alert('Destination added successfully!');
            addDestinationForm.style.display = 'none';
            fetchDestinations(); // Refresh the destination list
        })
        .catch(error => console.error('Error adding destination:', error));
    });

    // Show the form modal
    function showForm(destinationId) {
        formModal.style.display = 'block';

        const applyButton = formModal.querySelector('button');
        const form = formModal.querySelector('form');

        applyButton.onclick = function () {
            const name = form.querySelector('input[name="name"]').value;
            const phone = form.querySelector('input[name="phone"]').value;
            const email = form.querySelector('input[name="email"]').value;

            // Send form data to the backend
            fetch('http://ec2-34-205-29-69.compute-1.amazonaws.com:9002/api/interested', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, phone, email, destinationId })
            })
            .then(response => response.json())
            .then(data => {
                alert('Thank you for your interest!');
                formModal.style.display = 'none';
            })
            .catch(error => console.error('Error submitting form:', error));
        };
    }

    // Close the form modal
    formCloseBtn.onclick = function () {
        formModal.style.display = 'none';
    };
});
