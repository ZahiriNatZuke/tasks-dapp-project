// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TasksContract {
    uint256 public tasksCount = 0;

    constructor() {
        createTask("Task #1", "Something to do.");
    }

    struct Task {
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
    }

    mapping(uint256 => Task) public tasks;

    function createTask(string memory _title, string memory _description)
        public
    {
        tasks[tasksCount] = Task(
            tasksCount,
            _title,
            _description,
            false,
            block.timestamp
        );
        tasksCount++;
    }

    function toggleDone(uint256 _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
    }
}
