game.HUD = game.HUD || {};
game.HUD.Container = me.Container.extend({
    init: function() {
        this._super(me.Container, 'init');
        this.isPersistent = true;
        this.floating = true;
        this.name = "HUD";
        this.addChild(new game.HUD.ScoreItem(-10, -10));
        this.addChild(new game.HUD.HealthItem(-10, -10));
    }
});

game.HUD.ScoreItem = me.Renderable.extend({
    init: function(x, y) {
        this._super(me.Renderable, 'init', [x, y, 10, 10]);
        this.font = new me.BitmapFont(me.loader.getBinary('04b_30'), me.loader.getImage('04b_30'));
        this.font.textAlign = "right";
        this.font.textBaseline = "bottom";

        // local copy of the global score
        this.score = -1;
        this.hp = -1;
    },
    update : function () {
        if (this.score !== game.data.score) {
            this.score = game.data.score;
            return true;
        }
        return false;
    },
    draw : function (renderer) {
        this.font.draw (renderer, game.data.score, me.game.viewport.width + this.pos.x, 50 + this.pos.y);
    }
});

game.HUD.HealthItem = me.Renderable.extend({
    init: function(x, y) {
        this._super(me.Renderable, 'init', [x, y, 10, 10]);
        this.heart = me.loader.getImage('heart');
        this.hp = -1;
    },
    update : function () {
        if (this.hp !== game.data.hp) {
            this.hp = game.data.hp;
            return true;
        }
        return false;
    },
    draw : function (renderer) {
        var offset = 1;
        for (var i = 0; i < this.hp; i++) {
            renderer.drawImage(this.heart, ((40 + this.pos.x) * offset), this.pos.y + 24, 32, 32);
            offset++;
        }
    }
});
