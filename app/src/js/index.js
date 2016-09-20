$(function(){
  var app = function() {

    var $gameConfig = $('#game-config');
    var $gameCanvas = $('#game-canvas');
    var game;

    function init() {
      $('#start-game-btn').click(function(e){
        $gameConfig.hide();

        var config = {
          player: [{
            id: 0,
            name: "stefan",
            color: "red",//!
            inputs: {//!
              left: 39,
              special: 40,
              right: 37
            }
          }, {
            id: 1,
            name: "felix",
            color: "blue",//!
            inputs: {//!
              left: 68,
              special: 83,
              right: 65
            }
          }],
          dom: $gameCanvas
        };
        $gameCanvas.show();
        game = Game.init(config);

      });

    };

    return {
      init: init,
    }
  }
apppp = app();
apppp.init();

});
