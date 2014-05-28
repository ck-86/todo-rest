/*-------------------------------------------------------------/
| Testing REST API of Built.IO
|--------------------------------------------------------------/
|
*/
		/*----------------------------------------/
			jQuery AJAX used for setting headers
		/-----------------------------------------*/
		$.ajaxSetup({
		    headers: {
		        'application_api_key': 'blt0cf784f8abaf4dc1',
		        'application_uid': 'todo',
		        'content-type': 'application/json'
		    }
		});

/*----------------------------------------/
	Task Model
/-----------------------------------------*/
var Task = Backbone.Model.extend({

	defaults : {
		id: null,
		title: null,
		completed: false
	},

	validate: function(){

		//If new model is created validate `title`
		if(this.get('object')){
			if(!this.get('object').title){
				alert('Name is required');
				return 'Name is required';
			}
		}

	},

	parse: function(response){
		// Parse newly created model
		if(response.object) {
			response.object.id = response.object.uid; //adding `id`=`uid`
			return response.object;
		}
		return response;
	},

	url: function(){
		var modelURL = 'https://api.built.io/v1/classes/todo/objects/';
		if(this.id) {
			return modelURL + this.id;
		}
		console.log(modelURL + this.id);
	    return modelURL;
  	}
});

/*----------------------------------------/
	Task Collection
/-----------------------------------------*/
var Tasks = Backbone.Collection.extend({

	model: Task,
	
	//Parse response in collection
	parse: function(response) {
		var model = $.map(response.objects, function(response){
			return {
				id:response.uid,
				title:response.title,
				completed:response.completed
			}
		});

		return model;
	},

	url : 'https://api.built.io/v1/classes/todo/objects/'
});


/*----------------------------------------/
	Tasks View
/-----------------------------------------*/
var TasksView = Backbone.View.extend({
	tagName : 'ul',

	initialize: function() {
		this.collection.on('add', this.addOne, this);
		this.render();
	},

	render: function() {
		this.collection.forEach(this.addOne, this);
		return this;
	},

	addOne : function(task) {
		var taskView = new TaskView({model:task});
		this.$el.append(taskView.render().el);
	}

});


/*----------------------------------------/
	Task View
/-----------------------------------------*/
var TaskView = Backbone.View.extend({

	tagName : 'li',

	className : 'task',


	template: _.template( $('#taskTemplate').html() ),

	events : {
		'click .delete' : 'destroy',
		'click .edit' : 'editTask',
		'click [type="checkbox"]' : 'completed', //Checkbox event
	},

	initialize: function(){
		this.model.on("change", this.render, this);
	},

	render: function() {
		//console.log(this.model);
		this.$el.html( this.template( this.model.toJSON() ) );
		return this;
	},

	destroy: function(){
		console.log( 'Deleteing Object :' + this.model.get('id') );
		this.$el.remove();
		this.model.destroy({
			success: console.log('Object Deleted')
		});
	},

	editTask: function (){
		console.log('Editing Task....');
		var newTaskTitle = prompt("Editing mode...", this.model.get('title'));
		newTaskTitle = $.trim(newTaskTitle);
		if( !newTaskTitle ) return; // retun if newTaskTile is empty
		var newTask = { title : newTaskTitle }; // Enclosing in object
		this.model.set(newTask);
		this.model.save('object', newTask);
	},

	completed : function(e) {
		var checkBoxStatus = e.currentTarget.checked;

		var newStatus = { 
			title: this.model.get('title'), // Title is required or else model validation will fail
			completed : e.currentTarget.checked 
		};
		
		this.model.set(newStatus);
		this.model.save('object', newStatus);	
	}
});


/*----------------------------------------/
	Add Task View 
/-----------------------------------------*/

var AddTask = Backbone.View.extend({
	el : '#addTask',

	initialize: function() {
	},

	events: {
		'submit' : 'submit'
	},

	submit: function(e) {
		e.preventDefault();
		var newTaskTitle = $(e.currentTarget).find('input[type=text]').val();
		var task = new Task( { object : { title: newTaskTitle } } ); // wrapping in object for built
		this.collection.create( task , {wait:true}); //Add object to collection and wait for response
		//--- Clear Input Box ---//
		$(e.currentTarget).find('input[type=text]').val('');
	}
});


/*-------------------------------------------------------------/
| Init
|--------------------------------------------------------------/
| starts here
*/
	var task = new Task;

	var tasks = new Tasks();

	tasks.fetch({
		// data : JSON.stringify( {"_method": "get","query": {"completed": true} } ),
		// type: 'POST',
		complete: ( function () {
			var addTaskView = new AddTask({collection: tasks });
			var tasksView = new TasksView({collection:tasks});
			$('.tasks').html(tasksView.el);
		})
	});