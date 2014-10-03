function Item(itemName, itemBasePrice, itemToolTip, itemFlavourText, itemIcon, itemSingleAction, itemRepeatedAction) {
    'use strict';
    var name, basePrice, toolTip, flavourText, icon, unlocked, singleAction;
    
    this.name = itemName;
    this.basePrice = itemBasePrice;
    this.toolTip = itemToolTip;
    this.flavourText = itemFlavourText;
    this.icon = itemIcon;
    this.unlocked = false;
    this.singleAction = itemSingleAction;
    this.repatedAction = itemRepeatedAction;
}

var itemList = [];

itemList.push(new Item('Broken Drums', 50, "Makes your party attack without orders", 'By the power of Rhyymn, I will make them move', "", function (gameObject) {'use strict'; gameObject.automaticAttackSpeed = 1000; }, null));