/**
 * Created by salt on 03.09.2016.
 */
(function() {
	"use strict";
	var gui,
		preGameFolder;

	//dat gui helper function
	dat.GUI.prototype.removeFolder = function(name) {
		var folder = this.__folders[name];
		if (!folder) {
			return;
		}
		folder.close();
		this.__ul.removeChild(folder.domElement.parentNode);
		delete this.__folders[name];
		this.onResize();
	}

	$("document").ready(function() {
		gui = new dat.GUI();
		addPreGameFolder();
	});
	var testObj = window.crazy = {
		testValue: 42
	};

	function addPreGameFolder() {
		var bla = new DatGuiFolderWrapper("bla");
		preGameFolder = new DatGuiFolderWrapper("achtungkurve");
		preGameFolder.add("Don't panic!", testObj, "testValue", "red");
		//bla.destroy();
		// preGameFolder.datGuiFolder.parent.destroy(preGameFolder.datGuiFolder);
		//preGameFolder.addFolder("sub Folder");
		// preGameFolder.add("Player", testObj, "testValue", "red");
		// preGameFolder.add("Don't panic!", testObj, "testValue", "red");
	}
	function removePreGameFolder() {
		preGameFolder.datGuiFolder.destroy(preGameFolder.datGuiFolder);
	}
	class DatGuiFolderWrapper {
		constructor(name, parent = null) {
			if (parent != null && !("datGuiFolder" in parent)) {
				console.error("parent type is not DatGuiFolderWrapper!");
				return;
			}
			this.name = name;
			this.destroyed = true;
			this.items = {};
			this.parent = (parent == null)? gui: parent.datGuiFolder;
			this.datGuiFolder = this.parent.addFolder(this.name || "No Name");
		}
		add(name, object, property, typeColor) {
			if (name in this.items) {
				console.warn("gui folder name '%s%' already taken!", name);
				return;
			}
			var item = {
				name: name,
				object: object,
				propName: property,
				typeColor: typeColor,
			};
			//routing object
			item["valueObject"] = {};
			//getter method for the right prop name. returns real value
			Object.defineProperty(item["valueObject"], name, {
				get: function () {
					return object[property];
				}
			});
			item.datGuiItem = this.datGuiFolder.add(item["valueObject"], name).listen();
			if(typeColor != null) {
				$(item.datGuiItem.__li).css("border-left", "3px solid " + typeColor);
			}
			this.items[name] = item;
			return item;
		}
		addColor(object, property) {
			return this.datGuiFolder.addColor(object, property);
		}
		addFolder(name) {
			return new DatGuiFolderWrapper(name, this);
		}
		open() {
			return this.datGuiFolder.open();
		}
		close() {
			return this.datGuiFolder.close();
		}
		remove(item) { //item name or item
			return this.datGuiFolder.remove(item);
		}
		removeFolder(name) {
			this.datGuiFolder.removeFolder(name);
		}
		destroy() {
			this.destroyed = true;
			this.parent.removeFolder(this.name);
		}
	}

	class DatGui extends Game.classes.Module {
		constructor() {
			super();
			this.pointsGui;
			this.nameMaping = {};
			this.datGuiPointControllers = [];
		}
		onGameInit() {
			//removePreGameFolder();
			return;
			var conf = super.getConfig();

			this.pointsGui = new DatGuiFolderWrapper("POINTS");
			for (var i = 0; i < conf.player.length; i++) {
				var player = conf.player[i];
				//player name
				this.nameMaping[player.name] = player.points;
				//assign right colors
				this.datGuiPointControllers.push(this.pointsGui.add("", this.nameMaping, player.name));
				//player alive or dad
			}
			this.pointsGui.open();
		}
		updatePoints() {
			var conf = super.getConfig();
			for (var i = 0; i < conf.player.length; i++) {
				this.nameMaping[conf.player[i].name] = conf.player[i].points;
			}
			for (var i = 0; i < this.datGuiPointControllers.length; i++) {
				this.datGuiPointControllers[i].updateDisplay();
			}
		}
		onPlayerDied(player) {
			this.updatePoints();
		}
		onRoundEnd() {
			this.updatePoints();
		}
	}
	Game.register("DatGui", DatGui);
	Game.createDatGuiFolder = function(folderName) {
		return new DatGuiFolderWrapper(folderName);
	};
})();