function gameBootstrap(conf) {

  var config = {
    player: [],

  }

  $.extend(config, conf);

  function start() {
    if(config.player.length >= 2) {
      for(var i = 0; i < config.player.length; i++) {
        var $playerDom = $('<canvas/>', {id: "canvas-"+config.player[i].id})
                        .prop({
                              width: window.innerWidth,
                              height: window.innerHeight
                          })
                         .appendTo(config.dom);
        var ctx = $playerDom[0].getContext("2d");
        ctx.clearRect(0, 0, $playerDom.width, $playerDom.height);
        config.player[i].$playerDom = $playerDom;
        config.player[i].ctx = ctx;
        config.player[i].direction = new Victor(Math.random(), Math.random()).norm();
        config.player[i].position = new Victor( Math.random() * $(window).width(), Math.random() * $(window).height());
        config.player[i].moveIntent = 0;
        config.player[i].dead = false;
        config.player[i].angle = 1;
        bindInputForPlayer(config.player[i]);
      }

      gameLoop();
    }
  }

  function bindInputForPlayer(player) {
    $(window).on('keydown', function(e) {
      switch(e.which) {
        case player.inputs.left:
          player.moveIntent = 1;
          break;
        case player.inputs.right:
          player.moveIntent = -1;
          break;
      }
    });
    $(window).on('keyup', function(e) {
      if(e.which == player.inputs.left || e.which == player.inputs.right) player.moveIntent = 0;
    });
  }

  function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    for(var i = 0; i < config.player.length && !config.player[i].dead; i++) {
      var p = config.player[i];
      p.direction = rotate(0, 0, p.direction.x, p.direction.y, p.moveIntent * p.angle);
      p.position.add(p.direction);
      drawPlayer(p);
    }
    for(var i = 0; i < config.player.length; i++) {
      config.player[i].dead = checkCollision(config.player[i]);
    }
  }

  function drawPlayer(player) {
    player.ctx.fillStyle = player.color;
    player.ctx.fillRect(player.position.x, player.position.y, 5, 5);
  }

  function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return new Victor(nx, ny);
  }

  function checkCollision(player) {
    for(var i = 0; i < config.player.length; i++) {
      var imgd = config.player[i].ctx.getImageData(player.position.x, player.position.y, 1, 1);
      if(imgd.data[3] != 0) return true;
    }
    return false;
  }

  start();

}
