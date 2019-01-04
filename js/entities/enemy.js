game.RunningEnemy = me.Entity.extend({
  init: function (x, y, settings) {
    settings.image = "llama";
    var width = settings.width;
    var height = settings.height;
    settings.framewidth = settings.width = 64;
    settings.frameheight = settings.height = 64;
    settings.shapes[0] = new me.Rect(0, 0, 32, settings.frameheight);
    this._super(me.Entity, 'init', [x, y , settings]);
    x = this.pos.x;
    this.startX = x;
    this.endX   = x + width - settings.framewidth
    this.pos.x  = x + width - settings.framewidth;
    this.walkLeft = false;
    this.body.setVelocity(4, 6);
    this.body.collisionType = me.collision.types.ENEMY_OBJECT;
  },
  update : function (dt) {
    if (this.alive) {
      if (this.walkLeft && this.pos.x <= this.startX) {
        this.walkLeft = false;
        this.anchorPoint.set(-0.5, 0);
      } else if (!this.walkLeft && this.pos.x >= this.endX) {
        this.walkLeft = true;
        this.anchorPoint.set(1.5, 0);
      }
      this.renderable.flipX(this.walkLeft);
      this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
    }
    this.body.update(dt);
    me.collision.check(this);
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },
  onCollision : function (response, other) {
    if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
      if (response.b.body.collisionType !== me.collision.types.ENEMY_OBJECT) {
        return false;
      }
      if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
        this.alive = false;
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        var self = this;
        this.renderable.flicker(75, function () {
              me.game.world.removeChild(self);
        });
      }

      return false;
    }
    return true;
  },
});
  
game.JumpingEnemy = me.Entity.extend({
  init: function (x, y, settings) {
    settings.image = "llama";
    var width = settings.width;
    var height = settings.height;
    settings.framewidth = settings.width = 32;
    settings.frameheight = settings.height = 64;
    settings.shapes[0] = new me.Rect(0, 0, 32, settings.frameheight);
    this._super(me.Entity, 'init', [x, y , settings]);
    this.gravity = 0;
    this.body.setVelocity(4, 15);
    this.body.collisionType = me.collision.types.ENEMY_OBJECT;
    // this.renderable.flipX(true);
    this.anchorPoint.set(1.5, 0);
    this.counter = 0;
  },
  update : function (dt) {
    if (this.alive) {
      if (me.game.player.pos.x < this.pos.x) {
        this.renderable.flipX(true);
        this.anchorPoint.set(1.5, 0);
      } else {
        this.renderable.flipX(false);
        this.anchorPoint.set(-0.5, 0);
      }
      if (this.counter === 250) {
        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
        this.body.jumping = true;
        this.counter = 0;
      }
      if (this.counter < 250) {
        this.counter++;
      }
    }
    this.body.update(dt);
    me.collision.check(this);
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },
  onCollision : function (response, other) {
    if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
      if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
        this.alive = false;
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        var self = this;
        this.renderable.flicker(75, function () {
              me.game.world.removeChild(self);
        });
      }
      return false;
    }
    return true;
  },
});
  
game.ShootingEnemy = me.Entity.extend({
  init: function (x, y, settings) {
    settings.image = "llama";
    var width = settings.width;
    var height = settings.height;
    settings.framewidth = settings.width = 32;
    settings.frameheight = settings.height = 64;
    settings.shapes[0] = new me.Rect(0, 0, 32, settings.frameheight);
    this._super(me.Entity, 'init', [x, y , settings]);
    this.direction = -1;
    this.body.setVelocity(4, 8);
    this.body.collisionType = me.collision.types.ENEMY_OBJECT;
    this.anchorPoint.set(1.5, 0);
    this.counter = 0;
    this.alive = true;
  },
  update : function (dt) {
    if (this.alive) {
      if (me.game.player.pos.x < this.pos.x) {
        this.renderable.flipX(true);
        this.anchorPoint.set(1.5, 0);
        this.direction = -1;
      } else {
        this.renderable.flipX(false);
        this.anchorPoint.set(-0.5, 0);
        this.direction = 1;
      }
      if (this.counter === 200) {
        var bulletSettings = {
          image: "spit",
          framewidth: 12, 
          width: 12,
          height: 12,
          frameheight: 12,
          shapes: [new me.Rect(0, 0, 12, 12)]
        };
        var bullet = me.pool.pull('enemyBullet', (this.pos.x + (this.direction === 1 ? (64 + game.Bullet.width) : 0)) - game.Bullet.width, (this.pos.y + 32) - game.Bullet.height, bulletSettings, this.direction);
        me.game.world.addChild(bullet);
        this.counter = 0;
      }
      if (this.counter < 200) {
        this.counter++;
      }
    }
    this.body.update(dt);
    me.collision.check(this);
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },
  onCollision : function (response, other) {
    if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
      if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
        this.alive = false;
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        var self = this;
        this.renderable.flicker(75, function () {
              me.game.world.removeChild(self);
        });
      }
      return false;
    }
    return true;
  },
});
  