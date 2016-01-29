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

	this.initBinds();
	this.initClicks();
	this.loaded();
}

Peruna.prototype.initBinds = function () {
	var binds = this.el.querySelectorAll('[p-bind]');
	var that = this;

	for (var i = 0; i < binds.length; i++) {
		var controller = new PerunaController(this, binds[i], this.data);
		var paramName = binds[i].getAttribute('p-bind');

		if (!this.controllers[paramName]) {
			this.controllers[paramName] = [];
			this.data.watch(paramName, function (prop, oldValue, value) {
				that.dispatchUI(that.controllers[prop], value);
			});
		}

		this.controllers[paramName].push(controller);
	}
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

var PerunaController = function (module, el, dataCollection, data) {
	this.module = module;
	this.el = el;
	this.paramName = el.getAttribute('p-bind');
	this.dataCollection = dataCollection;
	this.data = dataCollection[this.paramName];

	el.addEventListener('change', this, false);
	el.addEventListener('keyup', this, false);

	var i = 0;
	this.change(this.data);

	var that = this;
}

PerunaController.prototype.handleEvent = function (e) {
	console.log(e);

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
	this.dataCollection[this.paramName] = value;
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
	value: function (property, callback) {
		var oldValue = this[property];
		var newValue = oldValue;

		var getter = function () {
			return newValue;
		}

		var setter = function (value) {
			oldValue = newValue;
			newValue = value;
			callback.call(this, property, oldValue, value);
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