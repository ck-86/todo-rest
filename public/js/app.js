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
		title:'Default Value'	
	}
});

/*----------------------------------------/
	Task Collection
/-----------------------------------------*/
var Tasks = Backbone.Collection.extend({

	model: Task,

	// Parse objects
	parse: function(response) {
		return response.objects;
	},

	url : 'https://api.built.io/v1/classes/todo/objects/'
});


/*----------------------------------------/
	Tasks View
/-----------------------------------------*/
var TasksView = Backbone.View.extend({
	tagName : 'ul',

	initialize: function() {
		this.render();
		this.collection.on('add', this.addOne, this)
	},

	render: function() {
		this.collection.models.forEach(this.addOne, this);
		return this;
	},

	addOne : function(task) {
		var taskView = new TaskView({model:task});
		this.$el.append(taskView.render().el);
	},

	shout: function(task) {
		console.log('Collection Changed');
	}

});


/*----------------------------------------/
	Task View
/-----------------------------------------*/
var TaskView = Backbone.View.extend({
	tagName : 'li',

	initialize: function() {
		//
		this.model.on('change', this.shout, this);
	},

	render: function() {
		this.$el.html(this.model.get('title'));
		return this;
	},

	shout: function(task) {
		console.log('Model Changed : ');
		console.log(task);
		this.render();	
	}
});



/*-------------------------------------------------------------/
| Init
|--------------------------------------------------------------/
| starts here
*/
	var task = new Task;

	var tasks = new Tasks;
	tasks.fetch({
		complete: ( function () {
			//--- Testing : Show TaskView as response is recived  ---//
			var tasksView = new TasksView({collection:tasks});
			console.log(tasksView.el);
			$(document.body).html(tasksView.el);
		})
	});


