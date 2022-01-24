// In this file you can specify the trial data for your experiment

// Test trials
//var test_qud = "This is the partial scene that Ann sees:"
var test_qud = ""
var image_selection_trials = [];
TEST_DATA.forEach(function(dat) {
  let idx_quest = Object.values(QUESTS).indexOf(dat.question)
    image_selection_trials.push({
      id: dat.id,
      QUD: test_qud,
      question: Object.keys(QUESTS)[idx_quest],
      question_long: "<b>Ann</b>: " + dat.question,
      answer: "<b>Bob</b>: " + dat.answer,
      picture1: "stimuli/img/group/" + dat.id1 + ".png",
      picture2: "stimuli/img/group/" + dat.id2 + ".png",
      picture3: "stimuli/img/group/" + dat.id3 + ".png",
      //picture0: "stimuli/img/group/" + dat.id0 + ".png",
      picture0: "stimuli/img/group/" + dat.id0 + ".jpeg",
      picture_bob: "stimuli/img/bobs-screen.jpeg",
      id1: dat.id1,
      id2: dat.id2,
      id3: dat.id3,
      id0: dat.id0,
      type: dat.type,
      property_id1: dat.property_id1,
      property_id2: dat.property_id2,
      property_id3: dat.property_id3,
      bob: dat.bob
    });
});

// adapt path to pictures depending on colour group in each trial
// add group and id separately
// here I changed code to save changes into slider_rating_trials 22.5. Malin
_.map(image_selection_trials, function (trial) {
  let group = _.sample(["group1", "group2"]);
  trial.picture1 = trial.picture1.replace("group", group);
  trial.picture2 = trial.picture2.replace("group", group);
  trial.picture3 = trial.picture3.replace("group", group);
  trial.picture0 = trial.picture0.replace("group", group);
  trial.group = group;
  trial.expected = trial.expected;
});

let image_selection_practice = _.filter(image_selection_trials, function(obj){
  return obj.type.includes('practice')
})
// _.map(image_selection_practice, function(dat) {
//   dat.QUD = "PRACTICE TRIAL<br/><br/>" + dat.QUD;
// });


// EXAMPLE_TEST_TRIALS = {
//   id: "example-test-trials",
//   QUD: "EXAMPLE TRIAL<br/><br/>" + test_qud,
//   picture1: "stimuli/img/example_test_trials1.png",
//   picture2: "stimuli/img/example_test_trials2.png",
//   id1: "example_test_trials1",
//   id2: "example_test_trials2",
//   id3: "",
//   id0: "",
//   answer: "<b>Bob</b>: " + ANSWERS.yellow + ANSWERS.normal_check,
//   question_long: "<b>Ann</b>: " + QUESTS.neutral,
//   question: "neutral",
//   expected: "picture1",
//   group: 'example',
//   type: 'test-example',
//   property_id1: "",
//   prperty_id2: ""
// }

// ----- TRAINING TRIALS (Buttons) for exp1 + exp2 ---- //
// the data of the training stimuli is always the same,
// the 4 buttons are always shown in same order
let TRAIN_TRIALS = [];
let train_keys = Object.keys(TRAIN_IDS);
train_keys.forEach(function (kind) {
  TRAIN_IDS[kind].forEach(function(id){
    let data = {
      QUD: "Use the buttons below to select all the blocks that you think will fall.<br/>(Multiple selections possible!)",
      id: id,
      question: '',
      expected: train_expectations[id],
      type: 'training'
    };
    TRAIN_TRIALS.push(data);
  });
});
