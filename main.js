var Game = Game || {};
var Enemy = Enemy || {};


function clone(obj) {
    'use strict';
    // A clone of an object is an empty object 
            // with a prototype reference to the original.

    // a private constructor, used only by this one clone.
    function Clone() {}
    Clone.prototype = obj;
    var c = new Clone();
    c.constructor = Clone;
    return c;
}



function Enemy(enemyName, enemyHp, enemyLevel, enemyImage) {
    'use strict';
    var name, maxHp, currentHp, minLevel, image;
    
    this.name = enemyName;
    this.maxHp = enemyHp;
    this.currentHp = enemyHp;
    this.minLevel = enemyLevel;
    this.image = enemyImage;
    
    this.getHit = function (damage, damageType) {
        this.currentHp = this.currentHp - damage;
        if (this.currentHp <= 0) {
            this.doDead();
        }
    };
        
    this.doDead = function () {
        Game.setNextEnemy();
    };
}


Game.Launch = function () {
    'use strict';
        
    var characterClickthing,
        counterPane,
        friendlyCharacters = [],
        currentChar,
        totalClicks,
        currentEnemy,
        enemeyPortrait,
        enemyHpBar,
        enemyHpBarWidth;
    
    Game.totalClicks = 0;
    Game.enemies = [];

    //this.enemies.push({name: 'Tortoise', hp: 50, minLevel: 0, image: "url(./resources/images/tortoise.png)"});
    //this.enemies.push({name: "Snake", hp: 50, minLevel: 0, image: "url(./resources/images/snake.png)"});
    
    
    this.enemies.push(new Enemy("Tortoise", 50, 0, "url(./resources/images/tortoise.png)"));
    this.enemies.push(new Enemy("Snake", 50,  0, "url(./resources/images/snake.png)"));
    
    Game.updateCounterPane = function () {
        Game.counterPane.innerHTML = "Clicks: " + Game.totalClicks;
    };

    this.updateFrames = function () {
        this.updateEnemyHpBar();
    };
    
    this.updateEnemyHpBar = function () {
        var actualWidth = (Game.currentEnemy.currentHp / Game.currentEnemy.maxHp) * this.enemyHpBarWidth;
        this.enemyHpBar.style.width = actualWidth;
    };
    
    Game.onCharacterClick = function () {
        //Enemy.damage(1, 'blunt');
        Game.totalClicks = Game.totalClicks + 1;
        Game.updateCounterPane();
        this.updateFrames();
        this.currentEnemy.getHit(1);
    };
    
    Game.setNextEnemy = function () {
        var rand;
        rand = Math.floor(Math.random() * this.enemies.length);
        //randEnemy = this.enemies[Math.floor(Math.random() * this.enemies.length)];
        
        this.currentEnemy = clone(this.enemies[rand]);
       
        this.enemeyPortrait.style.backgroundImage = this.currentEnemy.image;
        this.updateFrames();
    };
    
    /**
    * Should maybe get a random enemy too. Random available enemies and such.
    */
    Game.getEnemy = function (enemyName) {
        var enemy, i;
        for (i  = 0; i < this.enemies.length; i + 1) {
            enemy = this.enemies[i];
            if (enemy.name === enemyName) {
                return enemy;
            }
        }
    };
    
    Game.showOnCounterPane = function (thing) {
        this.counterPane.innerHTML += "<br/>" + thing;
    };

    Game.setupCleanGame = function () {
        this.currentEnemy = clone(this.getEnemy("Tortoise"));
        
        this.counterPane = document.getElementById("counterPane");
        this.characterClickThing = document.getElementById("characters");
        this.enemeyPortrait = document.getElementById("enemyPortrait");
        this.enemyHpBar = document.getElementById("enemyHpBar");
        this.enemyHpBarWidth = this.enemyHpBar.clientWidth;
        
        this.characterClickThing.addEventListener("click",  function () {Game.onCharacterClick(); });
        
        this.updateCounterPane();
    };

};

function onLoad() {
    'use strict';
    Game.Launch();
    
    //Game.characterClickThing = document.getElementById("characters");
    
    Game.setupCleanGame();
    
}

