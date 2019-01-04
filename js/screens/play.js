game.PlayScreen = me.ScreenObject.extend({
    onResetEvent : function () {
      me.levelDirector.loadLevel("tim3");
      me.audio.playTrack("dst-inertexponent");
      game.data.score = 0;
      game.data.health = 3;
      this.HUD = new game.HUD.Container();
      me.game.world.addChild(this.HUD);

    },
    onDestroyEvent : function () {
      me.game.world.removeChild(this.HUD);
      me.audio.stopTrack();
    }
});