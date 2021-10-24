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
Clicking OK after pasting valid data with no play history counts as invalid data.  
An additional data validation check was implemented for this scenario, allowing the importing of empty play data, effectively clearing the play history and applying the requested theme.
  
Finishing a game with a better score than the previous high score updates the high score on the bottom of the page.  
Finishing a game with a worse or the same score as the previous high score has no impact on the high score on the bottom of the page.  
  
* More extensive data import testing follows below:  
  
Importing `["[]",0,"default"]` opens a confirmation dialog.  
Clicking cancel on the confirmation dialog notifies the user of the cancellation.  
Clicking OK on the confirmation dialog without typing in the text box notifies the user the import was cancelled.  
Clicking OK on the confirmation dialog while adding the incorrect text in the text box notifies the user the import was cancelled.  
Clicking OK on the confirmation dialog while adding "I confirm" in the text box clears the play history and doesn't affect the theme.  
After add ing the required function in the import function, confirming now loads the requested theme after clearing the play history.
  
Importing `["[]",0,"test"]` opens a confirmation dialog.  
This has the same result as the previous testing.  
  
Importing `["[]",0,"dark"]` opens a confirmation dialog.  
This has the same result as the previous testing with 1 exception which is as follows.  
Clicking OK on the confirmation dialog while adding "I confirm" in the text box clears the play history and loads the dark theme without further notifying the user.  
  
Importing `["[[\"2021-09-15\",1,0]]",0,"default"]` without any previous play history updates localStorage with the imported data.  
The history page accurately represents the single day data.  
  
Importing `["[[\"2021-09-15\",1,0]]",0,"default"]` with previous play history updates localStorage with  the imported data.  
The history page accurately represents the single day data.  
Importing `["[[\"2021-09-15\",1,0]]",0,"default"]` with play history of the current date updates localStorage with the imported data.  
When opening the history tab, localStorage gets the previously collected play history of the current day added which is also shown in the history page.  
After updating the import function with a daily record and attempts clear, this no longer happens and now the history page accurately represents the single day data.  
  
Importing `["[[\"2021-09-15\",5,6]]",0,"default"]` updates localStorage with the imported data.  
the history page accurately represents the single day data, however the record paragraph is not updated, as the imported record is 0 despite the record for the imported date being 6.  
After adding a loop to confirm the record, updating the localStorage record at the end of the loop, and forcing a page reload upon importing, the page is now properly updated with the correct data.  
  
Importing `["[[\"1905-09-15\",5,6]]",0,"default"]` updates localStorage with the imported data.  
The history page accurately represents the single day data.  
  
Importing `["[[\"1905-0-15\",5,6]]",0,"default"]` updates localStorage with the imported data.  
Despite this being an invalid date, it is not part of the current data validation and thus passes validation.  
Validation for this scenario might be implemented in the future.  
  
Importing `["[[\"1905-0-15\",5,6]]",,"default"]` throws a syntaxError in the console.  
As this can be fixed by a more extended data validation, the issue is noted but is currently not fixed.  
  
Importing `["[[\"1905-0-15\",5,6]]","default"]` notifies the user they imported invalid data and doesn't change the localStorage, or html.  
  
Importing `["[[\"1905-0-15\",a,6]]",0,"default"]` throws a syntaxError in the console.  
Reloading the page at this point will break the page until the history localStorage item is deleted and the page reloaded.  
As this can be fixed by a more extended data validation, the issue is noted but is currently not fixed.  
  
Importing `["[[\"1905-0-15\",5,6]]","a","default"]` updates the localStorage with the imported data, including the all-time record of "a".  
Adding a typeof check on the all-time record fixes this issue.  
    
Importing `["[[\"1905-0-15\",5,6]]",a,"default"]` throws a syntaxError in the console.  
As this can be fixed by a more extended data validation, the issue is noted but is currently not fixed.  
  
Importing `["[[\"2021-10-24\",1,0],[\"2021-10-24\",1,0]]",0,"default"]` updates the localStorage with the imported data, regardless of it being duplicated.  
As this can be fixed by a more extended data validation, the issue is noted but is currently not fixed.  
  
Important note: this was tested on 2021-10-24.
Importing `["[[\"2021-10-24\",1,0],[\"2021-10-25\",1,0]]",0,"default"]` updates the localStorage with the imported data, and later changes it to `["[[\"2021-10-24\",1,0],[\"2021-10-25\",1,0],[\"2021-10-24\",1,0]]",0,"default"]`, as the code assumes that if the current date is present, it will be the last date in the array.  
As this can be fixed by a more extended data validation, the issue is noted but is currently not fixed.  
  
Importing `["[[\"2021-10-25\",1,0],[\"2021-10-24\",1,0]]",0,"default"]` updates the localStorage with the imported data, despite the dates being out of order.  
As this can be fixed by a more extended data validation, the issue is noted but is currently not fixed.  
  
Importing `["[[\"2021-10-17\",1,0],[\"2021-10-18\",1,0],[\"2021-10-19\",1,0],[\"2021-10-20\",1,0],[\"2021-10-21\",1,0],[\"2021-10-22\",1,0],[\"2021-10-23\",1,0],[\"2021-10-24\",1,0]]",0,"default"]` updates the localStorage with the imported data.  
The history page accurately represents the latest 7 dates when showing the history by day, shows 2 weeks when checking weekly, and 1 month when checking monthly.  
  
Adding more dates consistently shows the correct data in the history page.  
  
Importing is limited by the rudimentary data validation, but aside from the previously mentioned syntax errors, no major issues have been found.  