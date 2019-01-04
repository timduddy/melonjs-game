game.Bullet = me.Entity.extend({
    init : function (x, y, d) {
        this._super(me.Entity, "init", [x, y, { width: game.Bullet.width, height: game.Bullet.height }]);
        this.z = 5;
        this.direction = d;
        this.body.setVelocity(75, 0);
        this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
        this.gravity = 10;
        this.renderable = new (me.Renderable.extend({
            init : function () {
                this._super(me.Renderable, "init", [0, 0, game.Bullet.width, game.Bullet.height]);
            },
            destroy : function () {},
            draw : function (renderer) {
                var color = renderer.getColor();
                renderer.setColor('#fe7300');
                renderer.fillRect(0, 0, this.width, this.height);
                renderer.setColor(color);
            }
        }));
        this.alwaysUpdate = true;
    },
    update : function (time) {
        if (this.direction === 1) {
            this.body.vel.x += this.body.accel.x * time / 1000;
        } else {
            this.body.vel.x -= this.body.accel.x * time / 1000;
        }
        if ((this.pos.x + this.width <= 0) || (!this.inViewport && (this.pos.x > me.video.renderer.getWidth()))) {
            console.log('removed');
            me.game.world.removeChild(this);
        }
        this.body.update();
        me.collision.check(this);
        return true;
    },
    onCollision : function (res, other) {
        if (other.body.collisionType === me.collision.types.ENEMY_OBJECT) {
            me.game.world.removeChild(this);
            other.renderable.flicker(100, function () {
                me.game.world.removeChild(other);
            });
            return false;
        }
        console.log(other.body.collisionType);
        console.log(me.collision.types.ENEMY_OBJECT);

        return false;
    }
});

game.Bullet.width = 8;
game.Bullet.height = 8;