import { getStorage, removeStorage, setStorage } from "./localstorage.js"

const todosForm = document.querySelector('.todos__form')
const todosInput = document.querySelector('.todos__input')

const todosLists = document.querySelectorAll('.todos__list')
const todosList = todosLists[0]
const inProgressList = todosLists[1]
const doneList = todosLists[2]

const infosTitle = document.querySelectorAll('.todos__list_info')
const todosInfoTitle = infosTitle[0]
const inProgressInfoTitle = infosTitle[1]
const doneInfoTitle = infosTitle[2]

//edit
const editSection = document.querySelector('.edit__section')
const editForm = document.querySelector('.edit__form')
const editCloseBtn = document.querySelector('.edit__btn--x')
const editInput = document.querySelector('.edit__form--input')
const editBtn = document.querySelector('.edit__form--btn')

// create tags
// const todosItem = document.createElement('li')
// todosItem.classList.add('todos__item')

//get all todos
async function getAllTodos(findBy) {
    let allTodos;
    await fetch(`http://localhost:3000/todos/find-by?findBy=${findBy}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then((res) => res.json())
        .then((res) => allTodos = res)

    const todos = [];
    for (let i = allTodos.length - 1; i >= 0; i--) {
        todos.push(allTodos[i])
    }
    return todos
}

//find one
async function getOneTodos(id) {
    let todo;
    await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then((res) => res.json())
        .then((res) => todo = res)
    return todo
}
// update one
async function updateOne(id, options) {
    const data = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(options)
    })
    const todo = await data.json()
    const storageData = await getStorage('todos')
    const todosIndex = storageData.findIndex((value) => value._id === id)
    console.log(todosIndex);
    storageData.splice(todosIndex, 1, todo)
    await setStorage('todos', storageData)
}
//delete one

async function deleteOne(id) {
    await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const storageData = await getStorage('todos')
    const newData = storageData.filter((item) => item._id != id)
    await setStorage('todos', newData)
}

// generator
async function todosListGenerator() {
    const todos = await getAllTodos('todo')
    todosList.innerHTML = todos.map((value) => `
            <li class="todos__item">
                <p class="todos__list_text">${value.title}</p>
                <div class="todos__list_btn_box">
                    <button class="todos__list_edit_btn"><img id='${value._id}' class="todos__edit_icon" src="./images/icons8-edit-24.png" alt="icon"></button>
                    <button class="todos__list_next_btn"><img id='${value._id}' class="todos__next_icon" src="./images/iconsnext.png" alt="icon"></button>
                </div>
            </li>
        `).join("")
    todosInfoTitle.textContent = `Tasks to do - ${todos.length}`
}
//generator inProgress list
async function inProgressGenerator() {
    const todos = await getAllTodos('inProgress')
    inProgressList.innerHTML = todos.map((value) => `
    <li class="todos__item">
        <p class="todos__list_text">${value.title}</p>
        <div class="todos__list_btn_box">
            <button class="todos__list_edit_btn"><img id='${value._id}' class="todos__edit_icon" src="./images/icons8-edit-24.png" alt="icon"></button>
            <button class="todos__list_next_btn"><img id='${value._id}' class="todos__next_icon" src="./images/iconsnext.png" alt="icon"></button>
        </div>
    </li>
    `).join("")
    inProgressInfoTitle.textContent = `In Progress - ${todos.length}`

}

// done generator
async function doneGenerator() {
    const todos = await getAllTodos('done')
    doneList.innerHTML = todos.map((value) => `
    <li class="todos__item">
        <p class="todos__list_text">${value.title}</p>
        <button class="todos__list_delete_btn"><img id='${value._id}' class="todos__delete_icon" src="./images/icons8-delete.png" alt="icon"></button>
    </li>
    `).join("")
    doneInfoTitle.textContent = `Done - ${todos.length}`
}

//IIFI function
(async function () {
    await todosListGenerator()
    await inProgressGenerator()
    await doneGenerator()
})()
// edit function

async function editTodo(todo, whichUpdate) {
    const newTaskTitle = {}
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        newTaskTitle.title = editInput.value
        await updateOne(todo._id, newTaskTitle)
        if (whichUpdate === 'todo') {
            await todosListGenerator()
        } else if (whichUpdate === 'progress') {
            await inProgressGenerator()
        }
    })

}

//events
todosForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const data = {
        title: todosInput.value,
        description: "something"
    }
    let newTodo;
    await fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((res) => res.json())
        .then((res) => newTodo = res)
    todosInput.value = ''
    await todosListGenerator()
    const storageData = await getStorage('todos')
    if (!storageData) {
        setStorage('todos', [newTodo])
    } else {
        const isBeen = storageData.filter((item) => item._id === newTodo._id)
        if (isBeen.length === 0) {
            setStorage('todos', [...storageData, newTodo])
        }

    }
})

//next to and edit
todosList.addEventListener('click', async (e) => {
    const todo = await getOneTodos(e.target.id)
    if (e.target.className === 'todos__next_icon' && todo.status === 'todo') {
        await updateOne(todo._id, { status: 'inProgress' })
        await todosListGenerator()
        await inProgressGenerator()
    }
    if (e.target.className === 'todos__edit_icon') {
        editInput.value = todo.title
        editSection.classList.add('show__edit_section')
        editBtn.addEventListener('click', async (e) => {
            await editTodo(todo, 'todo')
            editSection.classList.remove('show__edit_section')
        })
    }
})
inProgressList.addEventListener('click', async (e) => {
    const todo = await getOneTodos(e.target.id)

    if (e.target.className === 'todos__next_icon' && todo.status === 'inProgress') {
        await updateOne(todo._id, { status: 'done' })
        await inProgressGenerator()
        await doneGenerator()
    }

    if (e.target.className === 'todos__edit_icon') {
        editInput.value = todo.title
        editSection.classList.add('show__edit_section')
        editBtn.addEventListener('click', async (e) => {
            await editTodo(todo, 'progress')
            editSection.classList.remove('show__edit_section')
        })
    }
})
doneList.addEventListener('click', async (e) => {
    const todo = await getOneTodos(e.target.id)
    if (e.target.className === 'todos__delete_icon' && todo.status === 'done') {
        await deleteOne(todo._id)
        await doneGenerator()
    }
})
editCloseBtn.addEventListener('click', (e) => {
    editSection.classList.remove('show__edit_section')
})
editSection.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit__section')) {
        editSection.classList.remove('show__edit_section')
    }
})