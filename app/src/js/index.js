$(function(){
  var app = function() {

    var $gameConfig = $('#game-config');
    var $gameCanvas = $('#game-canvas');
    var game;

    function init() {


      $('#start-game-btn').click(function(e){
        console.log("starting");
        $gameConfig.hide();

        var config = {
          player: [{
            id: 0,
            name: "stefan",
            color: "red",
            inputs: {
              left: 37,
              right: 39,
            }
          }, {
            id: 1,
            name: "felix",
            color: "blue",
            inputs: {
              left: 65,
              right: 68,
            }
          }],
          dom: $gameCanvas,
        };
        $gameCanvas.show();
        game = gameBootstrap(config);

      });

    };

    return {
      init: init,
    }
  }



  // config game
    // anzahl user und tasten festlegen

  // game-init bei "Start"-Klick

  // loop game
    // update players' pos
    // check collision
    //


apppp = app();
apppp.init();

});
