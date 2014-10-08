function Item(itemName, itemBasePrice, itemToolTip, itemFlavourText, itemIcon, itemSingleAction, itemRepeatedAction) {
    'use strict';
    var name, basePrice, toolTip, flavourText, icon, unlocked, singleAction, bought;
    
    this.name = itemName;
    this.basePrice = itemBasePrice;
    this.toolTip = itemToolTip;
    this.flavourText = itemFlavourText;
    this.icon = itemIcon;
    this.unlocked = true;
    this.bought = false;
    this.singleAction = itemSingleAction;
    this.repatedAction = itemRepeatedAction;
    
    this.getPrice = function () {
        return this.basePrice;
    };
    
    this.buy = function (gameObject) {
        this.bought = true;
        this.singleAction(gameObject);
    };
}

var itemList = [];

itemList.push(new Item("Broken Drums", 50, "Makes your party attack without orders", "By the power of Rhyymn, I will make them move", "url('./resources/images/Muk.gif')", function (gameObject) {'use strict'; gameObject.automaticAttackSpeed = 1000; }, null));

itemList.push(new Item("Broken Drums2", 50, "Makes your party attack without orders", "By the power of Rhyymn, I will make them move", "url('./resources/images/wall.png')", function (gameObject) {'use strict'; gameObject.automaticAttackSpeed = 1000; }, null));

//itemList.push(new Item("Broken Drums3", 50, "Makes your party attack without orders", "By the power of Rhyymn, I will make them move", "url('./resources/images/Muk.gif')", function (gameObject) {'use strict'; gameObject.automaticAttackSpeed = 1000; }, null));