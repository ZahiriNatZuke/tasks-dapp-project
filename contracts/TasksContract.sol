// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TasksContract {
    uint256 public tasksCount = 0;

    constructor() {
    }

    event TaskCreated(uint256 id, string title, string description, bool done, uint256 createdAt);

    event TaskToggle(uint256 id, bool done);

    struct Task {
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
    }

    mapping(uint256 => Task) public tasks;

    function createTask(string memory _title, string memory _description) public {
        uint256 id = tasksCount + 1;
        tasks[tasksCount] = Task(id, _title, _description, false, block.timestamp);
        tasksCount++;
        emit TaskCreated(id, _title, _description, false, block.timestamp);
    }

    function toggleDone(uint256 _id) public {
        uint256 index = _id - 1;
        Task memory _task = tasks[index];
        _task.done = !_task.done;
        tasks[index] = _task;
        emit TaskToggle(_id, _task.done);
    }
}
