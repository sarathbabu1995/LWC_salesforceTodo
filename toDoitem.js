import { LightningElement,api } from "lwc";
import deleteTodo from "@salesforce/apex/TodoController.deleteTodo";
import updateTodo from "@salesforce/apex/TodoController.updateTodo";

 
 export default class toDoitem extends LightningElement {

   //public properties
   @api todoName;
   @api todoId;
   @api done = false;
 
   /**
    * Update handler to edit current item
    * You can switch the item status between completed and uncompleted
    * Make a call to server to update the item
    */
   updateHandler() {
     //create todo object based to the current item
     const todo = {
       todoId: this.todoId,
       done: !this.done,
       todoName: this.todoName
     };
 
    console.log('out UpdteTOdo');
     //make a call to server to update the item
     updateTodo({ payload: JSON.stringify(todo) })
       .then(result => {
         //on successful update, fire an event to notify parent component
        /*console.log('inside UpdteTOdo');*/
        const updateEvent = new CustomEvent("update", { detail: todo });
        this.dispatchEvent(updateEvent); 
       })
       .catch(error => {
         console.error("Error in updatig records ", error);
       });
   }
 
   /**
    * Delete handler to delete current item
    * Make a call to server to delete the item
    */
   deleteHandler() {
     //make a call to server to delete item
     console.log('delete todo');

     deleteTodo({ todoId: this.todoId })
       .then(result => {
         //on successful delete, fire an event to notify parent component
         this.dispatchEvent(new CustomEvent("delete", { detail: this.todoId }));
       })
       .catch(error => {
         console.error("Error in updatig records ", error);
       });
   }
 
   // get property to return icon name based on item state
   // for completed item, return check icon, else return add icon
   get buttonIcon() {
     return this.done ? "utility:add" : "utility:check";
   }
 
   // get property to return container class
   get containerClass() {
     return this.done ? "todo completed" : "todo upcoming";
   }

 }