// create a new scene
let flippingMemoryScene = new Phaser.Scene('Flipping Memory');

WebFont.load({
    google: {
      families: ['Grandstander', 'Averia Libre']
    }
  });

flippingMemoryScene.init = function(data){
    if(Object.keys(data).length != 0){
        this.gameStats = data;
      }
    else this.gameStats = {};
    this.baseCards = ["sun", "bar", "diamond","triangle","star", "o"];
    this.selectedCard = -1;
    this.totalMatches = 0;

    
    //Fonts
    this.titleFont = 'Grandstander';
    this.bodyFont = 'Averia Libre';
}

flippingMemoryScene.create = function(){
    
    //Welcome Text
    let gameW = this.sys.game.config.width;
    let gameH = this.sys.game.config.height;

    //Game background, with active input
    let bg = this.add.sprite(0,0,'background_title').setInteractive();
    bg.setOrigin(0,0);
    bg.setScale(0.25);

    //Header
    let text = this.add.text(gameW/8+10, gameH/14, 'Flipping Memory', {
        font: "20px "+this.titleFont,
        fill: '#ffffff',
    });
    
    text.setOrigin(0.5, 0.5);
    text.depth = 52;

    let textBg = this.add.graphics();
    textBg.fillStyle(0x000000, 0.7);
    textBg.fillRect(gameW/8 - text.width/2 , gameH/14 - text.height/2 -10, text.width+20, text.height+ 20);
    textBg.depth = 51;

    //Back Button
    this.backButton = this.physics.add.sprite(gameW- 70, 280, "icon_back");
    this.backButton.body.allowGravity = false;
    this.backButton.setInteractive();
    this.backButton.on('pointerdown', function(){
        this.backButton.setFrame(1);
        this.isPlaying = false;
        //Keep game on for sometime
        this.time.addEvent({
        delay: 500,
        repeat: 0,
        callback: function(){
            this.backButton.setFrame(0);
            this.returnToMGSelection();
        },
        callbackScope: this
        });
    }, this);

    this.backButton.depth = 50;
  

    //Prepare deck
    this.prepareDeck();
    this.displayPingvin();
    this.createHUD();
}

flippingMemoryScene.createHUD = function(){
    //Header Bar
    this.headerBar = this.add.graphics();
    this.headerBar.setPosition(0, 0);
    this.headerBar.fillStyle(0x459eda, 1);
    this.headerBar.fillRect(0, 0, 1000, 50);
    this.headerBar.depth = 50;

    //Match Pairs
    this.matchedText = this.add.text(200,10,`Total Matched: ${this.totalMatches}`,{
        font: '20px '+this.bodyFont,
        fill: '#ffffff'
      });
    this.matchedText.depth = 51;
}

flippingMemoryScene.displayPingvin = function(){
    //Add Pingvin
    this.pingvin = this.add.sprite(650,50,'sprite_pingvin',6).setInteractive();
    this.pingvin.setScale(0.3);
    this.pingvin.flipX = true;
    this.pingvin.depth = 1;
    this.pingvin.play('cards_pingvin');
}

flippingMemoryScene.prepareDeck = function(){
    this.cardDeck = [];
    this.cardsFlip = [];
    this.remainingCards = [].concat(this.baseCards, this.baseCards);
    this.deckSize = this.remainingCards.length;

    this.shuffleCards(this.remainingCards);
    this.cardPositions = [].concat(this.remainingCards);

    this.selectedCard = -1;
    this.selectedIndex = -1;
    this.prevSelectedCard = -1;
    this.prevSelectedIndex = -1;

    for (let i=0;i<this.deckSize;i++){
        this.cardsFlip[i] = false;
        let chosenCard = this.remainingCards[0];
        this.remainingCards.splice(0, 1);

        //Create a Card
        let card = this.add.sprite(0+(i%6)*80, 50+Math.floor(i/6)*100,'fm_'+chosenCard,3).setInteractive();
        card.setOrigin(0,0);
        card.depth = 1;
        card.setScale(0.2);

        //console.log(this.remainingCards);
        this.cardDeck.push(card);
        card.on('pointerdown', function(){
        //Flip Movement
        let flipTween = this.tweens.add({
            targets: card,
            duration: 500,
            paused: false,
            callbackScope: this,
            onComplete: function(tween, sprites){

            //Event listener when animation ends
            card.on('animationcomplete', function(){
                //Set card back to neutral
                //this.card.setFrame(0);
            }, this);

            //Play spreadsheet animation
            if(!this.cardsFlip[i]){
                card.play('flip_'+chosenCard);
                card.setScale(0.22);
            } 
            else {
                card.play('unflip_'+chosenCard);
                card.setScale(0.2);
            } 

            this.cardsFlip[i] = true;

            //Update cards
            this.prevSelectedCard = this.selectedCard
            this.selectedCard = card;

            //If its first card selected
            if (this.selectedIndex==-1) this.selectedIndex = i;
            //else if first card selected is same as second card
            else if(this.selectedIndex==i) {
                this.selectedIndex = -1;
                this.prevSelectedIndex = -1;
                this.selectedCard = -1;
                this.prevSelectedCard = -1;
                this.cardsFlip[i] = false;
                card.play('unflip_'+chosenCard);
                card.setScale(0.2);
            }
            //Else update second and first card
            else {
                this.prevSelectedIndex = this.selectedIndex;
                this.selectedIndex = i;
                //Match them
                let matched = flippingMemoryScene.matchCards(this.selectedCard,this.prevSelectedCard);
                if (matched){
                    this.selectedCard.destroy();
                    this.prevSelectedCard.destroy();
                    this.prevSelectedIndex = -1;
                    this.selectedIndex = -1;
                    this.totalMatches += 1;
                }
                else{
                    console.log(flippingMemoryScene.cardPositions[this.selectedIndex]);
                    this.selectedCard.play('unflip_'+this.cardPositions[this.selectedIndex]);
                    this.selectedCard.setScale(0.2);
                    this.prevSelectedCard.play('unflip_'+this.cardPositions[this.prevSelectedIndex]);
                    this.prevSelectedCard.setScale(0.2);
                    this.cardsFlip[this.selectedIndex] = false;
                    this.cardsFlip[this.prevSelectedIndex] = false;
                    
                    this.prevSelectedIndex = -1;
                    this.selectedIndex = -1;
                } 
            }

            if (this.selectedCard==-1) console.log(`No selected card!`);
            else
            console.log(`Current Card Selected: ${this.selectedCard.texture.key} ${this.selectedIndex}`);
            if (this.prevSelectedCard==-1)
            console.log(`No previous selected card!`);
            else 
            console.log(`Previous Card Selected: ${this.prevSelectedCard.texture.key} ${this.prevSelectedIndex}`);
            //console.log(this.selectedCard.texture.key +" "+this.lastSelectedIndex);
            
            }
            });
        }, this);
    }
}

flippingMemoryScene.matchCards= function(card1, card2){
    //If matches!
    if (card1.texture.key==card2.texture.key){
        return true;
    }
    else return false;
}

flippingMemoryScene.shuffleCards = function(cards){
    for (var i = cards.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = cards[i];
        cards[i] = cards[j];
        cards[j] = temp;
    }
}

flippingMemoryScene.returnToMGSelection = function(){
    this.isAnimating = false;
    this.scene.start('MGSelection',this.gameStats);
}