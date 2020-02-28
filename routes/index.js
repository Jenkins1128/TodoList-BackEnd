const todosController = require('../controllers').todos;
const todoItemsController = require('../controllers').todoItems;
const userController = require('../controllers').users;
const verify = require('../controllers/verifyToken');

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Todos API!',
  }));
    
  //Todos
  app.post('/api/todos', verify, todosController.create);   
  app.get('/api/todos', verify, todosController.list);
  app.get('/api/todos/:todoId',verify, todosController.retrieve);
  app.put('/api/todos/:todoId', verify, todosController.update);
  app.delete('/api/todos/:todoId',verify, todosController.destroy);

  //Todo Items
  app.post('/api/todos/:todoId/items', verify,todoItemsController.create);
  app.put('/api/todos/:todoId/items/:todoItemId', verify,todoItemsController.update); 
  app.delete(
    '/api/todos/:todoId/items/:todoItemId', verify,todoItemsController.destroy
  );
    

    
  //Register
  app.post('/api/register', userController.create); 
  
  //Login
   app.post('/api/login', userController.login);  
    
    
    
    
  app.all('/api/todos/:todoId/items', (req, res) =>
    res.status(405).send({
      message: 'Method Not Allowed',
  }));

};