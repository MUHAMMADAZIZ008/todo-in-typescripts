const todosForm = document.querySelector('.todos__form')
const todosInput = document.querySelector('.todos__input')

const todosLists = document.querySelectorAll('.todos__list')
const todosList = todosLists[0]
const inProgressList = todosLists[1]
const doneList = todosLists[2]

// create tags
const todosItem = document.createElement('li')
todosItem.classList.add('todos__item')


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
    console.log(newTodo);
    
})