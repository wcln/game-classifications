
var congratulationsText;
var correctArray;
var feedbackArray;

var reviewing = false;


function init() {


  let version = new URL(window.location.href).searchParams.get("version");

  if (version !== null) {

    // Load version JSON file.
    try {
      $.getJSON('versions/' + version + '/data.json', (data) => {

        // Store array of correct images.
        correctArray = data['correct_images'];

        // Store array of optional feedback.
        feedbackArray = data['feedback'];

        // Add images.
        let numbersArray = [];
        for (var i = 1; i <= 16; i++) {
          numbersArray.push(i);
        }
        numbersArray = shuffle(numbersArray);
        $(".game-tile img").each(function(index) {
          $(this).attr("src", "versions/" + version + "/" + numbersArray[index] + ".png");
          $(this).attr("id", numbersArray[index]);
          $(this).css("visibility", "visible");
        });

        // Load instructions.
        $('#instructions').html(data['instructions']);

        // Load clue text.
        $("#header h1").html(data['clue']);

        // Set congratulationsText (used later).
        congratulationsText = data['congratulations'];
      });

      // Add event listeners.
      initEventListeners();
    } catch(error) {
        alert('Error loading ' + version + '/data.json');
    }
  } else {
    alert('Error! No version set.');
  }
}

function initEventListeners() {
  $(".game-tile").on("click", function(event) {
    if (!reviewing) {
      if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
      } else {
        $(this).addClass("selected");
      }
    }
  });

  $('.game-tile').on("mouseover", function(event) {
    if ($(this).hasClass('incorrect') && reviewing) {
      $(this).find('img').css("display", "none");
      $(this).find('.feedback').css("display", "table-cell");
    }
  });

  $('.game-tile').on("mouseout", function(event) {
    if ($(this).hasClass('incorrect') && reviewing) {
      $(this).find('img').css("display", "table-cell");
      $(this).find('.feedback').css("display", "none");
    }
  });
}

function check() {

  let correctCount = 0;
  let anyIncorrect = false;

  $('.selected').each(function() {
    if (correctArray.includes(parseInt($(this).find('img').attr("id")))) {
      $(this).addClass('correct');

      correctCount++;

    } else {
      $(this).addClass('incorrect');

      anyIncorrect = true;

      // Add feedback.
      let feedback = feedbackArray.filter(obj => {
        return obj.id == parseInt($(this).find('img').attr("id"));
      });
      if (feedback.length > 0) {
        $(this).find('.feedback').html(feedback[0].feedback);
      }
    }
  });
  reviewing = true;

  endGame(correctCount, anyIncorrect);
}

function endGame(correctCount, anyIncorrect) {
  if (correctCount === correctArray.length && !anyIncorrect) {
    $('#header p').html(congratulationsText);
    $('#header p').css("color", "#45e048");

  } else if (correctCount === correctArray.length && anyIncorrect) {
    $("#header p").html("You selected all of the correct tiles. However, you also selected some incorrect tiles! Hover over them to see why.");
    $('#header p').css("color", "#e04545");
  } else if (anyIncorrect) {
    $("#header p").html("You selected some tiles incorrectly! Hover over a red tile to find out why. When you are ready to try again, click 'Restart'.");
    $('#header p').css("color", "#e04545");
  } else {
    $("#header p").html("You are missing some of the correct tiles! Click 'Restart' to try again!");
    $('#header p').css("color", "#e04545");
  }

  $('#restart-btn').prop('disabled', false);
  $('#check-btn').prop('disabled', true);
}

function restart() {
  location.reload();
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
