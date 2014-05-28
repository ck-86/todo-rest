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
			Template Helper Function
		/-----------------------------------------*/
		var template = function(id) {
		return _.template( $('#' + id).html() );
		}

/*----------------------------------------/
	Task Model
/-----------------------------------------*/
var Task = Backbone.Model.extend({
	defaults : { 
		id: null,
		title: 'Default Title' 
	}
});

/*----------------------------------------/
	Task Collection
/-----------------------------------------*/
var Tasks = Backbone.Collection.extend({
	model: Task,
	url : 'https://api.built.io/v1/classes/todo/objects/',
	parse: function(response) { return response.objects; }
});


/*----------------------------------------/
	Task View
/-----------------------------------------*/
var TaskView = Backbone.View.extend({
	tagName : 'li',

	initialize: function() {
		console.log('Task View Initialize');
	},

	render: function() {
		this.$el.html( this.model.get('object').title );
		console.log( this.model.get.('object').toJSON() );
	}
});




/*-------------------------------------------------------------/
| 
|--------------------------------------------------------------/
| 
*/

var task = new Task;
// Setting values for task
task.set({'object' : {'title' : 'some title'}});

var tasks = new Tasks;

var taskView = new TaskView({ model:task });