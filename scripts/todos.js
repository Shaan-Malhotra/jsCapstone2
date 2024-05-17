document.addEventListener("DOMContentLoaded", function () {
    fetchUsers();

    // Add event listener to dropdown
    document.getElementById("usersDropdown").addEventListener("change", function () {
        var userId = this.value;
        if (userId !== "") {
            fetchUserTodos(userId);
        } else {
            document.getElementById("todoList").innerHTML = ""; // Clear todo list if no user selected
        }
    });

});
// Fetch registered users and populate dropdown
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
//fetch user todos and display as boostrap cards
function fetchUserTodos(userId) {
    fetch(`/api/todos/byuser/${userId}`)
        .then(response => response.json())
        .then(todos => {
            var todoList = document.getElementById("todoList");
            // Clear todo list
            todoList.innerHTML = "";
            if (todos.length === 0) {
                todoList.innerHTML = "<p class='text-muted'>No ToDo tasks found for this user.</p>";
            } else {
                todos.forEach(todo => {
                    // Create a Bootstrap card for each todo task
                    var card = document.createElement("div");
                    card.classList.add("col");
                    var cardBody = document.createElement("div");
                    cardBody.classList.add("card");
                    cardBody.classList.add("slideInBottom");

                    // Conditional to get each todos status
                    const deadlineDate = new Date(todo.deadline);
                    const currentDate = new Date();
                    todo.status = '';
                    if (deadlineDate < currentDate && !todo.completed) {
                        console.log(deadlineDate);
                        console.log(currentDate);
                        todo.status = "Overdue";
                    }
                    else if (todo.completed) {
                        todo.status = "Completed";
                    }
                    else {
                        todo.status = "In Progress";
                    }

                    // change card color based on todo status
                    var backgroundColor = '';
                    if (todo.completed) {
                        backgroundColor = 'lightgreen';
                    } else if (todo.status === "In Progress") {
                        backgroundColor = 'lightyellow';
                    } else {
                        backgroundColor = 'hsl(0, 70%, 80%)';
                    }

                    // Set background color of card
                    cardBody.style.backgroundColor = backgroundColor;

                    // create check icon
                    const checkSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    checkSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    checkSvg.setAttribute("width", "25");
                    checkSvg.setAttribute("height", "25");
                    checkSvg.setAttribute("fill", "green");
                    checkSvg.setAttribute("class", "bi bi-check");
                    checkSvg.setAttribute("viewBox", "0 0 16 16");
                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("d", "M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425");
                    checkSvg.appendChild(path);

                    // create x icon
                    const xSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    xSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    xSvg.setAttribute("width", "25");
                    xSvg.setAttribute("height", "25");
                    xSvg.setAttribute("fill", "red");
                    xSvg.setAttribute("class", "bi bi-x");
                    xSvg.setAttribute("viewBox", "0 0 16 16");
                    const xPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    xPath.setAttribute("d", "M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708");
                    xSvg.appendChild(xPath);

                    // set icon equal to bootstrap check or x icon baased on the corresponding true or false value
                    var completedIcon = todo.completed ? checkSvg.outerHTML : xSvg.outerHTML;

                    // create card content
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
                                    <p><strong>Completed:</strong> ${completedIcon}</p>
                                    <p><strong>Status:</strong> ${todo.status}</p>
                                    <button class="complete-button btn btn-primary" style="display: none;" data-todo-id="${todo.id}">Mark as Complete</button>
                                    <button class="incomplete-button btn btn-primary" style="display: none;" data-todo-id="${todo.id}">Mark as Incomplete</button>
                                </div>
                            </div>
                        </div>
                    `;

                    cardBody.innerHTML = cardContent;
                    card.appendChild(cardBody);
                    todoList.appendChild(card);

                    // condtional to display either the mark as complete or mark as incomplete button
                    if (!todo.completed) {
                        const completeButton = card.querySelector('.complete-button');
                        completeButton.style.display = 'block';
                        completeButton.addEventListener('click', function () {
                            markAsComplete(todo.id);
                        });
                    }
                    else {
                        const incompleteButton = card.querySelector('.incomplete-button');
                        incompleteButton.style.display = 'block';
                        incompleteButton.addEventListener('click', function () {
                            markAsIncomplete(todo.id);
                        });
                    }

                });
            }
        })
        .catch(error => console.error("Error fetching user todos:", error));
}

// function to mark an item as complete in the API
function markAsComplete(id) {
    fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            completed: true
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to mark todo as complete');
            }
            document.getElementById('success-message').style.display = 'block'; // Show success message
            setTimeout(() => {
                document.getElementById('success-message').style.display = 'none'; // Hide success message after 5 seconds
                location.reload(); // Reload the page after the success message has been displayed
            }, 2000);
        })
        .catch(error => console.error("Error marking todo as complete:", error));
}

// function to mark as incomplete
function markAsIncomplete(id) {
    fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            completed: false
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to mark todo as incomplete');
            }
            document.getElementById('success-message').style.display = 'block'; // Show success message
            setTimeout(() => {
                document.getElementById('success-message').style.display = 'none'; // Hide success message after 5 seconds
                location.reload(); // Reload the page after the success message has been displayed
            }, 2000);
        })
        .catch(error => console.error("Error marking todo as incomplete:", error));
}
