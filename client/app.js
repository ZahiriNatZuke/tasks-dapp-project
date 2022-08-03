const App = {
    Web3Provider: null,
    TasksContract: null,
    Account: null,
    contracts: {},
    init: async () => {
        await App.loadEthereum();
        await App.loadContracts();
        await App.render();
    },
    loadEthereum: async () => {
        if (window['ethereum'] !== undefined) {
            App.Web3Provider = window['ethereum'];
            console.info('MetaMask is installed!')
            await App.loadAccount();
        } else {
            console.warn('MetaMask not is installed');
        }
    },
    loadAccount: async () => {
        const account = await App.Web3Provider.request({method: 'eth_requestAccounts'});
        App.Account = account[0];
        console.log('Account loaded!');
    },
    loadContracts: async () => {
        const res = await fetch('/contracts/TasksContract.json');
        const tasksContractJson = await res.json();
        App.contracts.tasksContract = TruffleContract(tasksContractJson);
        App.contracts.tasksContract.setProvider(App.Web3Provider);
        App.TasksContract = await App.contracts.tasksContract.deployed();
        console.info('Contracts ready!');
    },
    createTask: async (task, description) => {
        await App.TasksContract.createTask(task, description, {from: App.Account});
        window.location.reload();
    },
    toggleDone: async (toggle) => {
        const id = toggle.dataset.id;
        await App.TasksContract.toggleDone(id, {from: App.Account});
        window.location.reload();
    },
    render: async () => {
        document.querySelector('#wallet').innerText = App.Account;
        await App.renderTasks();
    },
    renderTasks: async () => {
        const taskCounter = await App.TasksContract.tasksCount();
        let html = '';

        for (let i = 0; i < taskCounter.toNumber(); i++) {
            const task = await App.TasksContract.tasks(i);

            html += `
                <div class="card">
                    <div class="header-card">
                        <h2 class="card-title">${task.title}</h2>
                        <input type="checkbox" class="toggle toggle-primary" data-id="${task.id}"
                            onchange="App.toggleDone(this)" ${task.done ? 'checked' : ''}/>
                    </div>
                    <div class="divider"></div>
                    <p class="card-description">${task.description}</p>
                    <div class="flex justify-end items-center pt-2">
                        <span class="text-gray-500 font-sm">
                            created at ${new Date(task.createdAt * 1000).toLocaleString()}
                        </span>
                    </div>
                </div>
            `;
        }

        document.querySelector('#taskList').innerHTML = html;
    }
}

App.init().then(() => console.info('Script loaded!'));
