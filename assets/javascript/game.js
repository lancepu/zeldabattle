var playerChar = "";
var oppChar = "";
var battleStarted = false;
var atkIcon = '<i class="fas fa-bolt"></i>'
var counterAtkIcon = '<i class="fas fa-sync-alt"></i>'
var selectedChar = ""
var boxShadowValue = "0px 0px 50px blue"

$(window).on("load", function () {
  $("#gameIntro").modal('show')
})


//click event handlers
$(document).ready(function () {
  var gameAudio = document.getElementById("gameAudio")
  var hitSound = document.getElementById("hitSound")
  var counterSound = document.getElementById("counterSound")
  //set the game audio to starting music
  gameAudio.setAttribute("src", "assets\\audio\\relax_botw.mp3")
  gameAudio.loop = true

  $(".dismiss").on("click", function () {
    gameAudio.play()
    $("#gameIntro").modal('hide')
  })

  //generating the charcters
  for (i = 0; i < availableChar.length; i++) {
    var c1 = $("<div>")
    c1.addClass("col-sm-6 col-md-4 col-lg-3 cardContainer")
    c1.attr("id", availableChar[i].charName)
    var c2 = $("<div>")
    c2.addClass("view overlay charSelect")
    c2.attr("value", availableChar[i].charName)
    var c3 = $("<div>")
    c3.addClass("card")
    var c4 = $("<img>")
    c4.addClass("card-img-top img-fluid")
    c4.attr("src", availableChar[i].imgStore)
    var c5 = $("<div>")
    c5.addClass("card-body")
    var c6 = $("<h4>")
    c6.addClass("card-title")
    c6.text(availableChar[i].charName)
    var c7 = $("<p>")
    c7.addClass("card-text")
    c7.text(availableChar[i].charDescription)
    var c8 = $("<ul>")
    c8.addClass("list-group list-group-flush")
    var c9 = $("<li>")
    c9.addClass("list-group-item heartCount")
    c9.attr("id", availableChar[i].heartDivName)
    var c10 = $("<li>")
    c10.addClass("list-group-item")
    var c10r = $("<div>")
    c10r.addClass("row")
    var c10rc = $("<div>")
    c10rc.addClass("col-4")
    c10rc.append(atkIcon)
    var c10rc2 = $("<div>")
    c10rc2.addClass("col-8")
    c10rc2.attr("id", availableChar[i].powDivName)
    c10rc2.text(availableChar[i].attackPow)
    var c11 = $("<li>")
    c11.addClass("list-group-item")
    var c11r = $("<div>")
    c11r.addClass("row")
    var c11rc = $("<div>")
    c11rc.addClass("col-4")
    c11rc.append(counterAtkIcon)
    var c11rc2 = $("<div>")
    c11rc2.addClass("col-8")
    c11rc2.attr("id", availableChar[i].counterPowDivName)
    c11rc2.text(availableChar[i].counterAttPow)
    var c12 = $("<div>")
    c12.addClass("mask flex-center")
    $(".selectableChar").append(c1.append(c2.append(c3.append(c4, c5.append(c6, c7, c8.append(c9, c10.append(c10r.append(c10rc, c10rc2)), c11.append(c11r.append(c11rc, c11rc2))))), c12)))
    convertHeart(availableChar[i].healthPoint, availableChar[i].heartDivName)
  }

  $(".startGame").hide()
  $(".attack").hide()
  $(".confirm").hide()

  $(".charSelect").on("click", function () {
    //two scenarios, once player card is confirmed, use the different workflow (else)
    if (playerChar === "") {
      if (selectedChar !== "") {
        if ($(this).attr("value") !== selectedChar) {
          $("#" + selectedChar).children().css("box-shadow", "")
          $(this).css("box-shadow", boxShadowValue)
          $(".confirm").show()
          //remove the shadow from the previous selected card
          //assign the id to the selected Char 
          selectedChar = $(this).attr("value")
        }
      } else {
        $(this).css("box-shadow", boxShadowValue)
        $(".confirm").show()
        //assign the id to the selected Char 
        selectedChar = $(this).attr("value")
      }
    } else {
      //make sure the card selected is not the player confirmed card
      if (!battleStarted) {
        if ($(this).attr("value") !== playerChar) {
          if (selectedChar !== "") {
            if ($(this).attr("value") !== selectedChar) {
              $("#" + selectedChar).children().css("box-shadow", "")
              $(this).css("box-shadow", boxShadowValue)
              $(".startGame").show()
              //remove the shadow from the previous selected card
              //assign the id to the selected Char 
              selectedChar = $(this).attr("value")
            }
          } else {
            $(this).css("box-shadow", boxShadowValue)
            $(".startGame").show()
            //assign the id to the selected Char 
            selectedChar = $(this).attr("value")
          }
        }
      }
    }

  })

  $(".confirm").on("click", function () {
    //change the box shadow to red, signifying choosing opponent
    boxShadowValue = "0px 0px 50px red"
    //color the card background as blue, signifying this is the player's card
    $("#" + selectedChar).find(".card").addClass("bg-primary")
    //move the card to the left most area
    $("#" + selectedChar).insertBefore($(".cardContainer").first())
    //remove the shadow effect
    $("#" + selectedChar).children().css("box-shadow", "")
    //assign the player card value to the playerChar (confirmed)
    playerChar = selectedChar
    //chang the overlay mask to red (signifying choosing opponent)
    $(".mask").css("background-color", "rgba(255, 0, 0, 0.3)")
    //add the captions to the card area
    $(".playerText").text("Player Card")
    //hide the confirm button
    $(".confirm").hide()

  })

  $(".startGame").on("click", function () {
    //set the game audio to battle Music
    gameAudio.setAttribute("src", "assets\\audio\\battle_botw.mp3")
    gameAudio.play()
    console.log("start");
    if (selectedChar !== "") {
      oppChar = selectedChar
      zeldaGame.startGame(playerChar, oppChar);
      battleStarted = true;
      $(".startGame").hide()
      $(".attack").show()
    }

  })

  //attack phase
  $(".attack").on("click", function () {
    if (battleStarted) {
      $(".info").text("")
      $(".attack").hide()
      zeldaGame.attack();
      setTimeout(function () {
        zeldaGame.counterAttack()

      }, 1000)
    }
  })

  $(".reload").on("click", function () {
    window.location.reload()
  })

})

//function that converts character healthpoints to number of heart symbols on the character card
function convertHeart(hp, divName) {
  divName = "#" + divName
  //remove the existing heart and replace with new ones
  $(divName).children().remove();
  //each heart icon = 10 hp
  var heartNum = (hp / 10)
  for (var i = 0; i < heartNum; i++) {
    var heartIcon = $("<i>")
    heartIcon.addClass("fas fa-heart")
    $(divName).append(heartIcon)
  }
}

//hide the defeated character card
function hideCard(divName) {
  divName = "#" + divName
  $(divName).hide()
}

//simulate the shaking effect
function shakeCard(divName) {
  divName = "#" + divName
  $(divName).animate({
    top: '-=50',
  }, 70);
  $(divName).animate({
    top: '+=150'
  }, 70);
  $(divName).animate({
    top: '-=100',
  }, 70);
}

//main game code
var zeldaGame = {
  attackNum: 0,
  initAttackVal: 0,
  opponentCount: availableChar.length - 1,
  startGame: function (player, opponent) {
    //initialize the variables
    this.getMyChar(player);
    this.getOpponent(opponent);
    $("#" + this.oppChar.charName).find(".card").addClass("bg-danger")
    $("#" + this.oppChar.charName).insertAfter($("#" + this.myChar.charName))
    $(".opponentText").text("Opponent Card")
    console.log("opponent count: " + this.opponentCount);
  },

  getMyChar: function (player) {
    this.myChar = this.findObjectByKey(availableChar, "charName", player);
  },

  getOpponent: function (opponent) {
    this.oppChar = this.findObjectByKey(availableChar, "charName", opponent);
    this.opponentCount--;
  },

  checkProgress: function () {
    //update the displays
    //display remaining hp
    convertHeart(this.myChar.healthPoint, this.myChar.heartDivName)
    convertHeart(this.oppChar.healthPoint, this.oppChar.heartDivName)

    if (this.myChar.healthPoint === 0) {
      //game over
      this.gameLose();
    } else if (this.oppChar.healthPoint === 0) {
      //choose another opponent if available
      if (this.opponentCount !== 0) {
        battleStarted = false;
        //hide the defeated card
        hideCard(this.oppChar.charName)
        $(".attack").hide()
        $(".info").text("Choose a New Opponent")
        $(".opponentText").text("")
        gameAudio.setAttribute("src", "assets\\audio\\relax_botw.mp3")
        gameAudio.play()
        console.log("choose another opponent");
      } else {
        hideCard(this.oppChar.charName)
        this.gameWin();
      }
    } else {
      //do nothing
    }
  },

  attack: function () {
    var addedAttack;
    var critMultiplier = 1
    if (this.attackNum !== 0) {
      addedAttack = this.myChar.attackPow / this.attackNum;
    }
    else {
      addedAttack = 0;
    }
    this.myChar.attackPow += addedAttack;
    this.attackNum++;
    //refresh the attack power
    $("#" + this.myChar.powDivName).text(this.myChar.attackPow)
    console.log("player attack num: " + this.attackNum);
    console.log("player attack Power: " + this.myChar.attackPow);
    if (this.criticalHit() === 2) {
      critMultiplier = 2
      $(".info").text("Critical Hit!")
      this.myChar.attackPow *= 2
    }
    shakeCard(this.oppChar.charName)
    hitSound.play()
    this.oppChar.healthPoint -= this.myChar.attackPow;
    //return attack power back to pre critical hit level
    this.myChar.attackPow /= critMultiplier
    //prevent health point from changing to negative number
    if (this.oppChar.healthPoint < 0) {
      this.oppChar.healthPoint = 0;
    }
    console.log("Opponent Health: " + this.oppChar.healthPoint);
    this.checkProgress();
  },

  counterAttack: function () {
    //if opponent is defeated, no counter account happens
    if (this.oppChar.healthPoint !== 0) {
      $(".info").text("Opponent counter-attacks")
      shakeCard(this.myChar.charName)
      counterSound.play()
      this.myChar.healthPoint -= this.oppChar.counterAttPow;
      if (this.myChar.healthPoint < 0) {
        this.myChar.healthPoint = 0;
      }
      $(".attack").show()
      console.log("Player health: " + this.myChar.healthPoint);
      this.checkProgress();
    }
  },

  gameWin: function () {
    $("#gameWin").modal("show")
    $(".attack").hide()
    $(".reload").show()
    console.log("you win!");
    $(".playerText").text("")
    $(".opponentText").text("")
    gameAudio.setAttribute("src", "assets\\audio\\relax_botw.mp3")
    gameAudio.play()
  },

  gameLose: function () {
    // $(".info").text("Game Over")
    $("#gameOver").modal("show")
    $(".attack").hide()
    $(".reload").show()
    console.log("game over");
    $(".playerText").text("")
    $(".opponentText").text("")
    gameAudio.setAttribute("src", "assets\\audio\\gameOver_botw.mp3")
    gameAudio.loop = false
    gameAudio.play()
  },

  findObjectByKey: function (array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
    return null;
  },

  criticalHit: function () {
    //generates a number between 1 and 100, if number is less than 20, (20% chance), return 2 as the crit value
    var critChance = Math.floor(Math.random() * 100) + 1
    if (critChance <= 30) {
      return 2
    } else {
      return 1
    }
  }

};
