// In this file you can create your own custom view templates

// A view template is a function that returns a view,
// this functions gets some config (e.g. trial_data, name, etc.) information as input
// A view is an object, that has a name, CT (the counter of how many times this view occurred in the experiment),
// trials the maximum number of times this view is repeated
// and a render function, the render function gets CT and the magpie-object as input
// and has to call magpie.findNextView() eventually to proceed to the next view (or the next trial in this view),
// if it is an trial view it also makes sense to call magpie.trial_data.push(trial_data) to save the trial information
const animation_view = {
  name: "animation_view",
  title: "title",
  CT: 0, //is this the start value?
  trials: NB_TRAIN_TRIALS,
  data: "",
  // The render function gets the magpie object as well as the current trial
  // in view counter as input
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
          toggleNextIfDone($('#runButton'), true);
        });
    });
    bttn_none.on('click', function(e) {
      bttn_none.toggleClass('selected');
      if(bttn_none.hasClass('selected')) {
        bttns.forEach(function(id){
          $('#' + id).removeClass('selected');
        })
        toggleNextIfDone($('#runButton'), true);
      } else {
        $('#runButton').addClass('grid-button');
      }
    });

    let anim = {animation, cleared, CT, started:false,
                trial_name:'animation_buttons'
              };
    functionalityRunBttn(anim, "buttons");
    functionalityBttnNextAnimation(getButtonResponse, magpie, anim)
  }
};

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
                  <p id='questionAnn' class='magpie-view-question magpie-view-qud'></p>
                   <button id='bttnQuestionAnn' class='magpie-view-button'>See Ann's question</button>
                   <button id='askBob' class='magpie-view-button grid-button'>See Bob's answer</button>
                   <p id='answerBob' class='magpie-view-question'></p>
                   <div class="stimuli">
                   <div id="label_left_pic" class="bottom-left">${side[0]}</div>
                   <img src=${config.data[CT][side[0]]} id=${side[0]} class="stim_pic unclickable" style="max-width:48%;height:auto;">
                   <img src=${config.data[CT][side[1]]} id=${side[1]} class="stim_pic unclickable" style="max-width:48%;height:auto;">
                   <div id="label_right_pic" class="bottom-right">${side[1]}</div>
                   </div>
                   <button id='smallMarginNextButton' class='grid-button magpie-view-button'>continue</button>
                 </div>`;
   },

  handle_response_function: function(config, CT, magpie, answer_container_generator, startingTime) {
       $(".magpie-view").append(answer_container_generator(config, CT));
       let show_labels = DEBUG ? 'visible' : 'hidden';
       $('#label_left_pic').css('visibility', show_labels);
       $('#label_right_pic').css('visibility', show_labels);
       if(DEBUG) console.log(config.data[CT].id)

       $("#bttnQuestionAnn").on("click", function(){
        this.remove();
        let question = config.data[CT].question_long;
        let cols_group = COLS_GROUPS[config.data[CT].group]
        question = question.replace("CONS", cols_group.CONS);
        question = question.replace("ANT", cols_group.ANT);

        $("#questionAnn").html(question);
        toggleNextIfDone($("#askBob"), true)
       });

       $("#askBob").on("click", function(){
        this.remove();
        $("#pqud").css("visibility", "visible");
        let answer = config.data[CT].answer;
        let cols_group = COLS_GROUPS[config.data[CT].group]
        answer = answer.replace("CONS", cols_group.CONS);
        answer = answer.replace("ANT", cols_group.ANT);

        $("#answerBob").html(answer);
        $("#picture1").removeClass('unclickable')
        $("#picture2").removeClass('unclickable')
       });

       $("#picture1").on("click", function() {
           const RT = Date.now() - startingTime;
           let trial_data = {
               trial_name: config.name,
               trial_number: CT + 1,
               response: "s1",
               type: config.data[CT].type,
               RT: RT
           };
           trial_data = magpieUtils.view.save_config_trial_data(config.data[CT], trial_data);
           magpie.trial_data.push(trial_data);

           toggleNextIfDone($("#smallMarginNextButton"), true)
           $("#picture1").addClass('selected_img')
           $("#picture2").removeClass('selected_img')
      });
      $("#picture2").on("click", function() {
            const RT = Date.now() - startingTime;
            let trial_data = {
                trial_name: config.name,
                trial_number: CT + 1,
                response: "s2",
                type: config.data[CT].type,
                RT: RT
            };
            trial_data = magpieUtils.view.save_config_trial_data(config.data[CT], trial_data);
            magpie.trial_data.push(trial_data);

            toggleNextIfDone($("#smallMarginNextButton"), true)
            $("#picture2").addClass('selected_img')
            $("#picture1").removeClass('selected_img')
      });

      $('#smallMarginNextButton').on("click", function(){
        magpie.findNextView();
      })
   }
}
