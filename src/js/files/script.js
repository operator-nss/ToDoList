(function toDo() {
   const form = document.querySelector('.todo__form');
   const input = document.querySelector('.input');
   const formButtonSubmit = document.querySelector('.button');
   const todoList = document.querySelector('.todo__list');
   let tasks = [];

   !localStorage.getItem('task') ? tasks = [] : tasks = JSON.parse(localStorage.getItem('task')).filter(item => item != null);

   function dateActually() {
       let date = new Date();
       let day = date.getDate();
       let month = date.getMonth() + 1;
       let year = date.getFullYear();
       let hour = date.getHours();
       let minutes = date.getMinutes();
       let time = `${day}.${setMonth(month)}.${year} ${hour}:${setMinutes(minutes)}`
       return time;
   }

   function setMonth(month) {
       return month < 10 ? '0' + month : month;
   }

   function setMinutes(minutes) {
       return minutes < 10 ? '0' + minutes : minutes;
   }

   function Task(description, dateActually) {
       this.description = description;
       this.dateActually = dateActually;
       this.isComplete = false;

   }

   const updateLocalStorage = () => {
       tasks.filter(item => item != false);
       localStorage.setItem('task', JSON.stringify(tasks));
   }

   updateLocalStorage();


   formButtonSubmit.addEventListener('click', (e) => {
       e.preventDefault();
       if (input.value.length > 3) {
           tasks.push(new Task(input.value, dateActually()));
           turnDoneTasksDown();
           updateLocalStorage();
           createItem(input.value, dateActually());
           form.reset();
       }

   })


   function createItem() {
       todoList.innerHTML = '';
       if (tasks.length > 0) {
           tasks.forEach((item, index) => {
               let elementList = document.createElement('li');
               if (item.isComplete) {
                   elementList.classList.add('completed');
               }
               elementList.classList.add('todo__item');
               elementList.setAttribute('id', index)
               elementList.innerHTML += fragmentList(item, index)
               todoList.append(elementList);
           })
       }
   }

   const fragmentList = (item, index) => {
       return ` <div class="todo__description">${item.description}</div>
       <div class="todo__actions">
       <div class="todo__date">${item.dateActually}</div>
       <div class="todo__buttons">
           <button class="todo__done todo__button">${item.isComplete ? 'undone' : 'done'}</button>
           <button class="todo__delete todo__button">Delete</button>
       </div>
   </div>
   `
   }

   createItem();

   todoList.addEventListener('click', onDeleteHandler);
   todoList.addEventListener('click', onCompleteHandler);

   function onDeleteHandler({ target }) {
       if (target.classList.contains('todo__delete')) {
           let parent = target.closest('.todo__item');
           let id = parent.getAttribute('id');
           delete tasks[id];
           updateLocalStorage();
           createItem();
           turnDoneTasksDown();
           updateLocalStorage();
       }
   }

   function onCompleteHandler({ target }) {
       let parent = target.closest('.todo__item');
       let id = parent.getAttribute('id');

       if (target.classList.contains('todo__done')) {
           if (tasks[id].isComplete === true) {
               tasks[id].isComplete = false;
               parent.classList.remove('completed');
               turnDoneTasksDown();
               updateLocalStorage();
               createItem();
               return;
           }
           tasks[id].isComplete = true;
           parent.classList.add('completed');
           turnDoneTasksDown();
           updateLocalStorage();
           createItem();
       }
   }

   function turnDoneTasksDown() {
       let uncompleteTasks = tasks.filter(item => !item.isComplete);
       let completedTasks = tasks.filter(item => item.isComplete);
       tasks = [...uncompleteTasks, ...completedTasks];
   }

   updateLocalStorage();

})()
