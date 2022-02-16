// In this file you can create your own custom view templates

// A view template is a function that returns a view,
// this functions gets some config (e.g. trial_data, name, etc.) information as input
// A view is an object, that has a name, CT (the counter of how many times this view occurred in the experiment),
// trials the maximum number of times this view is repeated
// and a render function, the render function gets CT and the magpie-object as input
// and has to call magpie.findNextView() eventually to proceed to the next view (or the next trial in this view),
// if it is an trial view it also makes sense to call magpie.trial_data.push(trial_data) to save the trial information
const animation_generator = function(config) {
  return Object.assign(config, {
    // The render function gets the magpie object as well as the current trial in view counter as input
    render: function (CT, magpie) {
      let html_answers =  htmlButtonResponses() + htmlRunNextButtons();
      let animation = showAnimationInTrial(CT, html_answers, progress_bar=true);
      let cleared = false;
      Events.on(animation.engine, 'afterUpdate', function (event) {
        if (!cleared && animation.engine.timing.timestamp >= DURATION_ANIMATION) {
          clearWorld(animation.engine, animation.render, stop2Render = false);
          cleared = true;
        }
      });
      let bttns = _.filter(TRAIN_BTTN_IDS, function(id){return id !== "buttonNone"});
      let bttn_none = $('#buttonNone');
      bttns.forEach(function (id) {
        $('#' + id)
          .on('click', function (e) {
            var parent = document.getElementById('TrainButtons');
            bttn_none.removeClass('selected');
            $('#' + id).toggleClass('selected');
            if($('#' + id).hasClass('selected')){
              toggleNextIfDone($('#runButton'), true);
              $('#trainBttnSelect').html('<b>&emsp;Selected buttons are marked in purple.</b>')
            } else {
              var count = 0;
              bttns.forEach(function(id){
                count = $('#' + id).hasClass('selected') ? count + 1 : count;
              })
              if(count == 0){
                $('#runButton').addClass('grid-button');
                $('#trainBttnSelect').html('<b>&emsp;Please make a selection!</b>')
              }
            }
          });
      });
      bttn_none.on('click', function(e) {
        bttn_none.toggleClass('selected');
        if(bttn_none.hasClass('selected')) {
          bttns.forEach(function(id){
            $('#' + id).removeClass('selected');
          })
          $('#trainBttnSelect').html('<b>&emsp;Selected buttons are marked in purple.</b>')
          toggleNextIfDone($('#runButton'), true);
        } else {
          $('#runButton').addClass('grid-button');
          $('#trainBttnSelect').html('<b>&emsp;Please make a selection!</b>')
        }
      });

      let anim = {animation, cleared, CT, started:false,
                  trial_name:'animation_buttons'
                };
      functionalityRunBttn(anim, "buttons");
      functionalityBttnNextAnimation(getButtonResponse, magpie, anim)
    }
  })
}

const forced_choice_generator = {
  stimulus_container_gen: function (config, CT) {
        return `<div class='magpie-view'>
                    <h1 class='magpie-view-title'>${config.title}</h1>
                    <h2 id='yourScore'></h2>
                    <div class='magpie-view-stimulus-container'>
                        <div class='magpie-view-stimulus magpie-nodisplay'></div>
                    </div>
                </div>`;
    },
  answer_container_gen: function(config, CT){
       $(".magpie-view-stimulus-container").addClass("magpie-nodisplay");
       if(config.data[CT].type.includes('practice') || config.data[CT].block === "practice") {
         $('#yourScore').html(`Your points: ${POINTS_PRACTICE}`);
       } else {
         $('#yourScore').html("Your points: ?");
       }

       let cols_group = COLS_GROUPS[config.data[CT].group];
       let question = config.data[CT].question.replace("ANT", cols_group.ANT);
       question = question.replace("CONS", cols_group.CONS)
       let side = ["picture0"].concat(_.shuffle(["picture1", "picture2", "picture3"]));

       return `<div class='magpie-view-answer-container'>
          <p id='pqud' class='magpie-view-question magpie-view-qud'>${config.data[CT].QUD}</p>
          <div id="label_obscured_pic" class="top-middle"></div>
          <img src=${config.data[CT][side[0]]} id="obscured_pic" style="max-width:30%;height:auto;">
          <img src=${config.data[CT]["picture_bob"]} id="picture_bob" style="max-width:30%;height:auto;">
          <p id='questionAnn' class='magpie-view-question magpie-view-qud'></p>
          <button id='bttnQuestionAnn' class='magpie-view-button'>See Ann's question</button>
          <button id='bttnAnswerBob' class='magpie-view-button grid-button'>See Bob's response</button>
          <p id='answerBob' class='magpie-view-question'></p>
          <div class="stimuli">
            <p id='textBobsScreens' class='magpie-view-question'></p>
            <button id='bttnBobsScreens' class='magpie-view-button grid-button'>Show possible screens Bob might have seen</button>
            <div id="label_left_pic" class="bottom-left">${side[1]}</div>
            <img src=${config.data[CT][side[1]]} id=${side[1]} class="stim_pic unclickable isLeft" style="max-width:30%;height:auto;visibility:hidden">
            <div id="label_middle_pic" class="bottom-middle">${side[2]}</div>
            <img src=${config.data[CT][side[2]]} id=${side[2]} class="stim_pic unclickable isMiddle" style="max-width:30%;height:auto;visibility:hidden">
            <img src=${config.data[CT][side[3]]} id=${side[3]} class="stim_pic unclickable isRight" style="max-width:30%;height:auto;visibility:hidden">
            <div id="label_right_pic" class="bottom-right">${side[3]}</div>
         </div>
         <button id='smallMarginNextButton' class='grid-button magpie-view-button' style="visibility:hidden">continue</button>
       </div>`;
   },

  handle_response_function: function(config, CT, magpie, answer_container_generator, startingTime) {
       $(".magpie-view").append(answer_container_generator(config, CT));
       let show_labels = DEBUG ? 'visible' : 'hidden';
       $('#label_left_pic').css('visibility', show_labels);
       $('#label_right_pic').css('visibility', show_labels);
       $('#label_middle_pic').css('visibility', show_labels);
       if(DEBUG) {
         // console.log(config.data[CT].id + ": " + config.data[CT].id1 + ", " + config.data[CT].id2 + ", " + config.data[CT].id3)
         console.log(config.data[CT].id + " " + config.data[CT].type)
       }
       $("#bttnQuestionAnn").on("click", function(){
        this.remove();
        let question = config.data[CT].question_long;
        let cols_group = COLS_GROUPS[config.data[CT].group]
        question = question.replace("CONS", cols_group.CONS);
        question = question.replace("ANT", cols_group.ANT);

        $("#questionAnn").html(question);
        toggleNextIfDone($("#bttnAnswerBob"), true)
       });

       $("#bttnAnswerBob").on("click", function(){
        this.remove();
        //$("#pqud").css("visibility", "visible");
        let answer = config.data[CT].answer;
        let cols_group = COLS_GROUPS[config.data[CT].group]
        answer = answer.replace("CONS", cols_group.CONS);
        answer = answer.replace("ANT", cols_group.ANT);
        if(DEBUG) {
          console.log('expected (if any): ' + config.data[CT].expected);
        }
        $("#answerBob").html(answer);
        toggleNextIfDone($("#bttnBobsScreens"), true)
      });

        $("#bttnBobsScreens").on("click", function(){
          let text = TEXT_BOBS_SCREENS.normal_check;
          if(config.data[CT].type === "attention-check"){
            text = TEXT_BOBS_SCREENS.attention_check;
            let attention_side = $("#" + config.data[CT].expected).hasClass("isLeft") ? "leftmost picture"
            : $("#" + config.data[CT].expected).hasClass("isRight") ? "rightmost picture"
            : "picture in the middle";
            text = text.replace("SIDE picture", attention_side)
          }
          this.remove();
          $("#textBobsScreens").html(text);

          $("#picture1").css("visibility", "visible");
          $("#picture2").css("visibility", "visible");
          $("#picture3").css("visibility", "visible");
          $("#smallMarginNextButton").css("visibility", "visible");
          $("#picture1").removeClass('unclickable');
          $("#picture2").removeClass('unclickable');
          $("#picture3").removeClass('unclickable');
        });

       const pictures = ["picture1", "picture2", "picture3"];
       pictures.forEach(function (id) {
      // remove image selection with second click
        $('#' + id).on('click', function (e) {
          if($('#' + id).hasClass('selected_img')) {
            $('#' + id).removeClass('selected_img');
          } else {
            $('#' + id).addClass('selected_img');
          };
          // continue button is clickable if at least one image is selected
          if($('#' + id).hasClass('selected_img')){
            toggleNextIfDone($('#smallMarginNextButton'), true);
          } else {
            var count = 0;
            pictures.forEach(function(id){
              count = $('#' + id).hasClass('selected_img') ? count + 1 : count;
            });
            if(count == 0){
              $('#smallMarginNextButton').addClass('grid-button');
            }
          }
        });
      });

      let trial_data = {
         trial_name: config.name,
         trial_number: CT + 1,
         type: config.data[CT].type,
         picture_left: $('#label_left_pic').html(),
         picture_middle: $('#label_middle_pic').html(),
         picture_right: $('#label_right_pic').html(),
         selected_pic: "",
         block: config.data[CT].block
       };

       $("#picture1").on("click", function() {
           trial_data.response = config.data[CT].property_id1
       });
       $("#picture2").on("click", function() {
            trial_data.response = config.data[CT].property_id2
       });
       $("#picture3").on("click", function() {
            trial_data.response = config.data[CT].property_id3
       });

       $('#smallMarginNextButton').on("click", function(){
        	// save which images were selected when continuing
        	const RT = Date.now() - startingTime;
        	trial_data.RT = RT;
        	["picture1", "picture2", "picture3"].forEach(function (id) {
          		if($('#' + id).hasClass('selected_img')) {
            		trial_data.selected_pic += id + "_";
          		}
        	});
          // remove last underscore in string
        	trial_data.selected_pic = trial_data.selected_pic.slice(0, -1);
        	trial_data = magpieUtils.view.save_config_trial_data(config.data[CT], trial_data);

          let bob = $('#' + trial_data.bob)
          let pic_bob = bob.hasClass('isMiddle') ? 'the picture in the middle' :
          bob.hasClass('isLeft') ? 'the leftmost picture' :
          'the rightmost picture';

          //console.log('selected: ' + trial_data.selected_pic + ' bob: ' + trial_data.bob)
          let result = config.data[CT].bob === trial_data.selected_pic ?
            {'money': 100, msg: 'Awesome - your choice was correct! You GET 100 points!'} :
            // selection of all 3 -> loose
            trial_data.selected_pic.split("_").length == 3 ?
            {money: -100, msg: 'Ups - you selected all 3 scenes... So, you LOOSE 100 points! Bob saw ' + pic_bob} :
            // selection of 2 including correct -> 50 ct
            trial_data.selected_pic.includes(trial_data.bob) ?
            {money: 50, msg: 'Congratulations! Bob saw ' + pic_bob + ' - you GET 50 points!'} :
            //otherwise loose
            {money: -100, msg: 'Ups. Bob saw ' + pic_bob + '. You LOOSE 100 points!'};

            trial_data.money = result.money;
            TOTAL_POINTS += result.money;

          if(trial_data.type.includes('practice') || trial_data.block === "practice") {
              alert(result.msg + "\r\n" + "Total amount of points you made so far: " + TOTAL_POINTS + ".");
              POINTS_PRACTICE = TOTAL_POINTS;
          } else {
            POINTS_TEST_PHASE = TOTAL_POINTS - POINTS_PRACTICE;
          }
          magpie.trial_data.push(trial_data);
        	magpie.findNextView();
       })
   }
}

const custom_text_scores = function(config) {
    const view = {
        name: config.name,
        CT: 0,
        trials: config.trials,
        render: function (CT, magpie) {
          let points = config.name.includes("practice") ? POINTS_PRACTICE : POINTS_TEST_PHASE;
          $("main").html(
            `<div class='magpie-view'>
              <h1 class='magpie-view-title'>${config.title}</h1>
              <section class="magpie-text-container">
                <p class="magpie-view-text">${config.text.prescore}
                you got a total of <b>${points} points</b>.</br></br>
                ${config.text.postscore}</p>
              </section>
              <button class="magpie-view-button" id='next'>${config.buttonText}</button>
            </div>`
          );
          $("#next").on("click", function() {
            magpie.findNextView();
          });
        }
    };
    return view;
};
// captcha view
const custom_botcaptcha = function(config){
  const view = {
    name: config.name,
    CT: 0,
    trials: config.trials,
    render: function(CT, magpie) {
      $("main").html(`<div class="magpie-view">
        <h1 class='magpie-view-title'>Are you a bot?</h1>
        <br />
        <section class="magpie-text-container" align="center">
            <p class="magpie-text-container" align="center">${config.speaker} says to ${config.listener}: It's a beautiful day, isn't it?</p>
        </section>
        <br />
        <section class="magpie-text-container" align="center">
            <p class="magpie-text-container" id="quest-response" align="center">Who is ${config.speaker} talking to?</p>
            <section class="magpie-answer-container" align="center">
                <p class="magpie-text-container" align="center">Please enter your answer in lower case.</p>
            </section
            <br />
            <section class="magpie-view-question" align="center">
            <textarea rows="1" cols="15" name="botresponse" id="listener-response"></textarea>
            </section>
        </section>
        <br />
        <button class="magpie-view-button" id='next'>Let's go!</button>
        <section class="answer-container" align="center">
            <p class="text" id="error_incorrect" style="color: #7CB637" align="center">This is incorrect.</p>
            <p class="text" id="error_2more" style="color: #7CB637" align="center">You have 2 more trials.</p>
            <p class="text" id="error_1more" style="color: #7CB637" align="center">You have 1 more trial.</p>
            <p class="text" id="error" style="color: #7CB637" align="center">Error: You failed the comprehension questions too many times.
            You are not permitted to complete the HIT. Please click 'Return HIT' to avoid any impact on your approval rating.
            <br/><br/>
            If you believe you are receiving thin message in error, please email <a href="mailto:tessler@mit.edu">tessler@mit.edu</a> </p>
        </section>
        </div>`);
// don't allow to press enter in the response field
        $('#listener-response').keypress(function(event) {
            if (event.keyCode == 13) {
                event.preventDefault();
            }
        });
        let next = $("#next");
        // don't show any error message
        $("#error").hide();
        $("#error_incorrect").hide();
        $("#error_2more").hide();
        $("#error_1more").hide();

        // amount of trials to enter correct response
        var trial = 0;

        $("#next").on("click", function() {
            response = $("#listener-response").val().replace(" ","");

            // response correct
            if (listener.toLowerCase() == response.toLowerCase()) {
                magpie.global_data.botresponse = $("#listener-response").val();
                magpie.findNextView();

            // response false
            } else {
                trial = trial + 1;
                $("#error_incorrect").show();
                if (trial == 1) {
                    $("#error_2more").show();
                } else if (trial == 2) {
                    $("#error_2more").hide();
                    $("#error_1more").show();
                } else {
                    $("#error_incorrect").hide();
                    $("#error_1more").hide();
                    $("#next").hide();
                //    $('#quest-response').css("opacity", "0.2");
                    $('#listener-response').prop("disabled", true);
                    $("#error").show();
                };
            };

        });

    }
  };
  return view;
};
