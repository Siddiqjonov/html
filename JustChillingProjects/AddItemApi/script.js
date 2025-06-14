let skip = 0;
let take = 5;
let totalItems = 0;
let allTasks = [];
const today = new Date('2025-04-27');

function showLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'block';
}

function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

async function addToDoItem() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;

    if (!title || !description || !dueDate) {
        document.getElementById('responseMessage').innerText = 'Please fill in all fields.';
        return;
    }

    const toDoItem = {
        title: title,
        description: description,
        dueDate: dueDate
    };

    try {
        showLoadingSpinner();
        const response = await fetch('https://localhost:7149/api/toDoItem/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(toDoItem)
        });

        if (response.ok) {
            document.getElementById('responseMessage').innerText = 'Task added successfully!';
            showToast('Task added successfully!');
            clearAddForm();
            await fetchTasks();
            const newTask = allTasks[allTasks.length - 1];
            if (newTask) {
                autoFillUpdateForm(newTask);
            }
        } else {
            const errorText = await response.text();
            document.getElementById('responseMessage').innerText = `Failed to add task: ${errorText}`;
            showToast('Failed to add task: ' + errorText, 'error');
        }
    } catch (error) {
        document.getElementById('responseMessage').innerText = 'Error: ' + error.message;
        showToast('Error adding task: ' + error.message, 'error');
    } finally {
        hideLoadingSpinner();
    }
}

async function fetchTasks() {
    take = parseInt(document.getElementById('take').value) || 5;
    try {
        showLoadingSpinner();
        const response = await fetch(`https://localhost:7149/api/toDoItem/getAll?skip=${skip}&take=${take}`);
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        
        allTasks = data.items || data;
        totalItems = data.totalCount || allTasks.length;

        filterTasks();
        updatePagination();
    } catch (error) {
        document.getElementById('taskList').innerHTML = `<p>Error: ${error.message}</p>`;
        showToast('Error fetching tasks: ' + error.message, 'error');
    } finally {
        hideLoadingSpinner();
    }
}

async function updateTask() {
    const id = parseInt(document.getElementById('updateId').value);
    const title = document.getElementById('updateTitle').value;
    const description = document.getElementById('updateDescription').value;
    const isCompleted = document.getElementById('updateIsCompleted').checked;
    const dueDate = document.getElementById('updateDueDate').value;

    if (!id || !title || !description || !dueDate) {
        document.getElementById('updateResponseMessage').innerText = 'Please fill in all fields.';
        return;
    }

    const updatedItem = {
        id: id,
        title: title,
        description: description,
        isCompleted: isCompleted,
        dueDate: dueDate
    };

    try {
        showLoadingSpinner();
        const response = await fetch('https://localhost:7149/api/toDoItem/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItem)
        });

        if (response.ok) {
            document.getElementById('updateResponseMessage').innerText = 'Task updated successfully!';
            showToast('Task updated successfully!');
            clearUpdateForm();
            fetchTasks();
        } else {
            const errorText = await response.text();
            document.getElementById('updateResponseMessage').innerText = `Failed to update task: ${errorText}`;
            showToast('Failed to update task: ' + errorText, 'error');
        }
    } catch (error) {
        document.getElementById('updateResponseMessage').innerText = 'Error: ' + error.message;
        showToast('Error updating task: ' + error.message, 'error');
    } finally {
        hideLoadingSpinner();
    }
}

async function deleteTask(id) {
    try {
        showLoadingSpinner();
        const deleteResponse = await fetch(`https://localhost:7149/api/toDoItem/delete?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (deleteResponse.ok) {
            showToast(`Task deleted successfully!`);
            fetchTasks();
        } else {
            const deleteErrorText = await deleteResponse.text();
            throw new Error(`Failed to delete task: ${deleteErrorText}`);
        }
    } catch (error) {
        console.error('Delete error:', error.message);
        showToast(error.message, 'error');
    } finally {
        hideLoadingSpinner();
    }
}

function autoFillUpdateForm(task) {
    document.getElementById('updateId').value = task.id;
    document.getElementById('updateTitle').value = task.title;
    document.getElementById('updateDescription').value = task.description;
    document.getElementById('updateIsCompleted').checked = task.isCompleted;
    document.getElementById('updateDueDate').value = task.dueDate.replace('Z', '');
}

function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    if (tasks.length === 0) {
        taskList.innerHTML = '<p>No tasks found.</p>';
        return;
    }

    tasks.forEach(task => {
        const taskContainer = document.createElement('div');
        taskContainer.className = 'task-container';

        const table = document.createElement('table');
        table.className = 'task-table';

        const details = [
            { label: 'Title', value: task.title },
            { label: 'Description', value: task.description },
            { label: 'Completed', value: task.isCompleted ? 'Yes ✓' : 'No ✗' },
            { label: 'Created At', value: new Date(task.createdAt).toLocaleString() },
            { label: 'Due Date', value: new Date(task.dueDate).toLocaleString() }
        ];

        details.forEach(detail => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="detail-label">${detail.label}</td>
                <td class="detail-value">${detail.value}</td>
            `;
            table.appendChild(row);
        });

        const buttonRow = document.createElement('tr');
        buttonRow.innerHTML = `
            <td colspan="2" class="button-cell">
                <button class="edit-btn" onclick='autoFillUpdateForm(${JSON.stringify(task)})'>Edit</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </td>
        `;
        table.appendChild(buttonRow);

        taskContainer.appendChild(table);
        taskList.appendChild(taskContainer);
    });
}

function updatePagination() {
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    const currentPage = Math.floor(skip / take) + 1;
    const totalPages = Math.ceil(totalItems / take) || 1;
    pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;

    prevBtn.disabled = skip <= 0;
    nextBtn.disabled = skip + take >= totalItems;
}

function previousPage() {
    if (skip > 0) {
        skip -= take;
        fetchTasks();
    }
}

function nextPage() {
    if (skip + take < totalItems) {
        skip += take;
        fetchTasks();
    }
}

function filterTasks() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;

    let filteredTasks = allTasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm)
    );

    if (statusFilter === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.isCompleted);
    } else if (statusFilter === 'notCompleted') {
        filteredTasks = filteredTasks.filter(task => !task.isCompleted);
    }

    sortTasks(filteredTasks);
}

function sortTasks(tasksToSort = null) {
    const tasks = tasksToSort || allTasks;
    const sortBy = document.getElementById('sort').value;
    const sortedTasks = [...tasks].sort((a, b) => {
        if (sortBy === 'id') {
            return a.id - b.id;
        } else if (sortBy === 'dueDate') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
    });
    displayTasks(sortedTasks);
}

function clearAddForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('responseMessage').innerText = '';
}

function clearUpdateForm() {
    document.getElementById('updateId').value = '';
    document.getElementById('updateTitle').value = '';
    document.getElementById('updateDescription').value = '';
    document.getElementById('updateIsCompleted').checked = false;
    document.getElementById('updateDueDate').value = '';
    document.getElementById('updateResponseMessage').innerText = '';
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function toggleTheme() {
    document.body.classList.toggle('night-mode');
    const button = document.querySelector('.theme-toggle button');
    button.textContent = document.body.classList.contains('night-mode') ? 'Switch to Day Mode' : 'Switch to Night Mode';
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    const button = document.querySelector('.theme-toggle button');
    button.textContent = document.body.classList.contains('night-mode') ? 'Switch to Day Mode' : 'Switch to Night Mode';
});