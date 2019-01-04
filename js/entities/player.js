game.PlayerEntity = me.Entity.extend({
  init : function (x, y, settings) {

    this._super(me.Entity, 'init', [x, y, settings]);
    me.game.player = this;
    this.body.setVelocity(4, 15);
    this.body.setFriction(0.4,0);

    this.dying = false;
    this.faceing = 1;

    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

    this.alwaysUpdate = true;

    this.renderable.addAnimation("walk",  [0, 1, 2, 3, 4]);
    this.renderable.addAnimation("stand",  [{name: 1, delay: 2000}, {name: 4, delay: 100}]);
    this.renderable.setCurrentAnimation("stand");

    this.anchorPoint.set(-0.5, 0);

    this.body.collisionType = me.collision.types.PLAYER_OBJECT
  },
  update : function (dt) {
    if (me.input.isKeyPressed('shoot')) {
      var bullet = me.pool.pull('bullet', (this.pos.x + (this.faceing === 1 ? (32 + game.Bullet.width) : 0)) - game.Bullet.width, (this.pos.y + 32) - game.Bullet.height, this.faceing);
      me.game.world.addChild(bullet);
    }
    if (me.input.isKeyPressed('left')) {
      this.faceing = -1;
      this.renderable.flipX(true);
      this.anchorPoint.set(1.5, 0);
      this.body.vel.x -= this.body.accel.x * me.timer.tick;
      if (!this.renderable.isCurrentAnimation("walk")) {
        this.renderable.setCurrentAnimation("walk");
      }
    } else if (me.input.isKeyPressed('right')) {
      this.faceing = 1;
      this.renderable.flipX(false);
      this.anchorPoint.set(-0.5, 0);
      this.body.vel.x += this.body.accel.x * me.timer.tick;
      if (!this.renderable.isCurrentAnimation("walk")) {
        this.renderable.setCurrentAnimation("walk");
      }
    } else {
      this.body.vel.x = 0;
      if (!this.renderable.isCurrentAnimation('stand')) {
        this.renderable.setCurrentAnimation('stand');
      }
    }
    if (me.input.isKeyPressed('jump')) {
      if (!this.body.jumping && !this.body.falling) {
        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
        this.body.jumping = true;
        me.audio.play("jump");
      }
    }
    this.body.update(dt);
    if (!this.inViewport && (this.pos.y > me.video.renderer.getHeight())) {
      game.data.hp--;
      if (game.data.hp <= 0) {
        me.game.viewport.fadeIn("#fff", 150, function(){
          me.state.change(me.state.END);
        });
      } else {
        me.audio.play("hurt", false);
        me.game.world.removeChild(this);
        me.game.viewport.fadeIn("#fff", 150, function(){
          me.levelDirector.reloadLevel();
        });
      }
      return true;
    }
    me.collision.check(this);
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },
  onCollision : function (response, other) {
    if (other.body.collisionType === me.collision.types.PROJECTILE_OBJECT) {
      return false;
    }
    if (other.type === 'enemyBullet') {
      me.game.world.removeChild(other);
      this.hurt();
      return true;
    }
    switch (response.b.body.collisionType) {
      case me.collision.types.WORLD_SHAPE:
        if (other.type === "platform") {
          if (this.body.falling && !me.input.isKeyPressed('down') && (response.overlapV.y > 0) && (~~this.body.vel.y >= ~~response.overlapV.y)) {
            response.overlapV.x = 0;
            return true;
          }
          return false;
        } else if (other.type === "slope") {
          // response.overlapV.y = Math.abs(response.overlap);
          // response.overlapV.x = 0;
          // return true;
        }
        break;
      case me.collision.types.ENEMY_OBJECT:
        if ((response.overlapV.y > 0) && this.body.falling) {
            this.body.vel.y -= this.body.maxVel.y * 1.5 * me.timer.tick;
            me.audio.play("stomp");
        }
        else {
            this.hurt();
        }
        return true;
      default:
        return false;
    }
    return true;
  },
  hurt : function () {
      if (!this.renderable.isFlickering()) {
        this.renderable.flicker(750, function () {
        });
        game.data.hp--;
        if (game.data.hp <= 0) {
          me.game.viewport.fadeIn("#000000", 75);
          me.state.change(me.state.END);
        }
        me.game.viewport.fadeIn("#FFFFFF", 75);
        me.audio.play("hurt", false);
      }
  },
});
 