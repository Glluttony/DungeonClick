var Game = Game || {};
var Enemy = {};


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


Game.Launch = function () {
    'use strict';
        
    var characterClickthing,
        counterPane,
        friendlyCharacters = [],
        currentChar,
        totalClicks,
        currentEnemy,
        enemeyPortrait;
    
    Game.totalClicks = 0;
    Game.enemies = [];
    

    this.enemies.push({name: 'Tortoise', hp: 50, minLevel: 0, image: "url(./resources/images/tortoise.png)"});
    this.enemies.push({name: "Snake", hp: 50, minLevel: 0, image: "url(./resources/images/snake.png)"});
    
    
    Game.updateCounterPane = function () {
        Game.counterPane.innerHTML = "Clicks: " + Game.totalClicks;
    };

    Game.onCharacterClick = function () {
        //Enemy.damage(1, 'blunt');
        Game.totalClicks = Game.totalClicks + 1;
        Game.updateCounterPane();
        Game.checkEnemy(10);
    };

    Game.checkEnemy = function (damage) {
        this.currentEnemy.hp = this.currentEnemy.hp - damage;
        if (this.currentEnemy.hp <= 0) {
            this.setNextEnemy();
        }
    };
    
    Game.setNextEnemy = function () {
        var rand;
        rand = Math.floor(Math.random() * this.enemies.length);
        //randEnemy = this.enemies[Math.floor(Math.random() * this.enemies.length)];
        
        this.currentEnemy = clone(this.enemies[rand]);
       
        this.enemeyPortrait.style.backgroundImage = this.currentEnemy.image;
    };
    
    /**
    * Should maybe get a random enemy too. Random available enemies and such.
    */
    Game.getEnemey = function (enemyName) {
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
        //Game.currentEnemy = Enemy.Create("spider", 10);
       
        this.currentEnemy = clone(this.getEnemey("Tortoise"));
        
        //Game.characterClickThing = document.getElementById("characters");
        this.counterPane = document.getElementById("counterPane");
        this.characterClickThing = document.getElementById("characters");
        this.enemeyPortrait = document.getElementById("enememyPortrait");
        
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

