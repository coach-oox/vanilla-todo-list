const form = document.querySelector(".todo-form");
const input = form.querySelector("input");
const activeList = document.querySelector(".active");
const doneList = document.querySelector(".done");

let activeToDos = [];
let doneToDos = [];

const LS_ACTIVE = "active-list";
const LS_DONE = "done-list";
const STATE_ACTIVE = "active";
const STATE_DONE = "done";

function deleteToDo(event) {
    let newToDos;
    const target = event.target.parentNode.parentNode;
    const parent = target.parentNode;
    const state = target.parentNode.classList[1];

    parent.removeChild(target);

    if (state === STATE_ACTIVE) {
        newToDos = activeToDos.filter((todo) => {
            return todo.id !== target.id;
        });

        activeToDos = newToDos;
    } else {
        newToDos = doneToDos.filter((todo) => {
            return todo.id !== target.id;
        });

        doneToDos = newToDos;
    }

    saveToDos(state);
}

function updateToDo(event) {
    let newToDos;
    const id = event.target.parentNode.parentNode.id;
    const text = event.target.parentNode.childNodes[2].childNodes[0].value;
    const state = event.target.parentNode.parentNode.parentNode.classList[1];

    if (state === STATE_ACTIVE) {
        activeToDos.forEach((todo) => {
            if (todo.id === id) {
                todo.text = text;
            }
        });
    } else {
        doneToDos.forEach((todo) => {
            if (todo.id === id) {
                todo.text = text;
            }
        });
    }

    saveToDos(state);
}

function editToDo(event) {
    const target = event.target.parentNode.parentNode.childNodes[0];
    const originText = target.childNodes[1];
    const editForm = target.childNodes[2];
    const editInput = editForm.childNodes[0];

    originText.classList.toggle("hidden");
    editForm.classList.toggle("hidden");
    editInput.value = originText.innerText;
}

function toggleToDo(event) {
    let to;
    const id = event.target.parentNode.parentNode.id;
    const text = event.target.parentNode.childNodes[1].innerText;
    const state = event.target.parentNode.classList[1];

    if (state === STATE_ACTIVE) {
        to = STATE_DONE;
    } else {
        to = STATE_DONE;
    }

    deleteToDo(event);

    const todo = {
        id,
        text,
    };

    makeToDo(todo, to);
}

function saveToDos(state) {
    if (state === STATE_ACTIVE) {
        localStorage.setItem(LS_ACTIVE, JSON.stringify(activeToDos));
    } else {
        localStorage.setItem(LS_DONE, JSON.stringify(doneToDos));
    }
}

function makeToDo(todo, state) {
    let list;
    let todos;
    let checkBox;

    if (state === STATE_ACTIVE) {
        checkBox = `far fa-square`;
        list = activeList;
        todos = activeToDos;
    } else {
        checkBox = `far fa-check-square`;
        list = doneList;
        todos = doneToDos;
    }

    const li = document.createElement("li");
    const left = document.createElement("div");
    const checkButton = document.createElement("i");
    const span = document.createElement("span");
    const editForm = document.createElement("form");
    const editInput = document.createElement("input");
    const right = document.createElement("div");
    const editButton = document.createElement("i");
    const deleteButton = document.createElement("i");

    // * left
    checkButton.className = checkBox;
    checkButton.addEventListener("click", toggleToDo);
    span.innerText = todo.text;
    span.className = "text";
    editInput.className = "edit-input";
    editForm.appendChild(editInput);
    editForm.className = "hidden";
    editForm.addEventListener("submit", updateToDo);
    left.className = "left";
    left.appendChild(checkButton);
    left.appendChild(span);
    left.appendChild(editForm);

    // * right
    editButton.className = `far fa-edit`;
    editButton.addEventListener("click", editToDo);
    deleteButton.className = `far fa-trash-alt`;
    deleteButton.addEventListener("click", deleteToDo);
    right.className = "right";
    right.appendChild(editButton);
    right.appendChild(deleteButton);

    // * li
    li.id = todo.id;
    li.appendChild(left);
    li.appendChild(right);
    list.appendChild(li);

    todos.push(todo);
    saveToDos(state);
    input.value = "";
}

function generateId() {
    return Math.random().toString(36).substr(2, 16);
}

function handleInput(event) {
    event.preventDefault();

    const text = input.value;

    if (text !== "") {
        const todo = {
            id: generateId(),
            text,
        };

        makeToDo(todo, STATE_ACTIVE);
    }
}

function loadToDos() {
    const active = JSON.parse(localStorage.getItem(LS_ACTIVE));
    const done = JSON.parse(localStorage.getItem(LS_DONE));

    if (active) {
        active.forEach((todo) => {
            return makeToDo(todo, STATE_ACTIVE);
        });
    }

    if (done) {
        done.forEach((todo) => {
            return makeToDo(todo, STATE_DONE);
        });
    }
}

function main() {
    loadToDos();
    form.addEventListener("submit", handleInput);
}

main();
