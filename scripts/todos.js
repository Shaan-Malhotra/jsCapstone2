console.log("worked");

/* var checkIcon = document.createElement('span');
checkIcon.classList.add('bi', 'bi-check');

// Create an x icon element
var xIcon = document.createElement('span');
xIcon.classList.add('bi', 'bi-x');
// Append the icons to a container element in your HTML
var container = document.getElementById('icon-container');
container.appendChild(checkIcon.cloneNode(true));
container.appendChild(xIcon.cloneNode(true));
*/

document.addEventListener("DOMContentLoaded", function () {
    // Fetch registered users and populate dropdown
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
                    //  document.getElementById("icon-container").appendChild(checkSvg);

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
                    // document.getElementById("icon-container").appendChild(xSvg);

                    var completedIcon = todo.completed ? checkSvg.outerHTML : xSvg.outerHTML;
                    


                    // iconContainer.innerHTML = completedIcon;

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
                                    <button class="complete-button btn btn-primary" style="display: none;" data-todo-id="${todo.id}">Mark as Complete</button>
                                    <button class="incomplete-button btn btn-primary" style="display: none;" data-todo-id="${todo.id}">Mark as Incomplete</button>
                                </div>
                            </div>
                        </div>
                    `;

                    cardBody.innerHTML = cardContent;
                    card.appendChild(cardBody);
                    todoList.appendChild(card);
                    console.log(todo.completed);
                    if (!todo.completed) {
                        const completeButton = card.querySelector('.complete-button');
                        completeButton.style.display = 'block';
                        completeButton.addEventListener('click', function() {
                            markAsComplete(todo.id);
                        });
                    }
                    else {
                        const incompleteButton = card.querySelector('.incomplete-button');
                        incompleteButton.style.display = 'block';
                        incompleteButton.addEventListener('click', function() {
                            markAsIncomplete(todo.id);
                        });
                    }
                    
                });
            }
        })
        .catch(error => console.error("Error fetching user todos:", error));
}
function markAsComplete(id) {
    fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            completed: true // Set completed to true to mark as complete
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to mark todo as complete');
        }
        // Assuming fetchUserTodos fetches updated todo list from server
        location.reload();
        alert("item marked as complete")
    })
    .catch(error => console.error("Error marking todo as complete:", error));
}
function markAsIncomplete(id) {
    fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            completed: false // Set completed to true to mark as complete
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to mark todo as incomplete');
        }
        // Assuming fetchUserTodos fetches updated todo list from server
        location.reload();
        alert("item marked as incomplete")
    })
    .catch(error => console.error("Error marking todo as incomplete:", error));
}
