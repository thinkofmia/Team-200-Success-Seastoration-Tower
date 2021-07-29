// create a new scene
let flippingMemoryScene = new Phaser.Scene('Flipping Memory');

flippingMemoryScene.init = function(data){
    if(Object.keys(data).length != 0){
        this.gameStats = data;
      }
    else this.gameStats = {};
    this.baseCards = ["sun", "bar", "diamond","triangle","star", "o"];
    this.selectedCard = -1;
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
    let text = this.add.text(gameW/8, gameH/14, 'Flipping Memory', {
        font: "20px "+this.titleFont,
        fill: '#ffffff',
    });
    
    text.setOrigin(0.5, 0.5);
    text.depth = 52;

    let textBg = this.add.graphics();
    textBg.fillStyle(0x000000, 0.7);
    textBg.fillRect(gameW/8 - text.width/2 - 10, gameH/14 - text.height/2 -10, text.width+20, text.height+ 20);
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
}

flippingMemoryScene.prepareDeck = function(){
    this.cardDeck = [];
    this.cardsFlip = [];
    this.remainingCards = [].concat(this.baseCards, this.baseCards);
    this.deckSize = this.remainingCards.length;

    this.shuffleCards(this.remainingCards);
    console.log(this.remainingCards);

    this.selectedCard = -1;

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

            this.selectedCard = card;
            this.lastSelectedIndex = i;
            console.log(this.selectedCard.texture.key +" "+this.lastSelectedIndex);
            this.cardsFlip[i] = !this.cardsFlip[i];
            
            }
            });
        }, this);
    }
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