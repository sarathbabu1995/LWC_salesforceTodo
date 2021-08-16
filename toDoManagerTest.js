 import { LightningElement, track, api } from "lwc";
 import getCurrentTodos from "@salesforce/apex/TodoController.getCurrentTodos";
 import addTodo from "@salesforce/apex/TodoController.addTodo";
 
 export default class toDoManagerTest extends LightningElement {
  
   @track time = "8:22 AM";
   @track greeting = "Good Morning";
 
   //reactive list property to hold todo items
   @track todos = [];
 
   connectedCallback() {
     //get current time
     this.getTime();
 
     //fetch today's todos from server
     this.fetchTodos();
 
     //get time periodically after every minute
     setInterval(() => {
       this.getTime();
     }, 1000 * 60);
   }

   updateTodoHandler(event) {
    if (event) {
      this.fetchTodos();
    }
  }

  deleteTodoHandler(event) {
    if (event) {
      this.fetchTodos();
    }
  }
 
   /**
    * Get time and parse in human readable format
    * It follows 12 hour format
    */
   getTime() {
     const date = new Date(); /* creating object of Date class */
     const hour = date.getHours();
     const min = date.getMinutes();
 
     this.time = `${this.getHour(hour)}:${this.getDoubleDigit(
       min
     )} ${this.getMidDay(hour)}`;
     //get greeting (mornig/afternoon/evening/)
     this.setGreeting(hour);
   }
 
   //Convert 24 hours format to 12 hours format
   getHour(hour) {
     return hour == 0 ? 12 : hour > 12 ? hour - 12 : hour;
   }
 
   //convert single digit to double digit
   getDoubleDigit(digit) {
     return digit < 10 ? "0" + digit : digit;
   }
 
   //return AM or PM based on current hour
   getMidDay(hour) {
     return hour >= 12 ? "PM" : "AM";
   }
 
   //return greeting based on current hour
   setGreeting(hour) {
     if (hour < 12) {
       this.greeting = "Good Morning";
     } else if (hour >= 12 && hour < 17) {
       this.greeting = "Good Afternoon";
     } else {
       this.greeting = "Good Evening";
     }
   }
 
   /**
    * Add todos to backend
    * Get todo item based on input box value, and add to Salesforce object
    * Fetch fresh list of todos once inserted
    */
   addTodoHandler() {
     //get input box html element
     const inputBox = this.template.querySelector("lightning-input");
     //create a new todo object based on input box value
     const todo = { todoName: inputBox.value, done: false };
     //call addtodo server method to add new todo object
     //serialize todo object before sending to server
     addTodo({ payload: JSON.stringify(todo) })
       .then(result => {
         if (result) {
           //fetch fresh list of todos
           this.fetchTodos();
         }
       })
       .catch(error => {
         console.error("Error in adding todo" + error);
       });
 
     inputBox.value = "";
   }
 
   /**
    * Fetch todos from server
    * This method only retrives todos for today
    */
   fetchTodos() {
     getCurrentTodos()
       .then(result => {
         if (result) {
           //update todos property with result
           this.todos = result;
         }
       })
       .catch(error => {
         console.error("Error in fetching todo" + error);
       });
   }

   
   
   // get property to return upcoming/unfinished todos
   get upcomingTodos() {
     return this.todos && this.todos.length
       ? this.todos.filter(todo => !todo.done): [];
       console.log('new Date value '+ new Date());
   }
 
   // get property to return completed todos
   get completedTodos() {
     return this.todos && this.todos.length
       ? this.todos.filter(todo => todo.done): [];

   }
   
 }