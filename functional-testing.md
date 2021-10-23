<!-- Functional Testing -->

When first opening the site, it loads the game page in default theme.  
Intro launches when opening the site for the first time.  
Clicking the logo reloads the site, loading the game page in the theme that it was in previously.  
Intro launches when opening the site again, but before playing a game.  
Clicking the help button while in the game page, launches the intro.  
Clicking next in the intro goes to the next intro step.  
Clicking back in the intro goes to the previous step.  
Clicking back while on the first step of the intro does nothing.  
Clicking next while on the last step of the intro closes the intro.  
Clicking the x in the top left corner of the intro, or clicking outside of the intro screen closes the intro.  
When testing going back and forth between intro steps, step 3 would keep creating more circles, instead of sticking with the current circles.  
  
![Intro-repetition issue](https://github.com/lavadax/MS2-Monkey-Brain/blob/master/documentation/Intro-repetition.png)  
  
During the same testing, going back from step 6 would not show the circles like it was supposed to.  
Combining this with the previous issue, gave this result.  
  
![Intro-hidden issue](https://github.com/lavadax/MS2-Monkey-Brain/blob/master/documentation/Intro-hidden.png)  
  
Adding a few extra checks in the intro function ensured proper functionality when going back and forth.  
  
Clicking the facebook button opens the correct facebook page.  
Clicking the twitter button opens the correct twitter page.  
Clicking the twitch button opens the correct twitch page.
  
Clicking the history button before playing any games instructs the user to play a game first and doesn't display any other data.  
  
When clicking the start button, a game is started and 5 circles are drawn in the game area.  
  
When clicking the help button, the user is warned if they're already playing a game.  
If the user clicks "cancel", the intro isn't launched.  
If the user clicks "ok", the current game is ended and the intro is launched.  

When clicking the history button, the user is warned if they're already playing a game.  
If the user clicks "cancel", the history page isn't opened.  
If the user clicks "ok", the current game is ended and the history page is opened.  
  
When a game is active, clicking number 1 will hide all other numbers, while clicking other numbers will do nothing.  
After clicking number 1, clicking number 2 (and any subsequent number afterwards) will show that number until the last number is clicked.  
Clicking a number out of order stops the game.  
After clicking the first 5 numbers in the correct order, the user is informed for level completion, and 6 circles will be generated.  
The number of generated circles is incremented by 1 after every level completion, restarting with 5 upon failing a level.  
  
* Below theme selection & import/export tested in game page and history page.  

Clicking the themes button opens up a dropdown with a selection between default and dark theme.  
Clicking the themes button while the dropdown is open, closes the dropdown.  
Selecting default while in default theme does nothing.  
Selecting dark while in default theme applies the dark theme.  
Selecting dark while in default theme does nothing.  
Selecting default while in dark theme applies the default theme.  
  
Clicking the settings button opens up a drowndown with a selection between "import save" and "export save".  
Clicking the settings button while the dropdown is open, closes the dropdown.  
Selecting export save opens up a confirm window with the save data highlighted/selected.  
Clicking cancel or OK closes the confirm window with no additional actions.  
Selecting import save opens up a confirm window.  
Clicking OK while the text field is empty, or clicking cancel closes the confirm window with no additional actions.  
Clicking OK after pasting valid save data in the text field will import the save data and change the theme according to the imported data.  
Clicking OK after pasting invalid save data will notify the user the data was invalid.  
Clicking OK after pasting invalid save data while the first 6 characters are the expected characters will import the invalid data and will potentially apply a non-existing theme.  
  
Finishing a game with a better score than the previous high score updates the high score on the bottom of the page.  
Finishing a game with a worse or the same score as the previous high score has no impact on the high score on the bottom of the page.  
  
<!-- TODO add functional testing of history page with example import data -->