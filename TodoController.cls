public with sharing class TodoController {
    

    @AuraEnabled
    public static String addTodo(String payload) {
        ToDo payloadObject = (ToDo) JSON.deserialize(payload, ToDo.class);
    
        SObject todo = (Sobject) Type.forName('Todo__c').newInstance();
        todo.put('Name', payloadObject.todoName);
        todo.put('Done__c', payloadObject.done);
        
        insert todo;

        System.debug('this is my new method');
    
        return String.valueOf(todo.Id);
    }

      public class ToDo {
        @AuraEnabled
        public String todoId;
        @AuraEnabled
        public String todoName;
        @AuraEnabled
        public Date todoDate;
        @AuraEnabled
        public Boolean done;
    }

    @AuraEnabled
    public static List<ToDo> getCurrentTodos() {
      List<SObject> todos = Database.query(
        'SELECT Id, Name, CreatedDate, Done__c FROM ToDo__c WHERE CreatedDate = TODAY ORDER BY CreatedDate DESC'
      );
      return getToDos(todos);
    }
 
    //

    //'SELECT Id, Name, CreatedDate, Done__c FROM ToDo__c WHERE CreatedDate = TODAY ORDER BY CreatedDate DESC'
    
    @AuraEnabled
    public static List<ToDo> getOldTodos() {
      List<SObject> todos = Database.query(
        'SELECT Id, Name, CreatedDate, Done__c FROM ToDo__c WHERE CreatedDate < TODAY && Done__c = false  ORDER BY CreatedDate DESC'
      );
      return getToDos(todos);
    }

    public static List<ToDo> getToDos(List<SObject> objs) {
        List<ToDo> todos = new List<ToDo>();
        for (SObject obj : objs) {
          ToDo todo = new ToDo();
          todo.todoId = obj.Id;
          todo.todoName = String.valueOf(obj.get('Name'));
          todo.todoDate = Date.valueOf(obj.get('CreatedDate'));
          System.debug('&&&&&&&&&&&& todo.todoDate '+ todo.todoDate);
          todo.done = Boolean.valueOf(obj.get('Done__c'));
          todos.add(todo);
        }
    
        return todos;
      }

      @AuraEnabled
      public static void updateTodo(String payload) {
        ToDo payloadObject = (ToDo) JSON.deserialize(payload, ToDo.class);
    
        SObject todo = (Sobject) Type.forName('ToDo__c').newInstance();
        todo.put('Id', payloadObject.todoId);
        todo.put('Name', payloadObject.todoName);
        todo.put('Done__c', payloadObject.done);
        System.debug('update --> ID'+payloadObject.todoId);
        update todo;
      }
    
      //Delete an item
      //Accepts id of the item to delete
      @AuraEnabled
      public static void deleteTodo(String todoId) {
        SObject todo = (Sobject) Type.forName('ToDo__c').newInstance();
        todo.put('Id', todoId);
        System.debug('delet --> ID'+todoId);
        delete todo;
      }
}
