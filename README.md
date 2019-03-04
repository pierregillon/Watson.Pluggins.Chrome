# What is Watson ?
Watson is a collaborative web media fact checker.

# The Watson chrome pluggin
The Chrome pluggin (extension) helps you to visualise text, sentences in web documents that are suspected to be false and let you contribute yourself by submitting suspicious fact to the community.

# Development progress
All features are in progress. No version is available yet. Subscribe to this repository to get posted.

# v1.0 Features
* [DONE] During the web browsing, automatically highlight suspicious facts reported by the community
* [IN PROGRESS] Contribute by highlighting text and submit it to the community tp warn and require further investigation

# Next releases
* Contribute by investigating fact and link other sources (web sites) that are validing/invalidating those fact.
* Can upvote a supicious fact in order to indicate that further investigation is appreciated
* Can downvote a suspicious fact to indicate it is not a fact and need to be removed
* Visualize with a table base view the facts of the present web document

# Technical features
* Cache domains that already contains at least one suspicious fact in its web pages, in order to avoid http web requests to Watson Api for every pages browsed by any users.

# todo list
- use web pack
- translate plugin with i18n (fr, en)
- continuous integration with appveyor ?
