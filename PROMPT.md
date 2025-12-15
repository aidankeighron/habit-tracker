I want you to create a habbit tracking Expo React Native mobile app with TypeScript.

This app should allow the user to track 3 different kinds of habbits.

It will be a tab navigator with 3 tabs, the home tab, stats tab, and the settings tab.

The home tab will be split up into 3 vertical sections. Water, food, and workout. The top section should be the water section which is a horizontal view with three elements, a plus button, count indicator, and minus button. The plus buttona dn minus buttons should increase and decrease the counter. The counter should display the current count over the total, which will be set in the settings and defaults to 8. It should look like current count / total. With the back slash being used as a seprator. The color scheme of this section should be blue. And it should take up 1/3 of the tab and the elements should be large enough to fill up its section.

The middle section is food it is functionality the same as the water section but each press of the buttons makes the counter change by 0.5, the default total is 3, and the color scheme is green.

The bottom section is workout, its color is grey. This should be three elements. A number text input, a button, and a counter. The counter should display 0 by default and when the button is pressed it should display whatever number is in the number text input as long the number is a positive non zero number. The counter should function the same as the other sections and the default total should be 30.

For the counter of each section, it should keep its value across sessions using session storage. It should reset its values every day, but save a history of its values to session storage with the date each of the values were from. The values will reset back to 0 at the start of every day, on app load. Whenever any of the counters are changed their values should be sent to sesison stoarge, overwriting the current day. For each counter it should have a white background by default and when the current counter is larger then the total its background should be a accent color depending on the color of the section it is in.

The structure of the data in session storage should be 3 dictionaries. Each counter is its own dictionary. The key of the dictionary should be the date and the value should be the value of the counter, which should be updated whenever the counter changes.

Each section should have a label at the top.

For the stats tab it should have three sections, the same three sections as the home tab, with the same color schemes. Each section should be a line graph showing the last 7 days including the current day. With the X axis being the day and the y axis being the value of the corespoding day, with the value pulled from session stoarge. At the top of this tab should be a dropdown to change the scale of the X axis. The default should be the last 7 days but the other options should be. Last 14 days, Last 7 weeks AVG, with each data point being the average value across each week, and Last 7 weeks TOT with each data point being the total value summed up across each day of that week. The units for water are cups, the units for food is meals, and the units for workout are minutes.

The settings page should contain a way to edit the session storage data and a way to change the total for each counter. With the defaults being 8 for water, 3 for food and 30 for workout.

The UI should be simplistis with rounded edges and pastel colors. Try to make each section colorful, prefering to use light and dark versions of the accent color instead of black and white.

Make sure you handle the differences between iOS and Android, although this app will primarilty be used on Android.

Make sure you use custom types wherever possible and make sure the code is clean and not over engineered.
