const taskForm = document.querySelector('#taskForm');

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await App.createTask(taskForm['task'].value, taskForm['description'].value);
});
