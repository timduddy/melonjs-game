game.HeartEntity = me.CollectableEntity.extend({
  init: function (x, y, settings) {
    this._super(me.CollectableEntity, 'init', [x, y , settings]);
  },
  onCollision : function (response, other) {
    if (other.body.collisionType === me.collision.types.PROJECTILE_OBJECT) {
      return false;
    }
    if (other.body.collisionType === me.collision.types.ENEMY_OBJECT) {
      return false;
    }
    me.audio.play("cling");
    game.data.hp++;
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);
    me.game.world.removeChild(this);
  }
});
