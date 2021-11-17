main_data <- read_csv(here("results", "results_67_communicationBlocks_BG.csv"))
pilot_data <- read_csv(here("results", "results_67_communicationBlocks_BG_pilot.csv"))

# join original pilot data and
# remove data from our test-runs if had not been done before
data.original = bind_rows(pilot_data, main_data) %>% 
  filter(!str_detect(prolific_id, "test-")) %>% 
  mutate(question = case_when(question == "if_ant" ~ "ifp", 
                              question == "cons" ~ "willq",
                              T ~ question))
# clean according to predefined exclusion criteria
data.cleaned = clean_data(data.original)

# sanity check whether there are duplicate prolific ids (according to settings
# in prolific this should normally not be the case)
duplicate_prolific_ids = data.cleaned %>% 
  dplyr::group_by(submission_id, prolific_id, startDate) %>% 
  dplyr::count() %>%
  group_by(prolific_id) %>% dplyr::count() %>% filter(n > 1) %>% 
  pull(prolific_id)

message("prolific_ids that were not unique (despite exclusion criteria defined in Prolific):")
message(paste(duplicate_prolific_ids, collapse=", "))

# remove later data from duplicate prolific_ids:
fst_batch = "Sat Oct 30 2021"
snd_batch = "Mon Nov 15 2021"
pilot_batch = "Thu Sep 23 2021"

duplicates.out = data.original %>% 
  filter(prolific_id %in% duplicate_prolific_ids) %>% 
  dplyr::select(submission_id, prolific_id, startDate) %>% 
  distinct() %>%
  filter(str_detect(startDate, snd_batch))

data = anti_join(data.cleaned, duplicates.out)

n_all = data.original$submission_id %>% unique() %>% length
n_kept = data$submission_id %>% unique() %>% length
ratio_kept = round(n_kept/n_all, 2)

message(paste("Proportion of data, after cleaning, that will be included in analysis:", 
              ratio_kept))

write_csv(data, here("results", "data_cleaned.csv"))
