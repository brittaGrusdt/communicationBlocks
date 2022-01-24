const DEBUG = false;
// var MODE = "color-vision"
// var MODE = "train"
var MODE = "test"
// var MODE = "pretest"
// var MODE = "experiment"
var ANIM_ANSWERS = "sliders"
// var ANIM_ANSWERS = "buttons"

const SCENE = {w: 800, h: 500};
PROPS = {'blocks': {'w':40, 'h': 80},
         'walls': {'w': 200, 'h': 20},
         'balls': {'radius': 20, 'move_to_roll': 4},
         'bottom': {'w': SCENE.w, 'h': 20},
         'seesaw': {'d_to_walls': 5,
                    'stick': {'w': 20, 'h': 95},
                    'plank': {'w': 220, 'h': 10},
                    'link': {'w': 5, 'h': 10},
                    'base2blocks': {'w': 90, 'h': 20}
                  },
         'if1_ssw': {'stick': {'w': 20, 'h': 25}, 'plank': {'w': 250, 'h': 10}},
         'if1_base_ssw': {w: 80, h: 12}
       };

OPTS = {
  'walls': {isStatic: true, render: {fillStyle: COLS.grey}},
  'balls': {isStatic: false, restitution: 0.02, friction: 0.0001, density: 0.002},
  'blocks': {isStatic: false, density: 0.001, restitution: .02, friction: 0.001},
  'plank': {isStatic: false, density: 0.001, restitution: .02, friction: 0.1}
}

let TEST_TYPES = ['if1', 'if2ssw', 'independent', 'independent_edge', 'if2',
                  'independent_edge3'];

// Proportion of block that's ON TOP of its base wall beneath
let PRIOR = {
  'vertical': {'high': 0.40, 'uncertainH': 0.52, 'uncertain': 0.54,
               'uncertainL': 0.55, 'lowH': 0.62, 'low': 0.70, 'never': 1.25
              },
  'horizontal': {'high': 0.42, 'uncertainH': 0.5, 'uncertain': 0.51,
                 'uncertainL': 0.53, 'lowH': 0.6, 'low': 0.67, 'lowL': 0.70,
                 'never': 1.25
                },
  'impossible': 1.25,
  'conditions': ['high', 'uncertain', 'low', 'never',
                 'uncertainH', 'uncertainL']
}

// shift of ramp walls such that there is no edge (should not be changed)
let OVERLAP_SHIFT = {
  "angle45": 16,
  "angle42": 15, "angle40": 15, "angle38": 19, "angle35": 16,
  "angle32": 12, "angle30": 12,
  "angle29": 12, "angle28": 13, "angle27": 12, "angle26": 12, "angle25": 12,
  "angle23": 10, "angle20": 9, "angle18": 9
}

// one of the angles specified in OVERLAP_SHIFT
let ANGLES = {
  'default': 32
}

// used for pre-experiment trying out different angles for the ramp
let PRETEST_ANGLES = _.range(45);

// base (lower) wall of ramp, its width depends on the prior/direction of block
// that will be put on top. longer widths for lower probabilities of block to fall
// values are specific for default angle (of 32), if different angle is used,
// these values will probabily need to be respecified
let BASE_RAMP = {
  'horizontal': {'high': 125, 'uncertainH': 130, 'uncertain': 165,
                 'uncertainL': 200, 'low': 270, 'xlow': 300, 'never': 270},
  'vertical': {'high': 130, 'uncertainH': 220, 'uncertain': 255,
               'uncertainL': 290, 'low': 320, 'xlow': 400, 'never': 320},
  'default': 200
};

let SIMULATION = {'duration': 5000};

// how long is the base wall next to ramp,
// high -> low probability for block to fall;
// .. low -> high probability for block to fall;
let IF1_BASE_RAMP = "high"
//let IF1_IS_EXHAUSTIVE = true
//let TRAIN_TYPES = ['ramp', 'uncertain', 'if2ssw', 'independent', 'if1', 'cp']
let TRAIN_IDS = {
  'cp': ['independent_edge_nh',
         'if1_hn',
         'if1_nn',
         'if1_ln',
         'if2_nnh',
         'if2_hnh',
         'if2_nnl'//,
         // 'independent_edge_nn',
         // 'if1_u-Ln',
         // 'if1_u-Hh',
         // 'if2_u-Lnu-H', 'if2_u-Hnu-H', 'if2_u-Hnu-L', 'if2_u-Lnu-L',
       ]
  }

let train_expectations = {
  'independent_edge_nh': ['CONS'],
  'if1_hn': ['ANT', 'CONS'],
  'if1_nn': ['none'],
  'if1_ln': ['none'],
  'if2_nnh': ['CONS', 'yellow'],
  'if2_hnh': ['ANT', 'CONS', 'yellow'],
  'if2_nnl': ['none'],

  'independent_edge_nn': ['none'],
  'if1_u-Ln': ['none'],
  'if1_u-Hh': ['ANT', 'CONS'],
  'if2_u-Lnu-H': ['yellow', 'CONS'],
  'if2_u-Hnu-H': ['yellow', 'ANT', 'CONS'],
  'if2_u-Hnu-L': ['ANT', 'CONS'],
  'if2_u-Lnu-L': ['none'],
  'if2_nnl': ['none']
}
// SPECIFY TRAIN ORDER: alternate between trials where sth happens and trials
// where nothing happens
train_expectations_ids = _.filter(Object.keys(train_expectations), function(id){
  return(TRAIN_IDS.cp.includes(id))
});
let train_expect_none = []
let train_expect_sth = []
_.forEach(train_expectations_ids, function(id, i){
  train_expectations[id][0] === "none" ? train_expect_none.push(id) : train_expect_sth.push(id);
});

// order st. sth happens alternates with nothing happens and if1_hn followed by if1_ln
let trials_fixed_order = ["if1_hn", "if1_ln"]
train_expect_sth = _.filter(train_expect_sth, function(id){
    return(trials_fixed_order.indexOf(id) == -1)
});
train_expect_none = _.filter(train_expect_none, function(id){
  return(trials_fixed_order.indexOf(id) == -1)
})
// simple alternating between two types
TRAIN_ORDER = _.filter(_.flatten(_.zip(_.shuffle(train_expect_sth),
                                       _.shuffle(train_expect_none))),
                           function(id){ return id !== undefined});
// add two trials that shall appear in fixed order:
TRAIN_ORDER = trials_fixed_order.concat(TRAIN_ORDER);

// console.log(train_expect_sth)
// console.log(train_expect_none)
//console.log(TRAIN_ORDER)

COLS_GROUPS = {group1: {ANT: "BLUE", CONS: "GREEN"},
               group2: {ANT: "GREEN", CONS: "BLUE"},
               example: {}
              }
QUESTS = {
  neutral: 'Which blocks do you think will fall?',
  cons: 'Will the CONS block fall?',
  if_ant: 'What happens if the ANT block falls?',
  if_cons: 'What happens if the CONS block falls?',
  if_ant_yellow: 'What happens if the YELLOW block falls?'
}
ANSWERS = {
  conditional: 'If the ANT block falls, the CONS block will fall.',
  conditional_yellow: 'If the YELLOW block falls, the CONS block will fall.',
  conditional_all: 'If the ANT or the YELLOW block falls, the CONS block will fall.',
  conditional_not: 'Even if the ANT block falls, the CONS block will NOT fall.',
  not_cons: 'The CONS block will NOT fall.',
  cons: 'The CONS block will fall.',
  both: 'The CONS and the ANT block will fall.',
  not_both: 'NEITHER the ANT NOR the CONS block will fall.',
  ant: 'The ANT block will fall.',
  not_ant: 'The ANT block will NOT fall.',
  might_ant: 'The ANT block MIGHT fall.',
  yellow: 'The YELLOW block will fall.',
  yellow_cons: 'The YELLOW and the CONS block will fall.',
  all3: 'The YELLOW, the ANT and the CONS block will fall.',
  not_yellow_cons: 'NEITHER the YELLOW NOR the CONS block will fall.',
  attention_check: '<br/><small>So, click on the SIDE picture.</small>',
  normal_check: '<br/><small>So, click on the picture(s) that you think Bob is likely to have described.</small>'
}

TEST_DATA = [
  //example to take screenshot for instructions
  //{id: "trial_ex", id1: "ind_edge_hn", id2: "ind_edge_hh_v2", id3: "ind_edge_hh", id0: "ant_ind_h", property_id1: "control", property_id2: "exhaustive", property_id3: "non-exhaustive", question: QUESTS.neutral, answer: ANSWERS.both, type: 'example-instruction'},

  // critical trials
  {id: "trial1", id1: "if1_un_ind", id2: "if1_un", id3: "if2_unu", id0: "ant_u", property_id1: "contrast", property_id2: "exhaustive", property_id3: "non-exhaustive", question: QUESTS.if_ant, answer: ANSWERS.conditional, type: 'critical', expected:'', bob:''},
  {id: "trial2", id1: "if1_un_ind", id2: "if1_un", id3: "if2_unu", id0: "cons_n", property_id1: "contrast", property_id2: "exhaustive", property_id3: "non-exhaustive", question: QUESTS.cons, answer: ANSWERS.conditional, type: 'critical', expected:'', bob:''},
  {id: "trial3", id1: "if1_un_ind", id2: "if2_unn_horiz", id3: "if1_uu", id0: "ant_u", property_id1: "contrast", property_id2: "exhaustive", property_id3: "non-exhaustive", question: QUESTS.if_ant, answer: ANSWERS.conditional, type: 'critical', expected:'', bob:''},

  {id: "trial4", id1: "if1_un_ind", id2: "if1_un", id3: "if1_uu", id0: "ant_u", property_id1: "contrast", property_id2: "exhaustive", property_id3: "non-exhaustive", question: QUESTS.if_ant, answer: ANSWERS.conditional, type: 'critical', expected:'', bob:''},
  {id: "trial5", id1: "if1_un_ind", id2: "if2_unn_horiz", id3: "if2_unu", id0: "ant_u", property_id1: "contrast", property_id2: "exhaustive", property_id3: "non-exhaustive", question: QUESTS.if_ant, answer: ANSWERS.conditional, type: 'critical', expected:'', bob:''},
  {id: "trial6", id1: "if1_un_ind", id2: "if2_unn_horiz", id3: "if2_unu", id0: "cons_n", property_id1: "contrast", property_id2: "exhaustive", property_id3: "non-exhaustive", question: QUESTS.cons, answer: ANSWERS.conditional, type: 'critical', expected:'', bob:''},

  // practice trials
  {id: "trial7", id1: "if2_unn_horiz", id2: "if1_un", id3: "if2_unu", id0: "cons_n", property_id1: "contrast", property_id2: "contrast", property_id3: "literal", question: QUESTS.neutral, answer: ANSWERS.conditional_all, type: 'practice', expected: 'picture3', bob:'picture3'},
  {id: "trial8", id1: "if2_nnn_horiz", id2: "if2_nnh_right", id3: "if2_hnh", id0: "ant_n", property_id1: "contrast", property_id2: "contrast", property_id3: "literal", question: QUESTS.neutral, answer: ANSWERS.all3, type: 'practice', expected:'picture3', bob:'picture3'},
  {id: "trial9", id1: "if2_nnn_horiz", id2: "if2_unn", id3: "if2_nnh", id0: "cons_n", property_id1: "contrast", property_id2: "contrast", property_id3: "literal", question: QUESTS.neutral, answer: ANSWERS.yellow_cons, type: 'practice', expected:'picture3', bob:'picture3'},

  // balance trials
  {id: "trial10", id1: "if1_un_ind", id2: "if1_un", id3: "if2_unh_ind", id0: "ant_u", property_id1: "contrast", property_id2: "literal", property_id3: "contrast", question: QUESTS.if_ant, answer: ANSWERS.conditional, type: 'balance', expected:'picture2', bob: 'picture2'},
  {id: "trial11", id1: "if1_un_ind", id2: "if1_un", id3: "if1_un_up", id0: "cons_n", property_id1: "contrast", property_id2: "literal", property_id3: "literal", question: QUESTS.cons, answer: ANSWERS.conditional, type: 'balance', expected:'picture2_picture3', bob: _.sample(["picture2", "picture3"])},
  {id: "trial12", id1: "if2_unn_ind_horiz", id2: "if2_unn_horiz", id3: "if1_un_ind", id0: "ant_u", property_id1: "contrast", property_id2: "literal", property_id3: "contrast", question: QUESTS.if_ant, answer: ANSWERS.conditional, type: 'balance', expected: 'picture2', bob:'picture2'},
  // practice-balance
  {id: "trial13", id1: "if2_unn_ind_horiz", id2: "if2_unn_horiz", id3: "if2_unn_up_horiz", id0: "cons_n", property_id1: "contrast", property_id2: "literal", property_id3: "literal", question: QUESTS.cons, answer: ANSWERS.conditional, type: 'practice-balance', expected:'picture2_picture3', bob: _.sample(["picture2", "picture3"])},
  {id: "trial14", id1: "if2_unn_ind_horiz", id2: "if1_un", id3: "if2_unn_horiz", id0: "ant_u", property_id1: "contrast", property_id2: "literal", property_id3: "literal", question: QUESTS.if_ant, answer: ANSWERS.conditional, type: 'practice-balance', expected:'picture2_picture3', bob: _.sample(["picture2", "picture3"])},
  {id: "trial15", id1: "if1_un_ind", id2: "if2_unn_horiz", id3: "if2_unn_ind_horiz", id0: "cons_n", property_id1: "contrast", property_id2: "literal", property_id3: "contrast", question: QUESTS.cons, answer: ANSWERS.conditional, type: 'practice-balance', expected:'picture2', bob: 'picture2'},

  // control-physics trials
  {id: "trial16", id1: "if1_hn", id2: "if1_nn", id3: "if2_nnh", id0: "cons_n", property_id1: "contrast", property_id2: "literal", property_id3: "contrast", question: QUESTS.neutral, answer: ANSWERS.not_both, type: 'control-physics', expected:'picture2', bob:''} ,
  {id: "trial17", id1: "if1_hn_ind", id2: "if1_nn", id3: "if1_hn", id0: "cons_n", property_id1: "contrast", property_id2: "contrast", property_id3: "literal", question: QUESTS.neutral, answer: ANSWERS.both, type: 'control-physics', expected:'picture3', bob:''},
  {id: "trial18", id1: "if2_hnn_horiz", id2: "if2_nnh_right", id3: "if2_nnh", id0: "cons_n", property_id1: "contrast", property_id2: "literal", property_id3: "contrast", question: QUESTS.neutral, answer: ANSWERS.not_both, type: 'control-physics', expected:'picture2', bob:''},

  // filler-trials
  {id: "trial19", id1: "ind_edge_hh", id2: "ind_edge_hnh", id3: "ind_edge_hnn_horiz", id0: "ant_ind_h", property_id1: "contrast", property_id2: "pragmatic", property_id3: "literal", question: QUESTS.neutral, answer: ANSWERS.not_cons, type: 'filler', expected:'', bob:''},
  {id: "trial20", id1: "ind_edge_nn", id2: "ind_edge_nhn", id3: "ind_edge_nhh", id0: "ant_ind_n", property_id1: "contrast", property_id2: "pragmatic", property_id3: "literal", question: QUESTS.neutral, answer: ANSWERS.cons, type: 'filler', expected:'', bob:''},
  {id: "trial21", id1: "if1_nh", id2: "if2_nnh_right_ind", id3: "if2_nnn_horiz", id0: "ant_n", property_id1: "contrast", property_id2: "pragmatic", property_id3: "literal", question: QUESTS.neutral, answer: ANSWERS.not_both, type: 'filler', expected:'', bob:''},

  // attention check trials
  // bobs picture (what he sees, field 'bob') must be given for the attention-check trial used in practice block!
  {id: "trial22", id1: "if2_nnn_horiz", id2: "if1_un_ind", id3: "if1_un", id0: "cons_n", property_id1: "contrast", property_id2: "pragmatic", property_id3: "literal", question: QUESTS.neutral, answer: ANSWERS.might_ant, type: 'attention-check', expected:'picture2', bob:''},
  {id: "trial23", id1: "ind_edge_hh", id2: "ind_edge_nnn", id3: "ind_edge_hnn_horiz", id0: "ant_ind_h", property_id1: "contrast", property_id2: "literal", property_id3: "pragmatic", question: QUESTS.neutral, answer: ANSWERS.not_yellow_cons, type: 'attention-check', expected:'picture3', bob:''},
  {id: "trial24", id1: "if1_nn_ind", id2: "if2_nnh", id3: "if2_hnh_right", id0: "cons_n", property_id1: "contrast", property_id2: "pragmatic", property_id3: "literal", question: QUESTS.cons, answer: ANSWERS.yellow_cons, type: 'attention-check', expected:'picture2', bob:''},
  {id: "trial25", id1: "if2_unn_horiz", id2: "if1_uu", id3: "if1_un_ind", id0: "ant_u", property_id1: "contrast", property_id2: "contrast", property_id3: "literal", question: QUESTS.if_ant, answer: ANSWERS.conditional_not, type: 'attention-check', expected:'picture3', bob:'picture3'}
];

PRACTICE_IDS = _.map(_.filter(TEST_DATA, function(obj){
  return obj.type == 'practice'
}), 'id')


TEST_DATA = _.map(TEST_DATA, function(data){
  let answer2 = data.type == "attention-check" ? ANSWERS.attention_check : ANSWERS.normal_check;
  data.answer = data.answer + answer2
  return(data)
});

TEST_IDS = _.map(TEST_DATA, 'id')

// position of antecedent-block in if2ssw/independent-trials wrt its base platform
// (here probability to fall depends on width of ramp as ball is moving on its own)
let IF2_POS_BLOCK_RAMP = "never"
let IND_POS_BLOCK_RAMP = "never"
// distance to ramp is made larger when prior of a horizontal block (assured in
// makeTestStimuli) in if2ssw/independent-trials, where uncertainty comes from
// width of ramp base, is low
let DIST_POS_BLOCK_RAMP_LOW = 50

// fine-grained uncertain priors, e.g. u-Ll/u-Hl do not need extra entry, they
// shall be treated as their corresponding trial with a simple uncertain prior.
let HORIZ_AC2 = {
  'nn': ['vertical', 'horizontal'], 'nl': ['vertical', 'horizontal'],
  'nu': ['vertical', 'horizontal'], 'nh': ['vertical', 'horizontal'],

  'ln': ['vertical', 'vertical'], 'll': ['horizontal', 'horizontal'],
  'lu': ['vertical', 'horizontal'], 'lh': ['horizontal', 'vertical'],

  'un': ['vertical', 'vertical'], 'ul': ['vertical', 'horizontal'],
  'uu': ['horizontal', 'horizontal'], 'uh': ['vertical', 'horizontal'],

  'hn': ['vertical', 'vertical'], 'hl': ['vertical', 'horizontal'],
  'hu': ['vertical', 'horizontal'], 'hh': ['vertical', 'vertical'],
}

let HORIZ_IND = {
  'nn': ['vertical', 'vertical'], 'nl': ['vertical', 'vertical'],
  'nu': ['vertical', 'vertical'], 'nh': ['vertical', 'vertical'],

  'ln': ['vertical', 'horizontal'], 'll': ['vertical', 'horizontal'],
  'lu': ['vertical', 'horizontal'], 'lh': ['horizontal', 'vertical'],
  'un': ['vertical', 'horizontal'], 'ul': ['vertical', 'horizontal'],
  'uu': ['horizontal', 'vertical'], 'uh': ['horizontal', 'vertical'],
  'hn': ['vertical', 'horizontal'], 'hl': ['horizontal', 'horizontal'],
  'hu': ['horizontal', 'vertical'], 'hh': ['vertical', 'vertical']
}

let HORIZ_AC1 = {
  'nn': ['vertical', 'vertical'], 'nl': ['vertical', 'vertical'],
  'nu': ['vertical', 'vertical'], 'nh': ['vertical', 'vertical'],

  'ln': ['vertical', 'vertical'], 'll': ['vertical', 'vertical'],
  'lu': ['vertical', 'vertical'], 'lh': ['vertical', 'vertical'],

  'un': ['vertical', 'vertical'], 'ul': ['vertical', 'vertical'],
  'uu': ['vertical', 'vertical'], 'uh': ['vertical', 'vertical'],

  'hn': ['vertical', 'vertical'], 'hl': ['vertical', 'vertical'],
  'hu': ['vertical', 'vertical'], 'hh': ['vertical', 'vertical']
}
