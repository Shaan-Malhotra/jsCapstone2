document.addEventListener('DOMContentLoaded', function () {
    populateUsers();
    document.getElementById("deleteForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the form from submitting normally

        var username = document.getElementById("username").value;

        // Call the deleteUser function with the username as parameter
        deleteUser(username);
    });
});

function populateUsers() {
    fetch('/api/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then(users => {
            const select = document.getElementById("username");
            users.forEach(user => {
                const option = document.createElement("option");
                option.value = user.username; // Assuming username is the unique identifier
                option.text = user.username; // Display username in the dropdown
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            // Optionally, you can display an error message or perform any other action
        });
}

function deleteUser(username) {
    fetch('/api/users/' + username, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // If the response is successful, parse the JSON
            } else if (response.status === 404) {
                throw new Error('User not found'); // If user not found, throw an error
            } else {
                throw new Error('Failed to delete user'); // If other error occurs, throw an error
            }
        })
        .then(deletedUser => {
            console.log('User deleted:', deletedUser);
            // Optionally, display a success message or perform other actions
            document.getElementById('success-message').style.display = 'block'; // Show success message
            setTimeout(() => {
                document.getElementById('success-message').style.display = 'none'; // Hide success message after 5 seconds
                location.reload(); // Reload the page after the success message has been displayed
            }, 3000);
        })
        .catch(error => {
            console.error('Error deleting user:', error.message);
            // Optionally, display an error message or perform other actions
        });
}

