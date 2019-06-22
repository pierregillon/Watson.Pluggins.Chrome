[![Build Status](https://travis-ci.org/pierregillon/Watson.Plugins.Chrome.svg)](https://travis-ci.org/pierregillon/Watson.Plugins.Chrome)

# What is Watson ?
Watson is a collaborative web media fact checker.

# The Watson chrome plugin
The Chrome plugin (extension) helps you to visualise text, sentences in web pages **that are suspected to be false** and let you contribute yourself **by submitting suspicious facts** to the community.

# Features
All features are in progress. No production version is available yet. Subscribe to this repository to get posted.

## Implemented (v1.0)
- [x] During the web browsing, automatically highlight suspicious facts reported by the community
- [x] Contribute by highlighting text and submit it to the community to warn and require further investigation

## In progress
Features
- [x] List facts when same page but slightly different url (some parameters may be different)
- [ ] Contribute by investigating fact and link other sources (web sites) that are validing/invalidating those fact.
- [ ] Can upvote a supicious fact in order to indicate that further investigation is appreciated
- [ ] Can downvote a suspicious fact to indicate it is not a fact and need to be removed
- [ ] Visualize with a table base view the facts of the present web document

Technical
- [ ] Add Watson api server name in configuration and use it when building Chrome package with Babel
- [ ] Optimize api calls. Cache domains that already contains at least one suspicious fact in its web pages, in order to avoid http web requests to Watson Api for every pages browsed by any users.
- [ ] Translate plugin in English and French (i18n chrome)

# Development
Let's talk here about technical details. You might be interested of this section if you want to run the code on your machine.

## Built with
* [Webpack](https://webpack.js.org/) : module binder
* [Babel](https://babeljs.io/) : javascript code compiler
* [Chrome extension development](https://developer.chrome.com/extensions/getstarted) : chrome javascript object available in extension

## Installing & Executing
1. Install the dependencies :
```
npm install
```

2. Build the project :
```
npm run build
```

3. Open the ./dist folder from chrome://extensions/ => load unpacked extensions

## Running the tests
The tests are written using :
* [Mocha](https://mochajs.org/)
* [Chai](https://www.chaijs.com/)

Be sure mocha is installed globally :
```
npm install mocha -g
```
To run the tests :
```
npm test
```
# Versioning
The project use [SemVer](http://semver.org/) for versioning. For the versions available, see [the tags on this repository](https://github.com/pierregillon/Watson.Plugins.Chrome/releases).

# License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
