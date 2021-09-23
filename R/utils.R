FS = .Platform$file.sep

configure <- function(config_keys) {
  config_file = yaml::yaml.load_file(here("R", "config.yml"), eval.expr=TRUE)
  params = c() 
  for(key in rev(config_keys)){
    params = c(params, config_file[[key]])
  }
  return(params)
}

rep_each <- function(x, times) {
  times <- rep(times, length.out = length(x))
  rep(x, times = times)
}

# at most one control-physics trial and none of the control-random trials wrong
# and test-example trial must be correctly replied to
clean_data = function(data){
  controls = data %>% filter(startsWith(type, "control") | type=="test-example") %>% 
    dplyr::select(c(submission_id, starts_with("id"), type, question,
                    selected_pic, expected)) %>% 
    group_by(submission_id, type) %>% 
    mutate(n=n()) %>% 
    mutate(correct = selected_pic == expected, n_correct = sum(correct)) %>% 
    distinct_at(vars(c(type, submission_id)), .keep_all = T)
  
  submission_ids.out = controls %>% 
    filter(!(type == "control-random" & n_correct == n) &
           !(type == "control-physics" & n_correct >= n-1) &
           !(type == "test-example" & n_correct == 1)) %>% 
    pull(submission_id) %>% unique()
  
  return(data %>% filter(!submission_id %in% submission_ids.out))
}