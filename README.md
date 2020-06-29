# Chicago Crime-Dashboard
## Description
This project is an implementation of an open-source dashboard for crime analysis and visualisation. Click this [link](https://crime-dashboard.herokuapp.com/index.html) to access the deployed version of the dashboard. 

## Technical Guide
To deploy this application use the following steps:
1. Open the terminal and navigate to the folder where the repository will be cloned into.

``` cd folder/to/clone-into/ ```

2. Clone the repository into your local repository by inserting the command below in the terminal.

``` git clone https://github.com/Geobuddy/Crime-Dashboard.git ```

3. Deploy the application using a local host for example [Node.js live-server](https://gist.github.com/donmccurdy/20fb112949324c92c5e8).

**Note:** The App can also be deployed remotely using [Heroku](https://heroku.com) and [GithubPages](https://github.com)


## Data Resources
- [Chicago Crime API endpoint](https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-present-Map/c4ep-ee5m) 
- [Chicago Community Area Boundary](https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/data/chicago-community-areas.geojson) 
- [Chicago Community Area Population](https://www.chicago.gov/content/dam/city/depts/zlup/Zoning_Main_Page/Publications/Census_2010_Community_Area_Profiles/Census_2010_and_2000_CA_Populations.pdf)


## Graphical User Interface

The graphical user interface is an interactive component that enables the interaction between an electronic device and a user. **Figure 1** shows the implementation of a user-friendly graphical interface intended to enhance the user experience (UX). The main components of the interface are highlighted in red boxes. These are the sidebar comprising the filtering parameters (e.g. Offence Group and Dates), a map and collapsible buttons that display graphs when clicked.

<img width="1440" alt="Screenshot 2019-08-20 at 10 46 12" src="https://user-images.githubusercontent.com/41435578/64069299-1216c980-cc3f-11e9-9d1e-6de3b87cd25c.png">

**Figure 1:** Chicago Crime Dashboard graphical user interface.

## Visualisation
In this project, we have used Open Street Map (OSM) and Carto DB basemaps which can be displayed by checking the according box in the leaflet layer control located on the top right corner of the map. The basemaps can be overlain by three distinct mapping layers. Three distinct mapping visualisation techniques were adopted, a choropleth map **Figure 2**, a heatmap **Figure 3** and a cluster map **Figure 4**. A mouse pointing highlight function is available in the choropleth map enabling the user to visualise information dynamically about the chosen community area. This information is displayed in an information box located on the top right corner of the map.

<img width="1440" alt="Screenshot 2019-08-20 at 10 46 12" src="https://user-images.githubusercontent.com/41435578/64069311-3f637780-cc3f-11e9-95f8-c95b4b5a67a7.png">

**Figure 2:** Choropleth map showing crime rate in Chicago.

<img width="1440" alt="Screenshot 2019-08-20 at 10 46 12" src="https://user-images.githubusercontent.com/41435578/64069322-75a0f700-cc3f-11e9-8195-83bf7a4d72d1.png">

**Figure 3:** Heatmap showing crime density in Chicago. 

<img width="1440" alt="Screenshot 2019-08-20 at 10 46 12" src="https://user-images.githubusercontent.com/41435578/64069330-8a7d8a80-cc3f-11e9-82d8-4d7e15e2d2c2.png">

**Figure 4:** Cluster map crime clusters in Chicago.


## Analysis

The analysis section shown in (**Figure 5**), is a section of the dashboard in which the user can input two different crime type variables under the “Offence Group” dropdown to visualise and compare their trends. Similar to the graphs and charts in the previous section, this section enables the user to carry out a comparative analysis between two crime types identifying whether certain crimes follow similar trends and patterns.

<img width="1440" alt="Screenshot 2019-08-20 at 10 49 48" src="https://user-images.githubusercontent.com/41435578/64069336-9701e300-cc3f-11e9-8a91-4a2d646b7705.png">

**Figure 5:** shown the analytic section of the dashboard under the analysis tab. In this section, the user can compare statistics between two distinct crime types.


## Data

The Data section of the dashboard enables the user to navigate to a new page (**Figure 6**) where data is displayed in table form. Similar to the main page the user can filter the data using the sidebar on the left. For further filtering of the data, the user can type inside the search space inbuilt in the table as well as ordering the table in ascending and descending order.

<img width="1440" alt="Screenshot 2019-08-13 at 23 53 05" src="https://user-images.githubusercontent.com/41435578/64080578-0f26e200-ccee-11e9-870f-eecd1b0d51b4.png">

**Figure 6:** Show crime data presented in table form under the Data section of the dashboard. 

## Copyright Statement 
Copyright 2019 Adilson Pacheco and SpaceTimeLab UCL.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.<br>

THIS STATEMENT APPLIES ONLY TO THE CODE IN THIS NOTEBOOK!
THE RESOURCES USED (LIBRARIES, FILES, ... ) ARE NOT CREATED NOT OWNED BY US AND THEREFORE THE USE OF THEM FOLLOWS THEIR OWN COPYRIGHT RULES
