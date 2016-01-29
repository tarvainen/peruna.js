# peruna.js
The first no-bullshit JS framework. Super easy. Super lightweight.

## Usage

### Data binding
Just include the peruna.js script to the HTML page and use the following syntax to create two-way data bindings between your data and controllers.
    <html>

    <head>
      <title>Peruna.js Demo</title>
    </head>

    <body>

	    <div peruna="perunaApp"> <!-- Tell the module name in the peruna attribute -->
		    <input type="text" p-bind="name"/> <!-- In the p-bind attribute tell your controller's name to Peruna -->
		    <p p-bind="name"></p>
	    </div>

    </body>

    <script src="./peruna.js/peruna.js"></script>
    <script src="script.js"></script>
    </html>

If everything went right you should now be able to see the input data updating below inside the paragraph element. You may access to the variables through the JavaScript by creating a file named script.js and adding the following lines in to it.

    var app = peruna.module('perunaApp', {
	    name: 'this will be the init text in the binded controller'
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

Just have fun trying it out!
