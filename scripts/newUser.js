document.getElementById('register-form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get user input
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('passwordConfirm').value;

    // Password validation
    if (password !== confirmPassword) {
        document.getElementById('password-error').textContent = "Passwords do not match";
        return;
    } else {
        document.getElementById('password-error').textContent = "";
    }

    // Create request body
    const requestBody = {
        name: name,
        username: username,
        password: password
    };

    // Clear error message on username change
    document.getElementById('username').addEventListener('input', function () {
        document.getElementById('username-error').textContent = '';
    });

    // Send POST request to add user
    fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (response.status === 403) {
                throw new Error('Username already in use');
            } else if (!response.ok) {
                throw new Error('Failed to register user');
            }


            return response.json();
        })
        .then(newUser => {
            console.log('New user added:', newUser);
            document.getElementById('success-message').style.display = 'block'; // Show success message
            setTimeout(() => {
                document.getElementById('success-message').style.display = 'none'; // Hide success message after 5 seconds
                location.reload(); // Reload the page after the success message has been displayed
            }, 3000);
        })

        .catch(error => {
            console.error('Error registering user:', error);
            document.getElementById('username-error').textContent = error.message;
        });

});