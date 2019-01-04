var game = {
    data : {
      score : 0,
      hp: 3
    },
    onload : function () {
      if (!me.video.init(640, 480, {wrapper : "screen", scale : "auto", scaleMethod : "flex-width"})) {
        alert("Your browser does not support HTML5 canvas.");
        return;
      }
      if (me.game.HASH.debug === true) {
        window.onReady(function () {
          me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
        });
      }

      me.audio.init("mp3,ogg");
      me.loader.onload = this.loaded.bind(this);
      me.loader.preload(game.resources);
      me.state.change(me.state.LOADING);
    },
  
    // Run on game resources loaded.
    loaded : function () {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.END, new game.EndScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.transition("fade", "#FFFFFF", 250);
  
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("CoinEntity", game.CoinEntity);
        me.pool.register("HeartEntity", game.HeartEntity);
        me.pool.register("RunningEnemy", game.RunningEnemy);
        me.pool.register("JumpingEnemy", game.JumpingEnemy);
        me.pool.register("ShootingEnemy", game.ShootingEnemy);
        me.pool.register("bullet", game.Bullet);
        me.pool.register("enemyBullet", game.EnemyBullet);

        me.input.bindKey(me.input.KEY.UP,  "jump");
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.SPACE, "jump", true);
        me.input.bindKey(me.input.KEY.A,  "left");
        me.input.bindKey(me.input.KEY.D, "right");
        me.input.bindKey(me.input.KEY.W, "jump", true);
        me.input.bindKey(me.input.KEY.Z, "shoot", true);
    
        me.state.change(me.state.MENU);
    }
};