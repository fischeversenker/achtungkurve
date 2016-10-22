(function bootstrap() {
	"use strict";
	/**
	 * @name Game
	 * @property {Object} 					Game.modules
	 * @property {Object} 					Game.pickups
	 * @property {Object} 					Game.classes
	 * @property {function(Object)} 		Game.init
	 * @property {function(name, classObj)} Game.register
	 */

	/** @type {Game|*} */
	var Game = {
		modules: {},
		pickups: {},
		classes: {}
	};
	/**
	 * @name config
	 * @property {Array.<Player>} 				Config.player
	 * @property {Array.<Modules>} 				Config.modules
	 * @property {Array.<string>} 				Config.pickups
	 * @property {number} 						Config.width
	 * @property {number} 						Config.height
	 * @property {boolean} 						Config.inMatch
	 * @property {CanvasRenderingContext2D}		Config.underlayCtx
	 * @property {CanvasRenderingContext2D}		Config.ctx
	 */

	/** @typeof {config} */
	var config;

	var mods = [],	//loaded mods
		partyCheck = null,
		lastUpdate = Date.now(),
		deltaTime = 0,
		activeEntities = [];

	var	defaultConfig = {
		player: [],
		modules: [
			"Overlay",
			"DataGui",
			"GamePlay"
		],
		pickups: [
			// "SpeedBoost",
			// "SpeedBoostSpecial",
			"Bazuka"
		],
		width: window.innerWidth,
		height: window.innerHeight,
		inMatch: false,
		startGameTime: 2000,
	};

	window.Game = Game;
	var Events = {
		listeners: {
			onGameInit: [],
			onRoundStart: [],
			onRoundEnd: [],
			onTick: [],
			onPostTick: [],
			onPlayerDied: [],
			onPartyCheck: [],
			onPartyReady: [],
		},
		bindEntity: function (entity) {
			var methods = Object.getOwnPropertyNames(Object.getPrototypeOf(entity));
			for(var i = 0; i < methods.length; i++) {
				if (methods[i] in this.listeners && methods[i] != "constructor") {
					this.listeners[methods[i]].push(entity);
				}
			}
		},
		unbindEntity: function(entity) {
			//@todo implement unbindEntity
		},
		fire: function(type, ...args) {
			if (!(type in this.listeners)) return;
			for(var i = 0; i < this.listeners[type].length; i++) {
				this.listeners[type][i][type].call(this.listeners[type][i], ...args);
			}
		}
	};
	/**
	 * Game.init
	 * @param conf
	 * @returns {boolean}
	 */
	Game.init = function (conf) {
		config = $.extend({} ,defaultConfig, conf);

		if (config.player.length < 2) {
			console.error("I need at least 2 players'");
			return false;
		}

		//create underlay canvas
		var $underlay = $('<canvas/>', {id: "canvas-underlay"})
			.prop({
				width: window.innerWidth,
				height: window.innerHeight,
				style: "z-index: -10"
			})
			.appendTo(config.dom);
		config.underlayCtx = $underlay[0].getContext("2d");

		this.$playerDom = $('<canvas/>', {id: "canvas-player"})
			.prop({
				width: window.innerWidth,
				height: window.innerHeight
			})
			.appendTo(config.dom);
		config.ctx = this.$playerDom[0].getContext("2d");

		//player init
		var players = [],
        i;
		for (i = 0; i < config.player.length; i++) {
			players.push( new Player(config.player[i]) );
		}
		config.player = players;

		//module init
		for (i = 0; i < config.modules.length; i++) {
			try {
				var mod = new Game.modules[config.modules[i]]();
				Game.activateEntity(mod);
				mods.push(mod);
			} catch (e) {
				console.log(Game.modules[config.modules[i]]);
				console.error(e);
				console.error("can't instantiate module: '" + config.modules[i] + "' -> is the module js included in the HTML?");
			}
		}

		for(let i = 0; i < config.player.length; i++) {
			config.player[i].dead = true;
			Game.activateEntity(config.player[i]);
		}
		gameLoop();
		Events.fire("onGameInit");
		startRound();
	};
	/**
	 * @param {string} 			name
	 * @param {object} 			classObj
	 * @param {Array.<string>} 	dependencies
	 */
	Game.register = function (name, classObj, dependencies = []) {
		//@todo save dependencies
		if (classObj.prototype instanceof Game.classes.Pickup) {
			Game.pickups[name] = classObj;
		} else {
			Game.modules[name] = classObj;
		}
	};
	// Game.create = function (name, classObj, dependencies = []) {
	// 	//@todo save dependencies
	// 	Game.modules[name] = classObj;
	// };
	/**
	 * @param {Entity} entity
	 */
	Game.activateEntity = function(entity) {
		Events.bindEntity(entity);
		activeEntities.push(entity);
	};
	/**
	 * @param {Entity} entity
	 */
	var needDeactivation = [];
	Game.deActivateEntity = function(entity) {
		needDeactivation.push(entity);
	};

	function clearField() {
		config.ctx.clearRect(0, 0, config.width, config.height);
		//@todo remove pickups
		//@todo call clear event (so that modules can also clear something)
	}
	function startRound() {
		checkParty(function() {
			// window.setTimeout(function() {
				clearField();
				startCountDown(2250, function() {
					config.inMatch = true;
					Events.fire("onRoundStart");
				});
			// }, config.startGameTime);
		});
	}
	function checkParty(fn) {
		Events.fire("onPartyCheck");
		if (partyCheck !== null) return false;
		//check for all special keys
		partyCheck = function() {
			var sum = 0;
			for (var i = 0; i < config.player.length; i++) {
				sum += (config.player[i].specialIntent) ? 1 : 0;
			}
			if (sum >= config.player.length) {
				partyCheck = null;
				Events.fire("onPartyReady");
				if (typeof fn === "function") fn.call();
			}
		};
	}
	function startCountDown(time, fn) {
		var count = 0;
		var a = setInterval(function() {
			count += time / 3;
		}, time / 3);
		setTimeout(function() {
			clearInterval(a);
			fn.call();
		}, time + 1);
	}
	function gameLoop() {
		window.requestAnimationFrame(gameLoop);
		var now = Date.now();
		deltaTime = now - lastUpdate;
		lastUpdate = now;

		config.underlayCtx.clearRect(0, 0, config.width, config.height);
		Events.fire("onTick", deltaTime);

		for(var i = 0; i < activeEntities.length; i++) {
			activeEntities[i].tick.call(activeEntities[i], deltaTime);
			activeEntities[i].draw.call(activeEntities[i], deltaTime);
		}
		//check palyer collision
		for(let i = 0; i < config.player.length; i++) {
			if (config.player[i].dead) continue;
			if (checkCollision(config.player[i])) {
				killPlayer(config.player[i]);
			}
		}
		Events.fire("onPostTick");

		if (needDeactivation.length > 0) {
			for(let i = 0; i < needDeactivation.length; i++) {
				Events.unbindEntity(needDeactivation[i]);
				let index = activeEntities.indexOf(needDeactivation[i]);
				if (index > -1) {
					activeEntities.splice(index, 1);
				}
			}
			needDeactivation = [];
		}
		if (!config.inMatch && partyCheck !== null) partyCheck.call(null, deltaTime);
	}
	/**
	 *
	 * @param {Player} player
	 */
	function killPlayer(player) {
		player.dead = true;
		//update match score
		var deadCount = 0;
		for (var i = 0; i < config.player.length; i++) {
			if (!config.player[i].dead) {
				config.player[i].points += 1;
			} else {
				deadCount++;
			}
		}
		Events.fire("onPlayerDied", player);
		if (deadCount >= config.player.length - 1) {
			config.inMatch = false;
			Events.fire("onRoundEnd");
			startRound();
		}
	}
	/**
	 * @param {Player} player
	 * @returns {boolean} true if there is a collision
	 */
	function checkCollision(player) {
		var checkPoint = player.direction.clone().add(player.position);
		var imgd = config.ctx.getImageData(Math.round(checkPoint.x), Math.round(checkPoint.y), 1, 1);
		if (imgd.data[3] !== 0) return true;

		return false;
	}

	/***********************
	* External Api Classes *
	***********************/

	/**
	 * Base game Entity
	 * @name Entity
	 * @property {boolean} 		Entity._alive
	 * @property {Victor} 		Entity.position
	 * @property {function()} 	Entity.getConfig
	 * @property {function()} 	Entity.dispose
	 */
	class Entity {
		/**
		 * @param {Victor} position
		 */
		constructor(position) {
			this._alive = true;
			this.position = position || new Victor(-100, -100);
		}
		dispose() {
			this._alive = false;
			Events.unbindEntity(this);
			Game.deActivateEntity(this);
		}
		/**
		 * @returns {Config}
		 */
		getConfig() {
			return config;
		}
		tick(delta) {}
		draw() {}
	}
	Game.classes.Entity = Entity;
	/**
	 * Base Module
	 */
	class Module extends Entity {
		constructor(position) {
			super(position);
		}
	}
	Game.classes.Module = Module;
	/**
	 * @name 	 Player
	 * @property {jQuery} 						Player.$playerDom
	 * @property {CanvasRenderingContext2D}		Player.ctx
	 * @property {Victor} 						Player.direction
	 * @property {number} 						Player.moveIntent
	 * @property {number} 						Player.steerForce
	 * @property {number} 						Player.size
	 * @property {number} 						Player.speed
	 * @property {boolean} 						Player.dead
	 * @property {number} 						Player.id
	 * @property {string} 						Player.name
	 * @property {string} 						Player.color
	 * @property {object} 						Player.inputs
	 * @property {Array.<Mutator>} 				Player.activeMutator
	 */
	class Player extends Entity {
		constructor(conf) {
			super(conf.position || new Victor(Math.random() * 400, Math.random() * 400));
			this.ctx = config.ctx;
			this.direction = new Victor(1, 1);
			this.steerForce = 50;
			this.size = 2;
			this.speed = 1;
			this.dead = false;
			this.points = 0;
			this.id = conf.id || Math.round(Math.random() * 9999) + 1000;
			this.name = conf.name || (Math.round(Math.random() * 999999) + 1000000).toString(16);
			this.color = conf.color;
			this.inputs = conf.inputs;
			this.activeMutator = [];
			this.moveIntent = 0;
			this.specialIntent = false;
			this.bindInputs(conf);
		}
		onRoundStart() {
			this.dead = false;
		}
		onRoundEnd() {
			this.dead = true;
			this.clearMutators();
		}
		onPlayerDied(player) {
			if (player === this) {
				this.clearMutators();
			}
		}
		clearMutators() {
			var mutatorBack = this.activeMutator.slice();
			for (var i = 0; i < mutatorBack.length; i++) {
				mutatorBack[i].detach();
			}
		}
		bindInputs() {
			var player = this;
			$(window).on('keydown', function (e) {
				switch (e.which) {
					case player.inputs.left:
						player.moveIntent = 1;
						break;
					case player.inputs.right:
						player.moveIntent = -1;
						break;
					case player.inputs.special:
						player.specialIntent = true;
						player.special(true);
						break;
				}
			});
			$(window).on('keyup', function (e) {
				if (e.which == player.inputs.left || e.which == player.inputs.right) player.moveIntent = 0;
				if (e.which == player.inputs.special) {
					player.specialIntent = false;
					player.special(false);
				}
			});
		}
		special(pressed) {
			if (this.activeMutator.length < 1) return;
			if (this.activeMutator[0].mutatorType === "special") {
				if (pressed) this.activeMutator[0].mutate();
        else this.activeMutator[0].unMutate();
			}
		}
		/**  mutable interface  **/
		addMutator(mutator) {
			var index = this.activeMutator.push(mutator) - 1;
			if (index === 0 && mutator.mutatorType === "default") {
				mutator.mutate();
				console.log("mutate");
			}
		}
		removeMutator(mutator) {
			var index = this.activeMutator.indexOf(mutator);
			if (index > -1) {
				this.activeMutator.splice(index, 1);
			}
			if (this.activeMutator.length > 0 && this.activeMutator[0].mutatorType === "default")
				this.activeMutator[0].mutate();
		}
		/**  mutable interface end **/
		tick(delta) {
			if (this.dead) return;
			this.direction.rotateDeg(this.moveIntent * this.steerForce * this.speed / delta);
			this.position.add(this.direction.clone().multiplyScalar(this.speed));
			//check field outs'
			if (this.position.x < 0) {
				this.position.x += config.width;
			} else if (this.position.x > config.width) {
				this.position.x -= config.width;
			}
			if (this.position.y < 0) {
				this.position.y += config.height;
			} else if (this.position.y > config.height) {
				this.position.y -= config.height;
			}
		}
		draw() {
			if (this.dead) return;
			//draw on the player's canvas
			this.ctx.fillStyle = this.color;
			var radius 	= new Victor(this.size, this.size),
				center 	= this.position.clone().add(this.direction.clone().invert()),
				left  	= this.direction.clone().multiply(radius).rotateDeg(90).add(center),
				right 	= this.direction.clone().multiply(radius).rotateDeg(-90).add(center);

			this.ctx.strokeStyle = this.color;
			this.ctx.beginPath();
			this.ctx.moveTo(left.x, left.y);
			this.ctx.lineTo(right.x, right.y);
			this.ctx.stroke();
			this.ctx.closePath();

			// this.ctx.arc(center.x, center.y, this.size, 0, 2 * Math.PI);
			// this.ctx.fill();
			// this.ctx.closePath();
		}
	}


	/**
	 * @name Mutator
	 *
	 */
	class Mutator extends Entity {
		/**
		 * @param {string} type can be "default", "special"
		 * @param position
		 */
		constructor(type, position) {
			super(position);
			this.owner = null;
			this.maxDuration = 3000;
			this.duration = 0;
			this.mutatorType = type || 'default';//default, press, hold
			this.isMutated = false;
		}
		attach(mutable) {
			this.owner = mutable;
			this.owner.addMutator(this);
			if ("pickedUp" in this) this.pickedUp(mutable);
		}
		detach() {
			if (this.isMutated) this.unMutate();
			this.owner.removeMutator(this);
			this.owner = null;
		}
		tick(delta) {
			super.tick(delta);
			if (this.owner !== null) {
				if (this.isMutated) {
					this.duration += delta;
					if (this.duration >= this.maxDuration) {
						this.detach();
					}
				}
			}
		}
		mutate() {
			if (!this.isMutated) {
				this.isMutated = true;
				this.onMutate();
			}
		}
		unMutate() {
			if (this.isMutated) {
				this.isMutated = false;
				this.OnUnMutate();
			}
		}
		onMutate() {}
		OnUnMutate() {}
	}
	Game.classes.Mutator = Mutator;
	/**
	 * @name Pickup
	 * @property {Player} 	Pickup.owner
	 * @property {number} 	Pickup.radius
	 * @property {number} 	Pickup.maxDuration
	 * @property {number} 	Pickup.duration
	 */
	class Pickup extends Mutator {
		constructor(type, position) {
			super(type, position);
			var conf = super.getConfig();
			this.ctx = conf.underlayCtx;
			this.radius = 20;
			this.color = 'yellow';
		}
		tick(delta) {
			super.tick(delta);
			if (this.owner === null) {
				var p = this.checkCollision();
				if (p !== false) {
					this.attach(p);
				}
			}
		}
		draw(delta) {
			super.draw(delta);
			if (this.owner === null) {
				this.ctx.beginPath();
				this.ctx.fillStyle = this.color;
				this.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
				this.ctx.fill();
			}
		}
		checkCollision() {
			for (var i = 0; i < config.player.length; i++) {
				var distance = config.player[i].position.distance(this.position);
				if (distance < this.radius) {
					return config.player[i];
				}
			}
			return false;
		}
	}
	Game.classes.Pickup = Pickup;
})();
