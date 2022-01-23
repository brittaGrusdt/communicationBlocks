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
  let critical_ids = _.shuffle(_.map(_.filter(TEST_DATA, function(dat){
    return dat.type === "critical"
  }), 'id'));

  let practice_ids = _.shuffle(_.map(_.filter(TEST_DATA, function(dat){
    return dat.type === "practice"
  }), 'id'));

  let practice_balance_ids = _.shuffle(_.map(_.filter(TEST_DATA, function(dat){
    return dat.type === "practice-balance"
  }), 'id'));

  let balance_ids = _.shuffle(_.map(_.filter(TEST_DATA, function(dat){
    return dat.type === "balance"
  }), 'id'));

  let control_physics_ids = _.shuffle(_.map(_.filter(TEST_DATA, function(dat){
    return dat.type === "control-physics"
  }), 'id'));

  let filler_ids = _.shuffle(_.map(_.filter(TEST_DATA, function(dat){
    return dat.type === "filler"
  }), 'id'));

  // first attention check is for practice block always the same
  let attention_check_ids = _.shuffle(_.map(_.filter(TEST_DATA, function(dat){
    return dat.type === "attention-check" && dat.id != "trial25"
  }), 'id'));
  attention_check_ids = ["trial25"].concat(attention_check_ids)

  // practice trials
  let practice_block_ids = _.flatten(_.zip(practice_ids, practice_balance_ids))
  practice_block_ids.splice(3, 0, attention_check_ids[0])

  // testing trials
  let control_ids = _.zip(filler_ids, control_physics_ids, balance_ids);

  // create all test ids based on 3 identical blocks
  let test_block_ids = _.map([0, 1, 2], function(i_block){
    let test_block_ids = control_ids[i_block]
    // add critical trials at specific positions
    _.map([1, 3], function(pos, i){
      test_block_ids.splice(pos, 0, critical_ids[2*i_block + i]);
    })
    // finally add attention check
    test_block_ids.splice(3, 0, attention_check_ids[i_block+1])
    return test_block_ids
  })
  return(practice_block_ids.concat(_.flatten(test_block_ids)))
}


// save trial data in specified pseudorandom order s.t. accessible in experiment
let shuffleTestTrials = function(trial_data){
  let shuffled_trials = [];
  let trial_ids = _.map(trial_data, 'id'); // data for all to be used test-ids
  const ids_sequence = pseudoRandomTestIds();
  //const ids_sequence = randomTestIds();
  ids_sequence.forEach(function(id){
    let idx = _.indexOf(trial_ids, id)
    if(idx === -1) console.warn('Test trial with id: ' + id +  ' not found.')
    shuffled_trials.push(trial_data[idx]);
  });
  return shuffled_trials;
}

const TEST_TRIALS = shuffleTestTrials(image_selection_trials);
// const TEST_TRIALS = _.filter(image_selection_trials, function(obj){
//   return(obj.type === "control-physics")
// });
const PRACTICE_TRIALS = TEST_TRIALS.slice(0, 7);

_.map(TEST_TRIALS, function(obj, idx){
  obj.block = idx <= 6 ? "practice" :
              idx >= 7 && idx<=12 ? "test1" :
              idx >= 13 && idx<=18 ? "test2" : "test3";
  return(obj)
})
const TEST_TRIALS_01 = TEST_TRIALS.slice(7, 13);
const TEST_TRIALS_02 = TEST_TRIALS.slice(13, 19);
const TEST_TRIALS_03 = TEST_TRIALS.slice(19);
