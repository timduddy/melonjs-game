game.EnemyBullet = me.Entity.extend({
    init : function (x, y, settings, direction) {
        this._super(me.Entity, 'init', [x, y , settings]);
        this.z = 5;
        this.direction = direction;
        this.type = 'enemyBullet';
        this.body.setVelocity(35, 0);
        this.alwaysUpdate = true;
    },
    update : function (time) {
        if (this.direction === 1) {
            this.body.vel.x += this.body.accel.x * time / 1000;
        } else {
            this.body.vel.x -= this.body.accel.x * time / 1000;
        }
        if (this.pos.x + this.width <= 0) {
            me.game.world.removeChild(this);
        }
        this.body.update();
        me.collision.check(this);
        return true;
    },
    onCollision : function (res, other) {

        return false;
    }
});

game.Bullet.width = 12;
game.Bullet.height = 12;