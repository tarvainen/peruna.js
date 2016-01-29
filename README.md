# peruna.js
The first no-bullshit JS framework. Super easy. Super lightweight.

## Usage
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

Just have fun trying it out!
