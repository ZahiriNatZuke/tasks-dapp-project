const TasksContract = artifacts.require('TasksContract');

contract('TasksContract', function () {

    let contractInstance;

    it('Should deploy a contract', async () => {
        contractInstance = await TasksContract.deployed();
        assert.isOk(contractInstance);
    });

    it('Migrate deployed successfully', async () => {
        const address = contractInstance.address;
        assert.notEqual(address, 0x0);
        assert.notEqual(address, undefined);
        assert.notEqual(address, null);
        assert.notEqual(address, '');
    });

    it('Check tasks list', async () => {
        const tasksCounter = await contractInstance.tasksCount();
        assert.equal(tasksCounter, 1);

        const task = await contractInstance.tasks(tasksCounter - 1);
        assert.equal(task.id.toNumber(), tasksCounter);
        assert.equal(task.title, 'Task #1');
        assert.equal(task.description, 'Something to do.');
        assert.equal(task.done, false);
    });

    it('Create a task', async () => {
        const tasksCounter = await contractInstance.tasksCount();
        await contractInstance.createTask('Task #2', 'Something to do #2.');
        const newTasksCounter = await contractInstance.tasksCount();
        const task = await contractInstance.tasks(tasksCounter);

        assert.equal(newTasksCounter, +tasksCounter + 1);
        assert.equal(task.id.toNumber(), newTasksCounter);
        assert.equal(task.title, 'Task #2');
        assert.equal(task.description, 'Something to do #2.');
        assert.equal(task.done, false);
    });

    it('Create a task and test event', async () => {
        const tasksCounter = await contractInstance.tasksCount();
        const result = await contractInstance.createTask('Task #3', 'Something to do #3.');
        const newTasksCounter = await contractInstance.tasksCount();
        const task = result.logs[0].args;

        assert.equal(newTasksCounter.toNumber(), +tasksCounter + 1);
        assert.equal(task.id.toNumber(), newTasksCounter.toNumber());
        assert.equal(task.title, 'Task #3');
        assert.equal(task.description, 'Something to do #3.');
        assert.equal(task.done, false);
    });

    it('Toggle done status and test event', async () => {
        const tasksCounter = await contractInstance.tasksCount();
        let result = await contractInstance.toggleDone(tasksCounter);
        let taskEvent = result.logs[0].args;
        let task = await contractInstance.tasks(tasksCounter - 1);

        assert.equal(taskEvent.done, true);
        assert.equal(task.done, true);
        assert.equal(taskEvent.id.toNumber(), task.id.toNumber());

        result = await contractInstance.toggleDone(tasksCounter);
        taskEvent = result.logs[0].args;
        task = await contractInstance.tasks(tasksCounter - 1);

        assert.equal(taskEvent.done, false);
        assert.equal(task.done, false);
        assert.equal(taskEvent.id.toNumber(), task.id.toNumber());
    })

});
