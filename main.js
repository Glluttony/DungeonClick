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


function Character(friendlyName, friendlyDamage, friendlyImage) {
    'use strict';
    
    var name, baseDamage, image;
    
    this.name = friendlyName;
    this.baseDamage = friendlyDamage;
    this.image = friendlyImage;
    
    this.getDamage = function () {
        return this.baseDamage;
    };
    
}

function PartyMember(memberCharacter, memberHtmlObject) {
    'use strict';
    
    var character, htmlObject, isActive;
    
    this.character = memberCharacter;
    this.htmlObject = memberHtmlObject;
    this.isActive = false;
    
    this.initiate = function () {
        this.htmlObject.style.backgroundImage = this.character.image;
    };
    
    this.activate = function () {
        this.isActive = true;
        this.htmlObject.style.opacity = 1;
    };
    
    this.deactivate = function () {
        this.isActive = false;
        this.htmlObject.style.opacity = 0.8;
    };
}


Game.Launch = function () {
    'use strict';
        
    var characterClickthing,
        counterPane,
        currentChar,
        totalClicks,
        currentEnemy,
        currentParty,
        enemeyPortrait,
        enemyHpBar,
        enemyHpBarWidth,
        characterLeft,
        characterRight,
        characterTop,
        characterBottom;
    
    Game.totalClicks = 0;
    Game.enemies = [];
    Game.friendlyCharacters = [];
    Game.partyMembers = [];
    Game.maxPartyMembers = 4;
    
    this.enemies.push(new Enemy("Tortoise", 50, 0, "url(./resources/images/tortoise.png)"));
    this.enemies.push(new Enemy("Snake", 50,  0, "url(./resources/images/snake.png)"));
    
    this.friendlyCharacters.push(new Character("wizard", 5, "url(./resources/images/wizard-1.png)"));
    this.friendlyCharacters.push(new Character("warrior", 8, "url(./resources/images/warrior-1.png)"));
         
    Game.updateCounterPane = function () {
        Game.counterPane.innerHTML = "Clicks: " + Game.totalClicks;
    };

    this.updateFrames = function () {
        this.updateEnemyHpBar();
        this.updatePartyMembers();
    };
    
    this.updatePartyMembers = function () {
        if (this.partyMembers.length > 1) {
            this.partyMembers[this.currentParty].deactivate();
            if (this.currentParty >= this.partyMembers.length - 1) {
                this.currentParty = 0;
                this.partyMembers[this.currentParty].activate();
            } else {
                this.currentParty = this.currentParty + 1;
                this.partyMembers[this.currentParty].activate();
            }
        }
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
        this.currentEnemy.getHit(this.partyMembers[this.currentParty].character.getDamage());
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
    
    Game.getFriendly = function (friendlyName) {
        var friendly, i;
        for (i  = 0; i < this.friendlyCharacters.length; i = i + 1) {
            friendly = this.friendlyCharacters[i];
            if (friendly.name === friendlyName) {
                return friendly;
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
        
        //Character stuff
        this.characterTop = document.getElementById("charactertop");
        this.characterBottom = document.getElementById("characterbottom");
        this.characterLeft = document.getElementById("characterleft");
        this.characterRight = document.getElementById("characterright");
        
        var firstMember, secondMember;
        firstMember = new PartyMember(clone(this.getFriendly("wizard")), this.characterRight);
        this.partyMembers.push(firstMember);
        
        firstMember.initiate();
        firstMember.activate();
        this.currentParty = 0;
                
        secondMember = new PartyMember(clone(this.getFriendly("warrior")), this.characterLeft);
        this.partyMembers.push(secondMember);
        
        secondMember.initiate();
        
        //Enemey stuff
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

    Game.setupCleanGame();
    
}

