# peruna.js
The first no-bullshit JS framework. Super easy. Super lightweight.

## Usage

### Data binding
Just include the peruna.js script to the HTML page and use the following syntax to create two-way data bindings between your data and controllers. Also the nested objects like obj.param1.param2 will work.
    <html>

    <head>
      <title>Peruna.js Demo</title>
    </head>

    <body>

	    <div peruna="perunaApp"> <!-- Tell the module name in the peruna attribute -->
		    <input type="text" p-bind="name"/> <!-- In the p-bind attribute tell your controller's name to Peruna -->
		    <p p-bind="name"></p>
		    
		    <br>
		    
		    <input type="text" p-bind="user.name.first"/>
		    <p p-bind="user.name.first"/>
	    </div>

    </body>

    <script src="./peruna.js/peruna.js"></script>
    <script src="script.js"></script>
    </html>

If everything went right you should now be able to see the input data updating below inside the paragraph element. You may access to the variables through the JavaScript by creating a file named script.js and adding the following lines in to it.

    var app = peruna.module('perunaApp', {
	    name: 'this will be the init text in the binded controller',
	    user: {
	    	name: {
	    		first: 'Kalervo'
	    	}
	    }
    });

These will be the initialized values inside the controllers.

### Click events
You can attach Peruna.js click events to your PerunaControllers. Just use p-click-attribute to tell the Peruna.js which function you would like to be run when the element is clicked.

Add the button element to the example above.

    <button p-click="alertName">Alert the name!</button>
    
Then add the function to call to your script.js. The file after editing should look more or less like this.

    var app = peruna.module('perunaApp', {
    	name: 'this is the name text',
    	alertName: function (e) {
    		alert(this.name);
    	}
    });

There should now appear an alert box when you click the 'Alert the name!' button.

### peruna.js lifecycle functions
Peruna.js at this stage contains two different functions to make things in different stages of the module's life cycle. The first function `perunaPreLoad` runs before the module is started to load with it's data bindings and other stuff. The another function `perunaLoaded` runs just after the module is fully loaded and displayed on the screen. You can define these functions inside your peruna.js module like shown below.

    var app = peruna.module('perunaApp', {
    	perunaPreLoad: function () {
    		// do something before initializing the module
    	},
    	perunaLoaded: function () {
    		// do something just after the module is loaded
    	}
    });

### HTTP Requests
You can easily create a HTTP request inside the peruna.js module using peruna.http function. You pass an configuration object as a parameter to the function and use the success callback to handle the data from the request. A simple example below. It's just a simple function call inside the perunaPreLoad inside the script.js file.

    var app = peruna.module('perunaApp', {
    	perunaPreLoad: function () {
    		peruna.http({
    			method: 'GET',
    			url: 'http://yourapicall.com/your/api/call',
    			dataType: 'json',
    			success: function (data) {
    				console.log(data);
    			}
    		});
    	}
    });

Just have fun trying it out!
