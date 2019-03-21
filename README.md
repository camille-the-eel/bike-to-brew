# Bike To Brew

Plan a tasty brew after your trail ride on Bike To Brew, search breweries and mountain biking trails together based on your chosen location, brewery, or trail.

=======================================================================================

**Team**
- Scott Zinski
- Camille Hughes
- Ryan Colosanti
- Marshall Dreiling

**Technologies Used**
- HTML
- CSS
- Javascript
- jQuery
- AJAX
- APIs: 
    - Mountain Bike Project (https://www.mtbproject.com/)
    - Google Places
- Materialize CSS Framework
- Adobe Fonts
- Font Awesome Icons

=======================================================================================

On page load, the user is presented with a geolocated map of their current location, populated with all mountain biking trails and breweries in a ten mile radius. These are shown on the map with their own respective icons, and on click, a pop up is shown, with the name of the selected brewery or trail and a "More Info" button. Upon clicking this button a modal with more information about said brewery or trail will be displayed for the user to browse.

Additionally, the right hand side of the populated map is a list of all nearby breweries, and a list of all nearby trails. Clicking on any of these list items will cause the map to jump to and zoom into the map icon of your selected choice, while also displaying the pop up with the name and "More Info" button.

Users have the option to search based on brewery, trail name, or location (in the form of city, city and state, latitude and longitude, or zip code). This will present the user with all trails and breweries within a ten mile radius of their search. Users also have the ability to change this radius to anywhere from one mile, up to fifty miles.


-User Story Statements

    As a cyclist
    I want to plan my ride to end with a good beer
    So that I can combine two of my favorite hobbies

    As a beer enthusiast
    I want to find trails near my favorite brewery
    So that I can exercise before I drink

Wireframe Sketch: https://xd.adobe.com/view/9981514b-9d59-41cc-62e7-0435917c9493-efb0/

- MVP

    - Target Audience: cyclists interested in beer
    - Problems: user wants to enjoy a bike ride and enjoy a tasty beer
    - Goal: connect cyclists with good trails and good beer 

    - Key Features:
    - map of trails
    - map of breweries
    - proximity to each other 
    - list of trails/breweries

    - Additional Features:
    - description for list of trails/breweries
    - time planner 
    - weather conditions



    ---start with a map 
    search options:
    -zip code
    -brewery
    -trail
