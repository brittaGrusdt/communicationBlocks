// In this file you can instantiate your views
// We here first instantiate wrapping views, then the trial views

/** Wrapping views below

* Obligatory properties

    * trials: int - the number of trials this view will appear
    * name: string

*Optional properties
    * buttonText: string - the text on the button (default: 'next')
    * text: string - the text to be displayed in this view
    * title: string - the title of this view

    * More about the properties and functions of the wrapping views - https://magpie-ea.github.io/magpie-docs/01_designing_experiments/01_template_views/#wrapping-views

*/

// Every experiment should start with an intro view. Here you can welcome your participants and tell them what the experiment is about
const intro = magpieViews.view_generator("intro", {
  trials: 1,
  name: "intro",
  // If you use JavaScripts Template String `I am a Template String`, you can use HTML <></> and javascript ${} inside
  text: `Thank you for your participation in our study!
         Your anonymous data makes an important contribution to our understanding of human language use.
          <br />
          <br />
          Legal information:
          By answering the following questions, you are participating in a study
          being performed by scientists from the University of Osnabrueck.
          <br />
          <br />
          You must be at least 18 years old to participate.
          <br />
          <br />
          Your participation in this research is voluntary.
          You may decline further participation, at any time, without adverse consequences.
          <br />
          <br />
          Your anonymity is assured; the researchers who have requested your
          participation will not receive any personal information about you.
          `,
  buttonText: "begin the experiment"
});

const instructions_general = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_general",
  title: "General Instructions",
  text: `This experiment consists of two phases, a training and a testing phase.
         In total, you will need about <b>10-15 minutes</b> to finish.
         <br/>
         <br/>
         We will start with the <b>training phase</b> which consists of <b>8 trials</b> in which you will see scenes of block arrangements.<br/>
         Your task will be to select all blocks that you think will fall (multiple selections possible!).
        <br/>
         After you have made your choice, click on RUN to see which blocks actually fall.
         <br/>
         By clicking on CONTINUE you'll proceed with the next training trial.
         <br/>
         <br/>
         <b>Please note</b>:
         <br/>
         We recommend to use <b>Full Screen Mode</b> throughout the experiment (usually switched on/off with F11).`,
  buttonText: "Start Training"
});

// Image choices: anns-bobs-screen.jpeg, all-one-row, separate-ann-bob, separate-you

const instructions_test_img = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_test_img",
  title: "Instructions Testing Phase",
  text: `Great -  we'll now proceed with the test phase of the experiment.<br/><br/>
  You will play a 3-player game with Ann and Bob in which you have to work together as a team 
  to select the right image and gain points. <br/>
  This is an example of how the game may look like for each of you:

  <br/><br/>
    <img src="./stimuli/img/screens-instruction/separate-ann-bob.png" style="max-width:90%">
    <img src="./stimuli/img/screens-instruction/separate-you.png" style="max-width:90%">
  <br/><br/>

  Ann's, Bob's, and your goal is to find out which scene Bob sees. <br/>
  During the game, each of you cannot see the other players' monitors and you are only allowed a 
  minimal amount of interaction. The way of interacting with each other always follows the same pattern: <br/>
  <b>1)</b> The first player, Ann, only views an incomplete version of Bob's scene. However, she can ask Bob 
  one question regarding that scene. <br/>
  <b>2)</b> The second player, Bob, sees the whole scene but he can only tell you what he sees by answering 
  Ann's question. Ann will not receive Bob's answer. <br/>
  <b>3)</b> Based on the question from Ann and the answer from Bob, the third player 
  (which is you) has to decide which of three different scenes is the one that Bob also sees. As additional information, 
  you are also able to see Ann's screen. <br/><br/>

  Ann has no experience with the scenes of block arrangements that you saw in the
  training phase. Bob, however, is an expert concerning these block arrangements.<br/>
  Therefore, Bob will be the one who sees the complete scene of block arrangements and
  replies to a question from Ann, who will be the one who only sees the partial scene.<br/>
  Due to the training you just got, you will be the one who sees the partial
  scene (that Ann also sees), the question and answer from Ann and Bob, and three complete scenes from 
  which to select. <br/><br/>

  In the example above Ann's question and Bob's response shown to you may look like so: <br/><br/>
  <img src="./stimuli/img/screens-instruction/qud-response.png" style = "max-width:80%">
  <br/><br/>

  Based on Bob's response, your task is to select <b>one or more</b> of the
  three scenes that only you can see.<br/><br/>

  If you are confident and select a single scene, and your choice is correct, you will <b>get 100 points</b>.
  Example (with respect to screens shown above):<br/>
  <img src="./stimuli/img/screens-instruction/select1-true.png" style="max-width:80%">
  <br/><br/>
  However, if your choice is wrong, you will <b>loose 100 points</b>.<br/>
  Example (with respect to screens shown above):<br/>
  <img src="./stimuli/img/screens-instruction/select1-false.png" style="max-width:80%">
  <br/><br/>
  But if you select two scenes, including the correct one, you will <b>win 50 points</b>.<br/>
  Example (with respect to screens shown above):<br/>
  <img src="./stimuli/img/screens-instruction/select2.png" style="max-width:80%">
  <br/><br/>
  And further, you will <b>loose 100 points</b> if:<br/>
  1. you select two scenes, <i>not</i> including the correct one OR if<br/>
  2. you select all three scenes.<br/><br/>
  Ann's, Bob's and your joint goal is to make as many points as possible.
  `,
  buttonText: "continue"
});

const instructions_practice = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_practice",
  title: "Instructions Testing Phase",
  text: `The testing phase consists of <b>4 blocks</b>. <br/>
  The <b>first block</b> is a <b>practice phase</b> with <b>7 trials</b> that should familiarize you with the task.<br/>
  The <b>following three blocks</b> comprise the actual <b>experimental phase</b>. Each of them consists of <b>6 trials</b>.<br/><br/>
  <b>After each block</b>, you will have the possibility to <b>take a break</b>.<br/><br/>
  <b>Attention-checks</b>:<br/>
  In each of the four blocks, we added <b>one attention-check trial</b>, in which you will be <b>explicitly told which picture to select</b>.
  This helps us to make sure that the experiment was done carefully. Please note that if you fail to respond correctly in more than one of the attention-check trials,
  you will not get paid.
  </br></br>
  Please click on CONTINUE to <b>start</b> the <b>practice phase</b>.`,
  buttonText: "continue"
});

const post_test = magpieViews.view_generator("post_test", {
  trials: 1,
  name: "post_test",
  title: "Additional information",
  text: "Answering the following questions is optional, but your answers will help us analyze our results.",
  comments_question: 'Further comments'
});


// The 'thanks' view is crucial; never delete it; it submits the results!
const thanks = magpieViews.view_generator("thanks", {
  trials: 1,
  name: "thanks",
  title: "Thank you very much for taking part in this experiment!",
  prolificConfirmText: "Press the button"
});

const animation_view = animation_generator(
  {name: "animation_view",
   title: "title",
   CT: 0,
   trials: NB_TRAIN_TRIALS,
   data: ""}
 )

const practice_image_selection = magpieViews.view_generator(
  "image_selection", {
    data: PRACTICE_TRIALS,
    name: 'image_selection',
    trials: PRACTICE_TRIALS.length
  }, {
    stimulus_container_generator: forced_choice_generator.stimulus_container_gen,
    answer_container_generator: forced_choice_generator.answer_container_gen,
    handle_response_function: forced_choice_generator.handle_response_function
  }
);

const test_image_selection_01 = magpieViews.view_generator(
  "image_selection", {
    data: TEST_TRIALS_01,
    name: 'image_selection_01',
    trials: TEST_TRIALS_01.length
  }, {
    stimulus_container_generator: forced_choice_generator.stimulus_container_gen,
    answer_container_generator: forced_choice_generator.answer_container_gen,
    handle_response_function: forced_choice_generator.handle_response_function
  }
);

const test_image_selection_02 = magpieViews.view_generator(
  "image_selection", {
    data: TEST_TRIALS_02,
    name: 'image_selection_02',
    trials: TEST_TRIALS_02.length
  }, {
    stimulus_container_generator: forced_choice_generator.stimulus_container_gen,
    answer_container_generator: forced_choice_generator.answer_container_gen,
    handle_response_function: forced_choice_generator.handle_response_function
  }
);

const test_image_selection_03 = magpieViews.view_generator(
  "image_selection", {
    data: TEST_TRIALS_03,
    name: 'image_selection_03',
    trials: TEST_TRIALS_03.length
  }, {
    stimulus_container_generator: forced_choice_generator.stimulus_container_gen,
    answer_container_generator: forced_choice_generator.answer_container_gen,
    handle_response_function: forced_choice_generator.handle_response_function
  }
);

const divider_practice_complete = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "divider_practice_complete",
  title: "Practice finished",
  text: `Great - you are done with the practice trials. Note that in the
  following, you will not get feedback anymore.<br/>
  When you are ready, please click on CONTINUE to start the first block of the
  experimental trials.`,
  buttonText: "continue"
});

const divider_first_break = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "divider_first_break",
  title: "Take a short break",
  text: `Well done so far! - The first of three blocks is finished.
  		<br/>
  		<br/>
  		You can now take a short break if needed.
  		As soon as you are ready to continue with the experiment, click on the button below.`,
  buttonText: "Continue with block 2"
});

const divider_second_break = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "divider_second_break",
  title: "Take a short break",
  text: `Great! - You finished the second of three blocks and are nearly done with the experiment.
  		<br/>
  		<br/>
  		You can now take a short break if needed.
      As soon as you are ready to continue with the experiment, click on the button below.`,
  buttonText: "Continue with block 3"
});

// captcha
// speaker and listeneers names to be sampled from for the botcaptcha
var speaker = _.sample(["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles"]);
var listener = _.sample(["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Margaret"]);

const botcaptcha = custom_botcaptcha({
  name: 'botcaptcha',
  trials: 1,
  story: speaker + ' says to ' + listener + ': "It\'s a beautiful day, isn\'t it?"',
  question: "Who is " + speaker + " talking to?",
  speaker: speaker,
  listener: listener
});
