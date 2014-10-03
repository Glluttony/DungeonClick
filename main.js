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



function Enemy(enemyName, enemyHp, enemyLevel, enemyReward, enemyImage) {
    'use strict';
    var name, maxHp, currentHp, minLevel, reward, image;
    
    this.name = enemyName;
    this.maxHp = enemyHp;
    this.currentHp = enemyHp;
    this.minLevel = enemyLevel;
    this.image = enemyImage;
    this.reward = enemyReward;
    
    this.getHit = function (damage, damageType) {
        this.currentHp = this.currentHp - damage;
        if (this.currentHp <= 0) {
            this.doDead();
        }
    };
        
    this.doDead = function () {
        Game.totalKills = Game.totalKills + 1;
        Game.grantRewards(this.reward);
        Game.adjustEnemeyHpModifier();
        Game.setNextEnemy();
    };
    
    this.adjustHP = function (modifier) {
        this.currentHp = this.currentHp + modifier;
        this.maxHp = this.currentHp;
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
        totalKills,
        totalCurrency,
        currentCurrency,
        currentEnemy,
        currentParty,
        enemeyPortrait,
        enemyHpBar,
        enemyHpBarText,
        enemyHpBarWidth,
        enemyHpModifier,
        characterLeft,
        characterRight,
        characterTop,
        characterBottom;
    
    Game.totalClicks = 0;
    Game.totalKills = 0;
    Game.totalCurrency = 0;
    Game.currenCurrency = 0;
    Game.enemies = [];
    Game.friendlyCharacters = [];
    Game.partyMembers = [];
    Game.maxPartyMembers = 4;
    Game.enemyHpModifier = 0;
    Game.automaticAttackSpeed = 0;
    Game.attacked = false;
    
    //Enemy -> Name, MaxHP, MinLevel, Image
    this.enemies.push(new Enemy("Tortoise", 40, 0, 1, "url(./resources/images/tortoise.png)"));
    this.enemies.push(new Enemy("Snake", 60,  0, 2, "url(./resources/images/snake.png)"));
    
    this.friendlyCharacters.push(new Character("wizard", 2, "url(./resources/images/wizard-1.png)"));
    this.friendlyCharacters.push(new Character("warrior", 5, "url(./resources/images/warrior-1.png)"));
         
    Game.updateCounterPane = function () {
        Game.counterPane.innerHTML = "Clicks: " + Game.totalClicks + " <br/> " +
            "Kills: " + Game.totalKills + " <br/> " +
            "Currency: " + Game.currenCurrency;
    };

    this.updateFrames = function () {
        this.updateEnemyHpBar();
        this.updatePartyMembers();
    };
    
    this.updatePartyMembers = function () {
        if (Game.attacked) {
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
            Game.attacked = false;
        }
    };
    
    this.updateEnemyHpBar = function () {
        var actualWidth = (Game.currentEnemy.currentHp / Game.currentEnemy.maxHp) * this.enemyHpBarWidth;
        this.enemyHpBar.style.width = actualWidth + 1;
        this.enemyHpBarText.innerHTML = this.currentEnemy.currentHp + " / " + this.currentEnemy.maxHp;
    };
    
    Game.onCharacterClick = function () {
        //Enemy.damage(1, 'blunt');
        Game.totalClicks = Game.totalClicks + 1;
        Game.updateCounterPane();
      
        this.currentEnemy.getHit(this.partyMembers[this.currentParty].character.getDamage());
        Game.attacked = true;
        this.updateFrames();
    };
    
    Game.setNextEnemy = function () {
        var rand;
        rand = Math.floor(Math.random() * this.enemies.length);
        //randEnemy = this.enemies[Math.floor(Math.random() * this.enemies.length)];
        
        this.currentEnemy = clone(this.enemies[rand]);
        this.currentEnemy.adjustHP(this.enemyHpModifier);
        
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

    Game.adjustEnemeyHpModifier = function () {
        this.enemyHpModifier = this.enemyHpModifier + 1;
    };
    
    Game.grantRewards = function (rewardAmount) {
        this.totalCurrency = this.totalCurrency + rewardAmount;
        this.currenCurrency = this.currenCurrency + rewardAmount;
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
        this.enemyHpBarText = document.getElementById("enemyhpbartext");
        this.enemyHpBarWidth = this.enemyHpBarText.clientWidth;
        this.updateEnemyHpBar();
        
        this.characterClickThing.addEventListener("click",  function () {Game.onCharacterClick(); });
        
        this.updateCounterPane();
    };

    Game.mainLoop = function () {
        
        //this.currentEnemy.getHit(this.partyMembers[this.currentParty].character.getDamage());
        //this.attacked = true;
        
        this.updateFrames();
        setTimeout(function () {Game.mainLoop(); }, 1000);
    };
    
};

function onLoad() {
    'use strict';
    Game.Launch();

    Game.setupCleanGame();
    
    Game.mainLoop();
}

