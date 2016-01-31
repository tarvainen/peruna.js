var Peruna = function () {
	this.debug = true;
	this.controllers = {};
}

Peruna.prototype.log = function (data) {
	this.debug ? console.log(data) : 0;
}

Peruna.prototype.productionMode = function () {
	this.debug = false;
}

Peruna.prototype.module = function (moduleName, data) {
	var el = document.querySelectorAll('[peruna=' + moduleName + ']')[0];

	if (el) {
		this.el = el;
		this.data = data;
		this.preLoad();
		this.log('Created module ' + moduleName + '.');
		this.init(data);
	} else {
		this.log('Failed to create module ' + moduleName + '.');
	}
}

Peruna.prototype.dispatchUI = function (controllers, value) {
	for (var i = 0; i < controllers.length; i++) {
		controllers[i].dispatchUI(value);
	}
}

Peruna.prototype.init = function () {
	if (!this.el) {
		this.log('Failed to initialize! Module not found.');
		return false;
	}

	this.initStyles();
	this.initAttrs();
	this.initLoops();
	this.initBinds();
	this.initClicks();
	this.loaded();
}

Peruna.prototype.initStyles = function () {
	var style = "[p-temp] { display: none; }";
	var node = document.createElement('style');
	node.innerHTML = style;
	document.getElementsByTagName('head')[0].appendChild(node);
}

Peruna.prototype.initAttrs = function () {
	var looped = this.el.querySelectorAll('p-loop > *');
	for (var i = 0; i < looped.length; i++) {
		looped[i].setAttribute('p-temp', '');
	}
}

Peruna.prototype.initLoops = function () {
	var loops = this.el.querySelectorAll('p-loop');
	for (var i = 0; i < loops.length; i++) {
		this.initLoop(loops[i]);
	}
}

Peruna.prototype.initLoop = function (loop) {
	var term = loop.getAttribute('for');
	this.removeUnusedElements(loop);
	var elements = loop.querySelectorAll('[p-temp]');

	var termParts = term.split(' ');
	var variableName = termParts[0];
	var objName = termParts[2];

	var obj = eval('this.data.' + objName);
	console.log(obj);

	var that = this;
	this.data.watch(objName, function (prop, oldValue, value) {
		that.initLoop(loop);
	});

	if (!obj) {
		return;
	}

	for (var i = 0; i < obj.length; i++) {
		for (var j = 0; j < elements.length; j++) {
			var node = elements[j].cloneNode();
			node.setAttribute('p-bind', 'posts[' + i + '].title');
			node.removeAttribute('p-temp');
			loop.appendChild(node);
			this.initBind(node);
		}
	}

}

Peruna.prototype.initBinds = function () {
	var binds = this.el.querySelectorAll('[p-bind]:not([p-temp])');
	for (var i = 0; i < binds.length; i++) {
		this.initBind(binds[i]);
	}
}

Peruna.prototype.initBind = function (bind) {
	var that = this;
	var controller = new PerunaController(this, bind, this.data);
	var paramName = bind.getAttribute('p-bind');

	var obj = this.data;
	var value = paramName;

	if (paramName.indexOf('.') >= 0) {
		var params = paramName.split('.');
		value = params.pop();
		var str = params.join('.');
		obj = eval('this.data.' + str);
	}

	if (!this.controllers[paramName]) {
		this.controllers[paramName] = [];
		obj.watch(value, function (prop, oldValue, value, fullpath) {
			that.dispatchUI(that.controllers[fullpath], value);
		}, paramName);
	}

	this.controllers[paramName].push(controller);
}

Peruna.prototype.initClicks = function () {
	var clicks = document.querySelectorAll('[p-click]');
	var that = this;

	for (var i = 0; i < clicks.length; i++) {
		var param = clicks[i].getAttribute('p-click');

		clicks[i].addEventListener('click', function (e) {
			if (typeof that.data[param] == 'function') {
				that.data[param](e);
			}
		});
	}
}

Peruna.prototype.loaded = function () {
	if (typeof this.data.perunaLoaded == 'function') {
		this.data.perunaLoaded();
	}
}

Peruna.prototype.preLoad = function () {
	if (typeof this.data.perunaPreLoad == 'function') {
		this.data.perunaPreLoad();
	}
}

Peruna.prototype.removeUnusedElements = function (loop) {
	var removable = loop.querySelectorAll('*:not([p-temp])');
	for (var i = 0; i < removable.length; i++) {
		removable[i].remove();
	}
}


var PerunaController = function (module, el, dataCollection, data) {
	this.module = module;
	this.el = el;
	this.paramName = el.getAttribute('p-bind');
	this.dataCollection = dataCollection;
	this.data = eval('dataCollection.' + this.paramName);

	el.addEventListener('change', this, false);
	el.addEventListener('keyup', this, false);

	var i = 0;
	this.change(this.data);

	var that = this;
}

PerunaController.prototype.handleEvent = function (e) {

	switch (e.type) {
		case 'change':
			this.change(this.el.value);
			break;
		case 'keyup':
			this.change(this.el.value);			
			break;
	}
}

PerunaController.prototype.change = function (value) {
	this.el.value = value;
	this.el.innerHTML = value;
	this.data = value;
	if (this.paramName.indexOf('.') >= 0) {
		var params = this.paramName.split('.');
		var variable = params.pop();
		var str = params.join('.');
		var obj = eval('this.dataCollection.' + str);
		obj[variable] = value;
	} else {
		this.dataCollection[this.paramName] = value;
	}
}

PerunaController.prototype.dispatchUI = function (value) {
	this.el.value = value;
	this.el.innerHTML = value;
}

Peruna.prototype.http = function (opts) {
	var method = opts.method || 'GET';
	var sync = opts.sync || false;
	var url = opts.url || '';
	var data = opts.data || null;
	var dataType = opts.dataType || 'json';

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			if (typeof opts.success == 'function') {
				var data = xmlHttp.responseText;

				switch (dataType) {
					case 'json':
						data = JSON.parse(data);
						break;
					case 'text':
						break;
					case 'xml':
						break;
				}

				opts.success(data);
			}
		}
	}

	xmlHttp.open(method, url, true);
	xmlHttp.send(data);
}

Object.defineProperty(Object.prototype, 'watch', {
	enumerable: false,
	configurable: true,
	writable: false,
	value: function (property, callback, fullpath) {

		var oldValue = this[property];
		var newValue = oldValue;
		
		var getter = function () {
			return newValue;
		}

		var setter = function (value) {
			oldValue = newValue;
			newValue = value;
			callback.call(this, property, oldValue, value, fullpath);
		}

		if (delete this[property]) {
			Object.defineProperty(this, property, {
				get: getter,
				set: setter,
				enumerable: true,
				configurable: true
			});
		}
	}
});

var peruna = new Peruna();