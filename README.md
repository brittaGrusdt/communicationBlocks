# Experiment

1. Experiment code

- communicationBlocks.html
  run this file to start the experiment, make sure that MODE (in stimuli/01_config.js) is set to 'experiment'.

Magpie-code for the experiment is in js-files, named according to the order how they are loaded in the communicationBlocks.html-file:

- 02_custom_functions.js: mostly experiment-related functions, constants related to stimuli
- 03_custom_views_templates.js: generate view-templates, called in 05_views.js
- 04_trials.js: generates actual data for experiment
- 05_views.js: generate views used in the experiment
- 06_main.js: main 'configuration'-file for the experiment (prolific config etc.), where all views are specified that will be loaded in the experiment

2. Stimuli
All stimuli-related code/data is is stored in 'stimuli/'.
- img/
contains all images used in the experiment. Subfolders group1/group2 contain the test-stimuli, with antecedent-block being blue/green. Pictures of train stimuli are stored in 'train'-folder.

- img/01_config.js
This is the file where all configurations of the generated scenes are set, e.g.the width/color of blocks, the mapping from prior of blocks to fall to their position on the edge (proportion of block that is on top of platform) etc.

- index-stimuli.html
run this file to show generated animations (make sure that MODE in stimuli/01_config.js is set to 'test' or 'train' depending on animations you want to see)

- Currently, we generate the following kinds of test-stimuli:
  1. **if1_xy**
  x (y) correspond to prior probability of antecedent (consequent)-block to fall on its own. In these trials, the width of the base ramp is always the same, as specified in stimuli/01_config.js in variable *IF1_BASE_RAMP* (default: high).

  2. **if2ssw_xy**
  x corresponds to the prior probability of the antecedent-block to fall on its own, i.e.,by the ball on the ramp that is rolling on its own, and y corresponds to the prior probability of the consequent-block to fall on its own. These trials are constructed such that the probability of the antecedent-block to fall depends on the width of the base ramp as the ball on top moves on its own, without the influence of anything else. Therefore, the position of the antecedent-block with respect to its base platform is always the same, as specified in stimuli/01_config.js in variable *IF2_POS_BLOCK_RAMP* (default: never).

  3. **independent_xy**
  x corresponds to the prior probability of the antecedent-block (left block), y to the prior probability of the consequent-block (right block) to fall on its own, i.e.,by the ball on the ramp that is rolling on its own. As in if2-trials the width of the base ramp is defined by the prior probability of the consequent-block to fall, and its position is always the same, as specified in stimuli/01_config.js in variable *IND_POS_BLOCK_RAMP* (default: never).

  4. **independent_edge_xy**
  x corresponds to the prior probability of the antecedent-block (left block), y to the prior probability of the consequent-block (right block) to fall on its own. Simple situations with two blocks, each on a separate platform.

  5. **if2_xyz**
  if2_xy: as if1_xy but with further third block on top right.
