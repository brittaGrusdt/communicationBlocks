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
              $('#trainBttnSelect').html('<b>&emsp;Selected buttons are marked in blue.</b>')
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
          $('#trainBttnSelect').html('<b>&emsp;Selected buttons are marked in blue.</b>')
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
                    <div class='magpie-view-stimulus-container'>
                        <div class='magpie-view-stimulus magpie-nodisplay'></div>
                    </div>
                </div>`;
    },
  answer_container_gen: function(config, CT){
       $(".magpie-view-stimulus-container").addClass("magpie-nodisplay");

       let cols_group = COLS_GROUPS[config.data[CT].group]
       let question = config.data[CT].question.replace("ANT", cols_group.ANT)
       question = question.replace("CONS", cols_group.CONS)
       let side = _.sample([0, 1]) == 0 ? ["picture1", "picture2"]
                                        : ["picture2", "picture1"];

       return    `<div class='magpie-view-answer-container'>
                      <p id='pqud' class='magpie-view-question magpie-view-qud'>${config.data[CT].QUD}</p>
                      <p id='answerBob' class='magpie-view-question'></p>
                      <button id='askBob' class='magpie-view-button'>Bob's description</button><hr>
                    <div class="stimulus">
                      <p id='firstImg' class='magpie-view-question magpie-view-qud'></p>
                      <button id='bttnFirstImg' class='magpie-view-button grid-button'>See situation selected by Ann</button>
                      <p id='secondImg' class='magpie-view-question magpie-view-qud'></p>
                      <button id='bttnSecondImg' class='magpie-view-button grid-button'>See same situation a few seconds later</button>
                    </div>
                    <div class="divider"/>
                      <p id='question' class='magpie-view-question magpie-view-qud'></p>
                      <button id='bttnQuestion' class='magpie-view-button grid-button'>See question</button>
                    <div id="answerButtons" class="buttonContainer" style='visibility:hidden'>
                      <p id="pyes" class="styled-button-answer">YES</p>
                    <div class="divider"/>
                      <p id="pno" class="styled-button-answer">NO</p>
                    <div class="divider"/>
                      <p id="pundecided" class="styled-button-answer">UNDECIDED</p>
                    </div>
                    <div class="divider"/>
                      <button id='smallMarginNextButton' class='grid-button magpie-view-button'>continue</button>
                   </div>`;
   },

  handle_response_function: function(config, CT, magpie, answer_container_generator, startingTime) {
       $(".magpie-view").append(answer_container_generator(config, CT));
       let show_labels = DEBUG ? 'visible' : 'hidden';
       $('#label_left_pic').css('visibility', show_labels);
       $('#label_right_pic').css('visibility', show_labels);
       if(DEBUG) {
         console.log(config.data[CT].id + ": " + config.data[CT].id1 + ", " + config.data[CT].id2)
       }

       $("#askBob").on("click", function(){
        this.remove();
        let answer = config.data[CT].answer;
        let cols_group = COLS_GROUPS[config.data[CT].group]
        answer = answer.replace("CONS", cols_group.CONS);
        answer = answer.replace("ANT", cols_group.ANT);
        $("#answerBob").html(answer);
        toggleNextIfDone($("#bttnFirstImg"), true)
       });

       $("#bttnFirstImg").on("click", function(){
        this.remove();
        $("#pqud").css("visibility", "visible");
        let img1 = config.data[CT].picture1; // question_long
        $("#firstImg").html(
          `<id="label_upper_pic" class="bottom-left">
          <img src=${img1} id="imgBefore" class="stim_pic unclickable">`
          );
        toggleNextIfDone($("#bttnSecondImg"), true)
       });

       $("#bttnSecondImg").on("click", function(){
        this.remove();
        $("#pqud").css("visibility", "visible");
        let img2 = config.data[CT].picture2; // question_long
        $("#secondImg").html(`Same situation a few seconds later:
            <id="label_lower_pic" class="bottom-right">
            <img src=${img2} id="imgAfter" class="stim_pic unclickable">`
            );
        toggleNextIfDone($("#bttnQuestion"), true)
       });

       $("#bttnQuestion").on("click", function(){
        this.remove();
        let question = config.data[CT].question_long;
        let cols_group = COLS_GROUPS[config.data[CT].group]
        question = question.replace("CONS", cols_group.CONS);
        question = question.replace("ANT", cols_group.ANT);
        $("#question").html(question);
        $('#answerButtons').css('visibility', 'visible');

        toggleNextIfDone($("#bttnFirstImg"), true)
       });

       ["pyes", "pno", "pundecided"].forEach(function (id) {
         $('#' + id).on('click', function (e) {
           $('#' + id).toggleClass('selected');
           // make sure that only one can be selected!
           if (id == "pyes" && $("#pyes").hasClass('selected')) {
            $("#pno").removeClass('selected');
            $("#pundecided").removeClass('selected')
           } else if (id == "pno" && $("#pno").hasClass('selected')) {
            $("#pyes").removeClass('selected');
            $("#pundecided").removeClass('selected')
           } else {
            $("#pyes").removeClass('selected');
            $("#pno").removeClass('selected')
           }

          toggleNextIfDone($("#smallMarginNextButton"), true)
         });
       });

       let trial_data = {
         trial_name: config.name,
         trial_number: CT + 1,
         type: config.data[CT].type,
         picture_left: $('#label_left_pic').html()
       };
       $("#picture1").on("click", function() {
           const RT = Date.now() - startingTime;
           trial_data.RT = RT
           trial_data.response = config.data[CT].causes_id1
           trial_data.selected_pic = "picture1"

           toggleNextIfDone($("#smallMarginNextButton"), true)
           $("#picture1").addClass('selected_img')
           $("#picture2").removeClass('selected_img')
      });
      $("#picture2").on("click", function() {
            const RT = Date.now() - startingTime;
            trial_data.RT = RT
            trial_data.response = config.data[CT].causes_id2
            trial_data.selected_pic = "picture2"

            toggleNextIfDone($("#smallMarginNextButton"), true)
            $("#picture2").addClass('selected_img')
            $("#picture1").removeClass('selected_img')
      });

      $('#smallMarginNextButton').on("click", function(){
        trial_data = magpieUtils.view.save_config_trial_data(config.data[CT], trial_data);
        magpie.trial_data.push(trial_data);
        magpie.findNextView();
      })
   }
}

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
