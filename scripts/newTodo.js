document.addEventListener('DOMContentLoaded', function () {
    // Fetch users from the API
    fetch('/api/users')
        .then(response => response.json())
        .then(data => {
            // Get the select element
            const select = document.getElementById('assignee-select');

            // Populate the select element with options for each user
            data.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.username;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching users:', error));

    // Fetch users from the API
    fetch('/api/categories')
        .then(response => response.json())
        .then(categories => {
            // Get the select element
            const select = document.getElementById('newTodoCategory');

            // Populate the select element with options for each user
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = category.name;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching users:', error));

    // Form submission event listener
    document.getElementById('todo-form').addEventListener('submit', function (event) {
        event.preventDefault();

        // Get the task description and selected user id
        const assigneeId = document.getElementById('assignee-select').value;
        const taskDescription = document.getElementById('newTodoDescription').value;
        const taskCategory = document.getElementById('newTodoCategory').value;
        const taskDeadline = document.getElementById('newTodoDeadline').value;
        const taskPriority = document.getElementById('newTodoPriority').value;

        // Create the request body
        const requestBody = {
            userid: assigneeId,
            category: taskCategory,
            description: taskDescription,
            deadline: taskDeadline,
            priority: taskPriority,
        };

        // Send a POST request to create a new ToDo
        fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(newTodo => {
                console.log('New ToDo created:', newTodo);
                document.getElementById('success-message').style.display = 'block'; // Show success message
                setTimeout(() => {
                    document.getElementById('success-message').style.display = 'none'; // Hide success message after 5 seconds
                    location.reload(); // Reload the page after the success message has been displayed
                }, 3000);
            })
            .catch(error => console.error('Error adding ToDo:', error));
    });
});