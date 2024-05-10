console.log("worked");
var checkIcon = document.createElement('span');
checkIcon.classList.add('bi', 'bi-check');

// Create an x icon element
var xIcon = document.createElement('span');
xIcon.classList.add('bi', 'bi-x');

// Append the icons to a container element in your HTML
var container = document.getElementById('icon-container');
container.appendChild(checkIcon.cloneNode(true));
container.appendChild(xIcon.cloneNode(true));


document.addEventListener("DOMContentLoaded", function() {
    // Fetch registered users and populate dropdown
    fetchUsers();

    // Add event listener to dropdown
    document.getElementById("usersDropdown").addEventListener("change", function() {
        var userId = this.value;
        if (userId !== "") {
            fetchUserTodos(userId);
        } else {
            document.getElementById("todoList").innerHTML = ""; // Clear todo list if no user selected
        }
    });
});     

function fetchUsers() {
    fetch("/api/users")
    .then(response => response.json())
    .then(data => {
        var dropdown = document.getElementById("usersDropdown");
        dropdown.innerHTML = "<option value=''>Select User</option>"; // Reset dropdown
        data.forEach(user => {
            dropdown.innerHTML += `<option value="${user.id}">${user.username}</option>`;
        });
    })
    .catch(error => console.error("Error fetching users:", error));
}

function fetchUserTodos(userId) {
    fetch(`/api/todos/byuser/${userId}`)
    .then(response => response.json())
    .then(todos => {
        var todoList = document.getElementById("todoList");
        todoList.innerHTML = ""; // Clear todo list
        if (todos.length === 0) {
            todoList.innerHTML = "<p class='text-muted'>No ToDo tasks found for this user.</p>";
        } else {
            todos.forEach(todo => {
                // Create a Bootstrap card for each todo task
                var card = document.createElement("div");
                card.classList.add("col");

                var cardBody = document.createElement("div");
                cardBody.classList.add("card");

                console.log("Completed:", todo.completed);
                

                var cardContent = `
                    <div class="card-body">
                        <h5 class="card-title">${todo.description}</h5>
                        <a href="#" class="details-link btn btn-link" data-bs-toggle="collapse" data-bs-target="#todoDetailsCollapse${todo.id}" aria-expanded="false" aria-controls="todoDetailsCollapse${todo.id}">
                            Details
                        </a>
                        <div class="collapse" id="todoDetailsCollapse${todo.id}">
                            <div class="mt-3">
                                <p><strong>Category:</strong> ${todo.category}</p>
                                <p><strong>Deadline:</strong> ${todo.deadline}</p>
                                <p><strong>Priority:</strong> ${todo.priority}</p>
                                <p><strong>Completed:</strong> ${todo.completed}</p>
                            </div>
                        </div>
                    </div>
                `;

                cardBody.innerHTML = cardContent;
                card.appendChild(cardBody);
                todoList.appendChild(card);
            });
        }
    })
    .catch(error => console.error("Error fetching user todos:", error));
}
  