// ANIMATION TRAINING TRIALS
// training trials given in TRAIN_IDS in random order
pseudoRandomTrainTrials = function(){
  let stimuli = []
  // get data for building up stimuli
  let dict = Object.keys(TRAIN_IDS).forEach(function(key){
    let trials = TrainStimuli.map_category[key]
    let trial_ids = _.map(Object.values(trials), 'id')
    // only use trials specified in 01_config
    let vals = _.filter(Object.values(trials), function(obj){
      return(TRAIN_IDS[key].includes(obj.id))
    })
    stimuli = stimuli.concat(vals)
  });
  let trials = _.map(_.range(0, stimuli.length), function(i){
      return(getTrialById(TRAIN_TRIALS, stimuli[i].id))
  })

  let indices = [];
  let ids = _.map(stimuli, 'id')
  _.map(train_order, function(id){
    indices.push(ids.indexOf(id))
  });
  let stimuli_data = indices.map(i => stimuli[i]);
  let trial_data = indices.map(i => trials[i]);

  return {stimuli_data, trial_data}
}

let training = pseudoRandomTrainTrials()
const SHUFFLED_TRAIN_STIMULI = training.stimuli_data;
const SHUFFLED_TRAIN_TRIALS = training.trial_data;

// TEST TRIALS
randomTestIds= function(){
  return _.shuffle(_.map(TEST_DATA, 'id'))
}

pseudoRandomTestIds = function(){
  let critical = _.map(_.filter(TEST_DATA, function(dat){
    return dat.type === "critical"
  }), 'id');

  let practice = _.shuffle(_.map(_.filter(TEST_DATA, function(dat){
    return dat.type === "practice"
  }), 'id'));

  let balance = _.shuffle(_.map(_.filter(TEST_DATA, function(dat){
    return dat.type === "balance"
  }), 'id'));

  let practice_balance = _.shuffle(_.map(_.filter(TEST_DATA, function(dat){
    return dat.type === "practice-balance"
  }), 'id'));

  let control_physics = _.shuffle(_.map(_.filter(TEST_DATA, function(dat){
    return dat.type === "control-physics"
  }), 'id'));

  let filler = _.shuffle(_.map(_.filter(TEST_DATA, function(dat){
    return dat.type === "filler"
  }), 'id'));

  let attention_check = _.shuffle(_.map(_.filter(TEST_DATA, function(dat){
    return dat.type === "attention-check"
  }), 'id'));

  // practice trials
  let practice_id = _.compact(_.flatten(_.zip(_.shuffle(practice), _.shuffle(practice_balance))));

  let attention = _.shuffle(attention_check);

  let practice_ids = [practice_id[0], practice_id[1], practice[2], attention[0], practice_id[3], practice_id[4], practice_id[5]];

  // testing trials
  let control_ids = _.compact(_.flatten(_.zip(_.shuffle(filler), _.shuffle(control_physics), _.shuffle(balance))));

  let critical_shuffled = _.shuffle(critical);

  let testing_ids = [control_ids[0], critical_shuffled[0], control_ids[1], attention[1], critical_shuffled[1], control_ids[2],
  					control_ids[3], critical_shuffled[2], control_ids[4],  attention[2], critical_shuffled[3], control_ids[5],
  					control_ids[6], critical_shuffled[4], control_ids[7],  attention[3], critical_shuffled[5], control_ids[8]
  					];

  // all trials
  let shuffled_ids = _.compact(_.flatten(_.zip(practice_ids.concat(testing_ids))));

  return(shuffled_ids)
}


// save trial data in specified pseudorandom order s.t. accessible in experiment
let shuffleTestTrials = function(trial_data){
  let shuffled_trials = [];
  let trial_ids = _.map(trial_data, 'id'); // data for all to be used test-ids
  const ids_sequence = pseudoRandomTestIds();
  // const ids_sequence = randomTestIds();
  ids_sequence.forEach(function(id){
    let idx = _.indexOf(trial_ids, id)
    if(idx === -1) console.warn('Test trial with id: ' + id +  ' not found.')
    shuffled_trials.push(trial_data[idx]);
  });
  return shuffled_trials;
}

const TEST_TRIALS = shuffleTestTrials(image_selection_trials);
//const TEST_TRIALS = image_selection_trials;
const PRACTICE_TRIALS = TEST_TRIALS.slice(0, 7);
const TEST_TRIALS_01 = TEST_TRIALS.slice(7, 13);
const TEST_TRIALS_02 = TEST_TRIALS.slice(13, 19);
const TEST_TRIALS_03 = TEST_TRIALS.slice(19);
