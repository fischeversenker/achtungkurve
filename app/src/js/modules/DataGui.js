(function() {
	"use strict";
	var gui,
		$gui,
		playersGui;

	$("document").ready(function() {
		$gui = $("<div></div>").appendTo('body');
		$gui.addClass('centered');
		gui = dataGui.create($gui[0]);
		playersGui = gui.add("PlayerConfig", "Player")
		gui.updateAll();
	});
	function bootGame(players) {
		var $gameCanvas = $('#game-canvas');
		var config = {
			player: players,
			dom: $gameCanvas
		};
		$gameCanvas.show();
		Game.init(config);
	}
	class PlayerConfig extends dataGui.nodeTypes.Node {
		constructor(parentDom, name) {
			super();
			this._leaf = true;
			this._editing = -1;
			this.name = "Players";
			this.players = [{
				id: 0,
				name: "stefan",
				color: "red",
				inputs: {
					left: 39,
					special: 40,
					right: 37
				}
			},{
				id: 1,
				name: "felix",
				color: "blue",
				inputs: {
					left: 68,
					special: 83,
					right: 65
				}
			}];
			this._domTemplate = `<li class="folder">
						<div class="content">
							<span class="node-name"></span>
							<span class='right'>Right</span>
							<span class='special'>Special</span>
							<span class='left'>Left</span>
						</div>
						<ul class="children"></ul>
						<div class="start-game">** Start Game **</div>
					</li>`
		}
		update() {
			this._dom.querySelector(".node-name").innerHTML = this.name;
		}
		color(colorString) {
			this._dom.style.borderColor = colorString;
			return this;
		}
		setPlayer(id) {
			if (this._editing > -1) return;
			var func = ['left', 'special', 'right'],
				player = null,
				count = 0;

			this._editing = id;

			for(let i = 0; i < this.players.length; i++) {
				if (this.players[i].id === id) {
					player = this.players[i];
					break;
				}
			}
			if (player === null) console.error("No player with this id!");
			$('.player[data-id="' + id + '"] .content', this._dom).addClass('editing');
			$(document).on('keydown', function keyHandler(e) {
				var keyCode = e.keyCode;

				player.inputs[func[count]] = keyCode;
				$('.player[data-id="' + id + '"] .' + func[count], this._dom).html(String.fromCharCode(keyCode));

				count++;
				if (count > 2) {
					$(document).off('keydown', keyHandler);
					this._editing = -1;
					$('.player[data-id="' + id + '"] .content', this._dom).removeClass('editing');
				}
			}.bind(this))
		}
		createDom() {
			super.createDom();
			var self = this;
			this._dom.querySelector(".content").addEventListener("click", function(e) {
				this.parentNode.classList.toggle("close");
			});

			for(let i = 0; i < this.players.length; i++) {
				let player = this.players[i];
				var $node = $("<li class='player' data-name='"+ player.name +"' data-id='"+ player.id +"'>" +
					"<div class='content'>" +
					"<span class='name'>"+ player.name +"</span>" +
					"<span class='right'>"+ String.fromCharCode(player.inputs.right) +"</span>" +
					"<span class='special'>"+ String.fromCharCode(player.inputs.special) +"</span>" +
					"<span class='left'>"+ String.fromCharCode(player.inputs.left) +"</span></li></div>");
				this._dom.querySelector(".children").appendChild($node[0]);
			}
			$(".player", this._dom).on("click", function(e) {
				self.setPlayer($(this).data("id"))
			});
			$(".start-game", this._dom).on("click", function(e) {
				bootGame(self.players);
			});
		}
	}
	window.dataGui.nodeTypes["PlayerConfig"] = PlayerConfig;

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
			this.datGuiFolder = this.parent.add("Folder", (this.name || "No Name"));
		}
		add(type, name, object, property, typeColor) {
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
			item.datGuiItem = this.datGuiFolder.add(type, name, item["valueObject"], property).listen();
			if(typeColor != null) {
				$(item.datGuiItem.__li).css("border-left", "3px solid " + typeColor);
			}
			this.items[name] = item;
			this.datGuiFolder.updateAll();
			return item;
		}
		addColor(object, property) {
			return this.datGuiFolder.addColor(object, property);
		}
		addFolder(name) {
			return new DatGuiFolderWrapper(name, this);
		}
		open() {
			//return this.datGuiFolder.open();
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

	class DataGui extends Game.classes.Module {
		constructor() {
			super();
			this.pointsGui;
			this.playersGui = playersGui;
			this.nameMaping = {};
			this.datGuiPointControllers = [];
		}
		onGameInit() {
			var conf = super.getConfig();
			this.playersGui.remove();
			this.pointsGui = new DatGuiFolderWrapper("POINTS");
			for (var i = 0; i < conf.player.length; i++) {
				var player = conf.player[i];
				//player name
				this.nameMaping[player.name] = player.points;
				//assign right colors
				this.datGuiPointControllers.push(this.pointsGui.add("Value", player.name, this.nameMaping, player.name));
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
	Game.register("DataGui", DataGui);
	// Game.createDatGuiFolder = function(folderName) {
	// 	return new DatGuiFolderWrapper(folderName);
	// };
})();