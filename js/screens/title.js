game.TitleScreen = me.ScreenObject.extend({
  onResetEvent : function () {
    var backgroundImage = new me.Sprite(0, 0, {
            image: me.loader.getImage('title_screen'),
        }
    );
    backgroundImage.anchorPoint.set(0, 0);
    backgroundImage.scale(me.game.viewport.width / backgroundImage.width, me.game.viewport.height / backgroundImage.height);
    me.game.world.addChild(backgroundImage, 1);
    me.game.world.addChild(new (me.Renderable.extend ({
      init : function () {
        this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
        this.font = new me.BitmapFont(me.loader.getBinary('04b_30'), me.loader.getImage('04b_30'));
        this.font.set('center', 1);
      },
      update : function (dt) {
        return true;
      },
      draw : function (renderer) {
        this.font.draw(renderer, "PRESS ENTER TO PLAY", me.game.viewport.width, me.game.viewport.height);
      }
    })), 2);
    me.input.bindKey(me.input.KEY.ENTER, "enter", true);
    me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER);
    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
      if (action === "enter") {
        me.audio.play("cling");
        me.state.change(me.state.PLAY);
      }
    });
  },
  onDestroyEvent : function () {
    me.input.unbindKey(me.input.KEY.ENTER);
    me.input.unbindPointer(me.input.pointer.LEFT);
    me.event.unsubscribe(this.handler);
  }
});