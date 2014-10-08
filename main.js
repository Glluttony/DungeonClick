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
    
    var name, baseDamage, image, recruited;
    
    this.name = friendlyName;
    this.baseDamage = friendlyDamage;
    this.image = friendlyImage;
    this.recruited = false;
    
    this.getDamage = function () {
        return this.baseDamage;
    };
    
    this.recruit = function () {
        this.recruited = true;
        Game.addRecruit(this);
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

function BuyingToolTip() {
    'use strict';
    var ttElement;
    //this.item = ttItem;
    
    this.init = function () {
        this.ttElement = document.createElement('div');
        this.ttElement.className = 'tooltip';
    };

    /**
    * Title, price, description, flavour, htmn
    */
    this.draw = function (title, price, description, flavour, sourceElement) {
        this.ttElement.innerHTML = "";
        this.ttElement.innerHTML = "<p class='tttitle'>" + title + "</p>" +
            "<p class='ttprice'>" + price + " currency </p>" +
            "<p class='ttdescription'>" + description +  "</p>" +
            "<p class='ttflavour'>" + flavour +  "</p>";
        
        //this.ttElement.position = 'absolute';
        //this.ttElement.style.left = sourceElement.clientLeft + sourceElement.clientWidth;
        this.ttElement.style.left = sourceElement.clientWidth + 1;
        sourceElement.appendChild(this.ttElement);
    };
    
    this.hide = function (sourceElement) {
        sourceElement.removeChild(this.ttElement);
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
        enemyPortrait,
        enemyHpBar,
        enemyHpBarText,
        enemyHpBarWidth,
        enemyHpModifier,
        characterLeft,
        characterRight,
        characterTop,
        characterBottom,
        showcasePane,
        storeButton,
        tavernButton,
        toolTip;
    
    Game.totalClicks = 0;
    Game.totalKills = 0;
    Game.totalCurrency = 0;
    Game.currenCurrency = 0;
    Game.enemies = [];
    Game.friendlyCharacters = [];
    Game.recruitedPartyMembers = [];
    Game.partyMembers = [];
    Game.maxPartyMembers = 4;
    Game.enemyHpModifier = 0;
    Game.automaticAttackSpeed = 0;
    Game.attacked = false;
    Game.toolTip = new BuyingToolTip();
    Game.toolTip.init();
    Game.lastTime = Date.now();
    Game.timeTilNextAttack = 1000;
    
    //Enemy -> Name, MaxHP, MinLevel, Image
    this.enemies.push(new Enemy("Tortoise", 40, 0, 1, "url(./resources/images/tortoise.png)"));
    this.enemies.push(new Enemy("Snake", 60,  0, 2, "url(./resources/images/snake.png)"));
    
    this.friendlyCharacters.push(new Character("wizard", 2, "url(./resources/images/wizard-1.png)"));
    this.friendlyCharacters.push(new Character("warrior", 5, "url(./resources/images/warrior-1.png)"));
    this.friendlyCharacters.push(new Character("cleric", 1, "url(./resources/images/severus_snape.jpg)"));
    this.friendlyCharacters.push(new Character("archer", 6, "url(./resources/images/hulk.jpg)"));
    
    Game.updateCounterPane = function () {
        Game.counterPane.innerHTML = "Clicks: " + Game.totalClicks + " <br/> " +
            "Kills: " + Game.totalKills + " <br/> " +
            "Currency: " + Game.currenCurrency;
    };

    this.updateFrames = function () {
        this.updateEnemyHpBar();
        this.updatePartyMembers();
        this.updateCounterPane();
    };
    
    this.addRecruit = function (recruit) {
        Game.recruitedPartyMembers.push(this);
        if (Game.recruitedPartyMembers.length <= Game.maxPartyMembers) {
            var i, member;
            for (i = 0; i < Game.mamaxPartyMembers; i = i + 1) {
                if (i >= Game.recruitedPartyMembers.length) {
                    break;
                }
                member = Game.recruitedPartyMembers[i];
                if (i === 1) {
                    Game.partyMembers[i] = member;
                    Game.characterRight.style.backgroundImage = member.
                }
            }
        }
    };
    
    this.updatePartyMembers = function () {
        if (this.attacked) {
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
            this.attacked = false;
        }
    };
    
    this.updateEnemyHpBar = function () {
        var actualWidth = (this.currentEnemy.currentHp / this.currentEnemy.maxHp) * this.enemyHpBarWidth;
        this.enemyHpBar.style.width = actualWidth + 1;
        this.enemyHpBarText.innerHTML = this.currentEnemy.currentHp + " / " + this.currentEnemy.maxHp;
    };
    
    Game.onCharacterClick = function () {
        //Enemy.damage(1, 'blunt');
        this.totalClicks = Game.totalClicks + 1;
        
      
        this.currentEnemy.getHit(this.partyMembers[this.currentParty].character.getDamage());
        this.attacked = true;
        this.updateFrames();
    };
    
    Game.setNextEnemy = function () {
        var rand;
        rand = Math.floor(Math.random() * this.enemies.length);
        //randEnemy = this.enemies[Math.floor(Math.random() * this.enemies.length)];
        
        this.currentEnemy = clone(this.enemies[rand]);
        this.currentEnemy.adjustHP(this.enemyHpModifier);
        
        this.enemyPortrait.style.backgroundImage = this.currentEnemy.image;
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

    Game.populateShowcasePane = function (type) {
        var i;
        if (type === "store") {
            this.showcasePane.innerHTML = "";
            for (i = 0; i < itemList.length; i = i + 1) {
                (function () {
                    var item, button;
                    item = itemList[i];
                    if (item.unlocked && !item.bought) {
                        //this.showcasePane.innerHTML = this.showcasePane.innerHTML +
                        button = document.createElement('div');
                        button.className = 'showcaseButton';
                        button.style.backgroundColor = 'blue';
                        button.style.backgroundImage = item.icon;

                        button.addEventListener('mouseover', function () {Game.toolTip.draw(item.name, item.getPrice(), item.toolTip, item.flavourText, button); });
                        button.addEventListener('mouseout', function () {Game.toolTip.hide(button); });
                        button.addEventListener('click', function () {item.buy(Game); Game.populateShowcasePane('store'); });

                        Game.showcasePane.appendChild(button);
                    }
                }());
            }
        } else if (type === "tavern") {
            this.showcasePane.innerHTML = "";
            for (i = 0; i < Game.friendlyCharacters.length; i = i + 1) {
                (function () {
                    var character, button;
                    character = Game.friendlyCharacters[i];
                    if (!character.recruited) {
                        //this.showcasePane.innerHTML = this.showcasePane.innerHTML +
                        button = document.createElement('div');
                        button.className = 'showcaseButton';
                        button.style.backgroundColor = 'blue';
                        button.style.backgroundImage = character.image;

                        button.addEventListener('mouseover', function () {Game.toolTip.draw(character.name, 10, character.name, character.name, button); });
                        button.addEventListener('mouseout', function () {Game.toolTip.hide(button); });
                        button.addEventListener('click', function () {character.recruit(); Game.populateShowcasePane('tavern'); });

                        Game.showcasePane.appendChild(button);
                    }
                }());
            }
        }
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
        
        var firstMember, secondMember, character;
        character = this.getFriendly("wizard");
        character.recruited = true;
        Game.recruitedPartyMembers.push(character);
        firstMember = new PartyMember(character, this.characterRight);
        this.partyMembers.push(firstMember);
        
        firstMember.initiate();
        firstMember.activate();
        this.currentParty = 0;
        
        character = this.getFriendly("warrior");
        character.recruited = true;
        this.recruitedPartyMembers.push(character);
        secondMember = new PartyMember(character, this.characterLeft);
        this.partyMembers.push(secondMember);
        
        secondMember.initiate();
        
        //Enemy stuff
        this.enemyPortrait = document.getElementById("enemyPortrait");
        this.enemyHpBar = document.getElementById("enemyHpBar");
        this.enemyHpBarText = document.getElementById("enemyhpbartext");
        this.enemyHpBarWidth = this.enemyHpBarText.clientWidth;
        this.updateEnemyHpBar();
        
        //Store stuff
        this.showcasePane = document.getElementById("buyingresultspane");
        this.storeButton = document.getElementById("storebutton");
        this.storeButton.addEventListener("click", function () { Game.populateShowcasePane('store'); });
        this.tavernButton = document.getElementById("tavernbutton");
        this.tavernButton.addEventListener("click", function () { Game.populateShowcasePane('tavern'); });
        
        this.characterClickThing.addEventListener("click",  function () {Game.onCharacterClick(); });
        
        this.updateCounterPane();
    };

    Game.mainLoop = function () {
        var elapsedTime, currentAttackTime;
        elapsedTime = Date.now() - this.lastTime;
        
        if (Game.automaticAttackSpeed !== 0) {
            currentAttackTime = Game.timeTilNextAttack - elapsedTime;
           
            Game.timeTilNextAttack = currentAttackTime - elapsedTime;
           
            if (Game.timeTilNextAttack <= 0) {
                Game.timeTilNextAttack = Game.timeTilNextAttack + Game.automaticAttackSpeed;
                this.currentEnemy.getHit(this.partyMembers[this.currentParty].character.getDamage());
                this.attacked = true;
            }
        }
        
        this.lastTime = Date.now();
        this.updateFrames();
        
        setTimeout(function () {Game.mainLoop(); }, 500);
    };
    
};

function onLoad() {
    'use strict';
    Game.Launch();

    Game.setupCleanGame();
    
    Game.mainLoop();
}

