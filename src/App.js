import React from "react";
//import { csv } from "d3-fetch";
import { useFetch } from "./hooks/useFetch";
import { scaleLinear } from "d3-scale";
import { extent, max, min, bin } from "d3-array";
import { geoNaturalEarth1 } from "d3-geo-projection"
import * as topojson from "topojson-client"
import world from "../land-50m"
import { Axis, Orient } from "d3-axis-for-react"
const viewHeight = 500;
const viewWidth = 500;

//April 15th lecture:
//1. push csv to github
//2. use fetch api to use it in your app
//3. make sure data is in your root, push it to your repository, select it raw, copy githubcontent link.

const App = () => {










  //this is from April 20th lecture: storing the data in state
  const [data, loading] = useFetch(
    "https://raw.githubusercontent.com/ovictori/redo1/main/weather.csv"
  );
  const [data2, loading2] = useFetch(
    "https://raw.githubusercontent.com/ovictori/redo1/main/weather2nd1300.csv"
  );

  //  console.log("from hook ", loading, data);
  /* this is from April 15th lecture
  csv("https://raw.githubusercontent.com/ovictori/redo1/main/weather.csv")
  .then((data) => console.log(data))
 */
  const size = 500;
  const margin = 20;
  const axisTextAlignmentFactor = 3;

  // console.log("d3", d3.geoNaturalEarth1);


  const land = topojson.feature(world, world.objects.land);
  const projection = d3.geoNaturalEarth1();
  const path = d3.geoPath(projection);
  const mapString = path(land);

  // https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json
  //console.log(mapString);

  const dataSmallSample = data2.slice(0, 1300);
  const dataSmallSample2 = data.slice(0, 1300);
  // console.log(dataSmallSample2);

  dataSmallSample.map((measurement) => {
    // console.log(measurement);
    return +measurement.TMAX;
  })


  //here is the hard way to find the scale of a data set: find min and max
  //max is the d3 array looper of max in the array
  const maxValueOfTMAX = max(
    dataSmallSample.map((measurement) => {
      return +measurement.TMAX;
    })
  );
  //plus transforms all values into numbers

  const minValueOfTMAX = min(
    dataSmallSample.map((measurement) => {
      return +measurement.TMAX;
    })
  );



  //ok basically, you're storing the d3 function ScaleLinear into something called yScale. This maps entire domain of 
  //your data, to the given range (and you want the range to be your svg window, so it scales to your svg window.)
  //you pass this mapped scale to your x or y parameters. y=yScale(x.TMAX)
  const yScale = scaleLinear()
    .domain([minValueOfTMAX, maxValueOfTMAX]) //mapping min to max
    .range([size, size - 250]); //to this range (the svg window size)





  //for more info goto leacture 4.15 at 45 min and code
  //you can take this range to adjust the axis positions! //4
  //axis text alignment factor takes the 0,100 labels and pushes them up to be level with the tick marsk

  //bin1 = f(r);

  //BINNING 4/22 lecture
  const _bins = bin().thresholds(10); //call bin i guess?
  const tmaxBins = _bins(
    // bin takes an array: aka map of the csv.
    dataSmallSample.map((d) => {

      return +d.elevation;

    })
    //returns a data structure used for histos
  );

  const _bins2 = bin().thresholds(10); //call bin i guess?
  const tmaxBins2 = _bins2(
    // bin takes an array: aka map of the csv.
    dataSmallSample2.map((d) => {

      return +d.elevation;

    })
    //returns a data structure used for histos
  );



  const longBins = bin().thresholds(20); //call bin i guess?
  const aLongBins = longBins(
    // bin takes an array: aka map of the csv.
    dataSmallSample.map((d) => {

      return +d.latitude;

    })
    //returns a data structure used for histos
  );

  const longBins2 = bin().thresholds(20); //call bin i guess?

  const aLongBins2 = longBins2(
    // bin takes an array: aka map of the csv.
    dataSmallSample2.map((d) => {

      return +d.latitude;

    })
    //returns a data structure used for histos
  );

  //here we print out the bins and their indicies
  console.log(aLongBins);
  console.log(aLongBins2);

  // console.log(tmaxBins.map((bin, i) => { console.log(i, bin.x0, bin.x1, bin) }));
  //returns x0, x1 for indicie of first wall of bin and second
  const rightOffset = 100;

  //4.22 lecturea t 59 min he talks about when outliers don't show


  const elevationExtent = [2312.2, .9];
  //console.log(elevationExtent);

  //defining scales for the histograms
  const xScaleElevation = scaleLinear()
    .domain(elevationExtent)
    .range([size, size - 350]);


  const elevationExtent2 = [2183.3, -36];
  /*
    console.log(elevationExtent);
    console.log(elevationExtent2);
  
    console.log(aLongBins);
    console.log(aLongBins2); */
  //defining scales for the histograms
  const xScaleElevation2 = scaleLinear()
    .domain(elevationExtent2)
    .range([size, size - 350]);

  //longitude

  const longitudeExtent = extent(dataSmallSample, (d) => +d.latitude);
  console.log(longitudeExtent);

  //defining scales for the histograms
  const xScaleLong = scaleLinear()
    .domain(longitudeExtent)
    .range([size - 350, size]);


  const longitudeExtent2 = extent(dataSmallSample2, (d) => +d.latitude);
  console.log(longitudeExtent2);

  // console.log(longitudeExtent);
  // console.log(longitudeExtent2);

  // console.log(aLongBins);
  // console.log(aLongBins2);
  //defining scales for the histograms
  const xScaleLong2 = scaleLinear()
    .domain(longitudeExtent2)
    .range([size - 350, size]);



  const maxTempExtent = extent(dataSmallSample2, (d) => +d.TMAX);
  const xScaleTMAX = scaleLinear()
    .domain(longitudeExtent2)
    .range([90, size + 50]);




  return (
    <div>
      <h1>Exploratory Data Analysis, Assignment 2, INFO 474 SP 2021</h1>
      <h2>by Liv Victorino</h2>

      <p>{loading && "Loading data!"}</p>
      <h2>Introduction</h2>
      <p>This assignment uses NOAA's "Daily Weather in 2017" data set. As an EDA exercise, my job was to discover trends and irregularities with the dataset, then draw insights.</p>
      <p>Before beginning the assignment, I asked a few questions of the dataset:</p>
      <ol>
        <li>Where are these weather stations distributed?</li>
        <li>How does the latitude of the weather station impact the max temperature?</li>
        <li>What about the min temperature?</li>
        <li>How does the elevation of the weather station impact the max temperature?</li>
        <li>What about the min temperature?</li>

      </ol>














      <h3> Skewed Weather Station Distribution</h3>
      <p>For performances puroses, I could not use all of the 400,000+ entries in weather.csv. I chose to explore sections of 1300 data points for my analysis. I first had to establish whether my small samples would be evenly distributed geographically. It turns out that the data set is roughly organized by region. The first 1300 points in black cover a belt of the American Southwest, Northeast, and Midwest/Plains. The second in blue cover the Southeast and East Coast of the United States. These regional differences have implications on how I study the data - checks and further exploration to discover trends in each's latitude and elevations are warranted</p>

      <svg width={400} height={300} style={{ border: "1px solid black" }}>
        <path d={mapString} fill="rgb(200, 200, 200)" />
        {dataSmallSample.map((measurement) => {
          return (
            <circle
              transform={`translate(
                ${projection([measurement.longitude, measurement.latitude])})`}
              r="1.5"
            />
          );
        })}
        <text
          x={100}
          textAnchor="end"
          y={30}
          style={{ fontSize: 15, fontFamily: "Gill Sans, sans serif" }}
        >
          FIGURE A
              </text>

      </svg>


      <svg width={400} height={300} style={{ border: "1px solid black" }}>
        <path d={mapString} fill="rgb(200, 200, 200)" />
        {dataSmallSample2.map((measurement) => {
          return (
            <circle
              transform={`translate(
                ${projection([measurement.longitude, measurement.latitude])})`}
              r="1.5"
              fill="blue"
            />
          );
        })}
        <text
          x={100}
          textAnchor="end"
          y={30}
          style={{ fontSize: 15, fontFamily: "Gill Sans, sans serif" }}
        >
          FIGURE B
              </text>
      </svg>
      <p><b>[FIGURE A]</b> A belt of stations from the far Northeast, the Plains, and Southwestern United States make up the first 1300 datapoints .</p>
      <p><b>[FIGURE B]</b> The second 1300 comprise of the Southeastern and East Coast United States. </p>









      <h3>Elevations Are Roughly Similar</h3>
      <p> The regional differences opened further questions about the characteristics of each 1300 portion. My initial question assumes that elevation impacts temperature readings. I used a histogram to compare the elevation distributions, but found that both have roughly similar patterns. They are both skewed right.</p>
      <svg width={size} height={size} style={{ border: "1px solid black" }}>
        {tmaxBins.map((bin, i) => {
          return (
            <svg>

              <rect
                y={size - margin - (bin.length / 2)}
                width="20"
                height={bin.length / 2}
                x={100 + i * 25}
                fill="black"
              />


            </svg>
          );
        })}
        <g transform={`translate(-60, ${size - margin})`} className="axisBottom">
          {/* define our axis here */}
          <Axis
            orient={Orient.bottom}
            scale={xScaleElevation}
          />
        </g>
        <text
          x={margin + 65}
          textAnchor="end"
          y={size - margin + axisTextAlignmentFactor}
          style={{ fontSize: 12, fontFamily: "Gill Sans, sans serif" }}
        >
          Ft of Elevation
              </text>
        <text
          x={100}
          textAnchor="begin"
          y={30}
          style={{ fontSize: 15, fontFamily: "Gill Sans, sans serif" }}
        >
          FIGURE C - FIRST 1300 ELEVATION DISTRIBUTION
              </text>

      </svg>

      <svg width={size} height={size} style={{ border: "1px solid black" }}>
        {tmaxBins2.map((bin, i) => {
          return (
            <rect
              y={size - margin - (bin.length / 2)}
              width="20"
              height={bin.length / 2}
              x={100 + i * 25}
              fill="blue"
            />
          );

        })}
        <g transform={`translate(-60, ${size - margin})`} className="axisBottom">
          {/* define our axis here */}
          <Axis
            orient={Orient.bottom}
            scale={xScaleElevation2}
          />
        </g>
        <text
          x={margin + 65}
          textAnchor="end"
          y={size - margin + axisTextAlignmentFactor}
          style={{ fontSize: 12, fontFamily: "Gill Sans, sans serif" }}
        >
          Ft of Elevation
              </text>
        <text
          x={100}
          textAnchor="begin"
          y={30}
          style={{ fontSize: 15, fontFamily: "Gill Sans, sans serif" }}
        >
          FIGURE D - SECOND 1300 ELEVATION DISTRIBUTION
              </text>

      </svg>

      <p><b>[FIGURE C]</b> Equal proportions of 0-200 to 200-400 ft weather stations exist.</p>
      <p><b>[FIGURE D]</b> The modal bin is from 200-400 ft in elevation. </p>



      <h3>Station Latitude Distribution is Roughly Similar</h3>
      <p>For the same reason as elevation, I wanted to explore the distribution of latitudes between the two datasets. Both exhibit very similar bell curve distributions. Still, though Figure E has a disproportionate amount of stations at the 41st latitude (also the mean latitude), the bellcurve is relatively even on both sides of that mode. For my data analysis, I will chose Figure E's data set (the first 1300).</p>


      <svg width={size} height={size} style={{ border: "1px solid black" }}>
        {aLongBins.map((bin, i) => {
          return (
            <rect
              y={size - 50 - bin.length}
              width="20"
              height={bin.length}
              x={100 + i * 21}
              fill="black"
            />
          );
        })}
        <g transform={`translate(-60, ${size - margin})`} className="axisBottom">
          {/* define our axis here */}
          <Axis
            orient={Orient.bottom}
            scale={xScaleLong}
          />
        </g>
        <text
          x={margin + 65}
          textAnchor="end"
          y={size - margin + axisTextAlignmentFactor}
          style={{ fontSize: 12, fontFamily: "Gill Sans, sans serif" }}
        >
          Latitudes
              </text>
        <text
          x={100}
          textAnchor="begin"
          y={30}
          style={{ fontSize: 15, fontFamily: "Gill Sans, sans serif" }}
        >
          FIGURE E - FIRST 1300 LATITUDE DISTRIBUTION
              </text>

      </svg>

      <svg width={size} height={size} style={{ border: "1px solid black" }}>
        {aLongBins2.map((bin, i) => {
          return (
            <rect
              y={size - 50 - bin.length}
              width="17"
              height={bin.length}
              x={100 + i * 18}
              fill="blue"
            />
          );
        })}
        <g transform={`translate(-50, ${size - margin})`} className="axisBottom">
          {/* define our axis here */}
          <Axis
            orient={Orient.bottom}
            scale={xScaleLong}
          />
        </g>
        <text
          x={margin + 65}
          textAnchor="end"
          y={size - margin + axisTextAlignmentFactor}
          style={{ fontSize: 12, fontFamily: "Gill Sans, sans serif" }}
        >
          Latitudes
              </text>
        <text
          x={100}
          textAnchor="begin"
          y={30}
          style={{ fontSize: 15, fontFamily: "Gill Sans, sans serif" }}
        >
          FIGURE F - SECOND 1300 LATITUDE DISTRIBUTION
              </text>
      </svg>
      <p><b>[FIGURE E]</b> Figure E has a disproportionate number of stations at the 41st latitude. </p>
      <p><b>[FIGURE F]</b> The distribution of Figure F steeply drops off after the 41st latitude</p>



      <h3>Latitudes's Slight Impact on Temperature</h3>
      <p>I chose the first dataset according to the data in figure E, to look at the correlation between temperature and latitude. I hypothesized that latitude would greatly impact max temperature, but over a mere 10 degrees, it's hard to say how causal latitude is to the temperature. Both do indeed show negative correlation - as you move northwards, min and max daily temperature both decrease!</p>
      
      <svg width={size} height={size} style={{ border: "1px solid black" }}>

        {dataSmallSample.map((measurement, index) => {
          return (
            <circle
              key={index}
              cx={measurement.latitude * 10}
              cy={size - margin - 60 - measurement.TMAX * 3}
              r="3"
              fill="none"
              stroke={"green"}
              strokeOpacity=".9"
            />
          );
        })}
        <g transform={`translate(-60, ${size - margin})`} className="axisBottom">
          {/* define our axis here */}
          <Axis
            orient={Orient.bottom}
            scale={xScaleTMAX}
          />
        </g>
        <text
          x={100}
          textAnchor="begin"
          y={30}
          style={{ fontSize: 15, fontFamily: "Gill Sans, sans serif" }}
        >
          FIGURE G - MAXIMUM DAILY TEMPERATURE
              </text>
      </svg>

      <svg width={size} height={size} style={{ border: "1px solid black" }}>

        {dataSmallSample.map((measurement, index) => {
          return (
            <circle
              key={index}
              cx={measurement.latitude * 10}
              cy={size - margin - 60 - measurement.TMIN * 3}
              r="3"
              fill="none"
              stroke={"green"}
              strokeOpacity=".9"
            />
          );
        })}
        <g transform={`translate(-60, ${size - margin})`} className="axisBottom">
          {/* define our axis here */}
          <Axis
            orient={Orient.bottom}
            scale={xScaleTMAX}
          />
        </g>
        <text
          x={100}
          textAnchor="begin"
          y={30}
          style={{ fontSize: 15, fontFamily: "Gill Sans, sans serif" }}
        >
          FIGURE H - MINIMUM DAILY TEMPERATURE
              </text>
      </svg>

      <p><b>[FIGURE G]</b> The downward trend of the data indicates is a messy correlation between latitude and temperature.  </p>
      <p><b>[FIGURE H]</b> The minimum temperature seems to be tied closer to latitude than max temperature based on it's steeper downward trend</p>

















      <h3> Elevation's Slight Impact on Temperature </h3>

      <p>I selected the first data set to analyze elevation's impact on min and max daily temperature. Elevations above 1000ft are green, between 1000-500 in blue, below 500 in red. It's evident that elevation at higher levels tends to exhibit slightly lower temperatures, especially looking at min daily temp. The red reaches closer to and above 100 degrees, compared to blue and green.</p>
      <svg width={size} height={size} style={{ border: "1px solid black" }}>



        <text
          x={margin + 100 - 12}
          textAnchor="end"
          y={size - margin + axisTextAlignmentFactor}
          style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
        >
          0
              </text>




        {dataSmallSample.map((measurement, index) => {
          const hun = measurement.TMAX === "100.94";
          const elev = measurement.elevation === "1809.3";
          return (

            <svg>
              <line
                x1={margin + 100 - 10}
                y1={yScale(measurement.TMAX)}
                x2={margin + 100 - 5}
                y2={yScale(measurement.TMAX)}
                stroke={"black"}
                strokeOpacity={hun ? 1 : 0.0}
              />

              <text
                x={margin + 100 - 12}
                textAnchor="end"
                y={yScale(measurement.TMAX) - axisTextAlignmentFactor}
                style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
                opacity={hun ? 1 : 0.0}
              >
                100
              </text>
            </svg>
          );
        })}


        {dataSmallSample.map((measurement, index) => {
          const hun = measurement.elevation === "1809.3";
          const ele = measurement.TMAX === "50"
          return (

            <svg>
              <line
                x1={margin + 100 - 10}
                y1={yScale(measurement.TMAX)}
                x2={margin + 100 - 5}
                y2={yScale(measurement.TMAX)}
                stroke={"black"}
                strokeOpacity={ele ? 1 : 0.0}
              />

              <text
                x={margin + 100 - 12}
                textAnchor="end"
                y={yScale(measurement.TMAX) - axisTextAlignmentFactor}
                style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
                opacity={ele ? 1 : 0.0}
              >
                50
              </text>
            </svg>
          );
        })}








        {dataSmallSample.map((measurement, index) => {

          const highlight = measurement.elevation >= 1000;
          return (
            <line
              key={index}
              x1={margin + 100}
              y1={yScale(measurement.TMAX)}
              x2={margin + 100 + 20}
              y2={yScale(measurement.TMAX)}
              stroke={highlight ? "green" : "steelblue"}
              strokeOpacity={highlight ? 1 : 0}
            />
          );
        })}

        {dataSmallSample.map((measurement, index) => {

          const highlight = measurement.elevation <= 1000 && measurement.elevation >= 500;
          return (
            <line
              key={index}
              x1={margin + 100 + rightOffset}
              y1={yScale(measurement.TMAX)}
              x2={margin + 100 + 20 + rightOffset}
              y2={yScale(measurement.TMAX)}
              stroke={highlight ? "blue" : "steelblue"}
              strokeOpacity={highlight ? 1 : 0}
            />
          );
        })}


        {dataSmallSample.map((measurement, index) => {

          const highlight = measurement.elevation <= 500;
          return (
            <line
              key={index}
              x1={margin + 100 + rightOffset * 2}
              y1={yScale(measurement.TMAX)}
              x2={margin + 100 + 20 + rightOffset * 2}
              y2={yScale(measurement.TMAX)}
              stroke={highlight ? "red" : "steelblue"}
              strokeOpacity={highlight ? 1 : 0}
            />
          );
        })}


        <text
          x={margin + 330 - 12}
          textAnchor="end"
          y={230}
          style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
        >
          below 500
              </text>


        <text
          x={margin + 230 - 12}
          textAnchor="end"
          y={230}
          style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
        >
          1000-500
              </text>


        <text
          x={margin + 130 - 12}
          textAnchor="end"
          y={230}
          style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
        >
          above 1000
              </text>
              <text
          x={100}
          textAnchor="begin"
          y={30}
          style={{ fontSize: 15, fontFamily: "Gill Sans, sans serif" }}
        >
          FIGURE J - MAXIMUM DAILY TEMPERATURE
              </text>
      </svg>











      <svg width={size} height={size} style={{ border: "1px solid black" }}>



        <text
          x={margin + 100 - 12}
          textAnchor="end"
          y={size - margin + axisTextAlignmentFactor}
          style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
        >
          0
              </text>




        {dataSmallSample.map((measurement, index) => {
          const hun = measurement.TMAX === "100.94";
          const elev = measurement.elevation === "1809.3";
          return (

            <svg>
              <line
                x1={margin + 100 - 10}
                y1={yScale(measurement.TMAX)}
                x2={margin + 100 - 5}
                y2={yScale(measurement.TMAX)}
                stroke={"black"}
                strokeOpacity={hun ? 1 : 0.0}
              />

              <text
                x={margin + 100 - 12}
                textAnchor="end"
                y={yScale(measurement.TMAX) - axisTextAlignmentFactor}
                style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
                opacity={hun ? 1 : 0.0}
              >
                100
              </text>
            </svg>
          );
        })}


        {dataSmallSample.map((measurement, index) => {
          const hun = measurement.elevation === "1809.3";
          const ele = measurement.TMAX === "50"
          return (

            <svg>
              <line
                x1={margin + 100 - 10}
                y1={yScale(measurement.TMAX)}
                x2={margin + 100 - 5}
                y2={yScale(measurement.TMAX)}
                stroke={"black"}
                strokeOpacity={ele ? 1 : 0.0}
              />

              <text
                x={margin + 100 - 12}
                textAnchor="end"
                y={yScale(measurement.TMAX) - axisTextAlignmentFactor}
                style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
                opacity={ele ? 1 : 0.0}
              >
                50
              </text>


            </svg>
          );
        })}










        {dataSmallSample.map((measurement, index) => {

          const highlight = measurement.elevation >= 1000;
          return (
            <line
              key={index}
              x1={margin + 100}
              y1={yScale(measurement.TMIN)}
              x2={margin + 100 + 20}
              y2={yScale(measurement.TMIN)}
              stroke={highlight ? "green" : "steelblue"}
              strokeOpacity={highlight ? 1 : 0}
            />
          );
        })}

        {dataSmallSample.map((measurement, index) => {

          const highlight = measurement.elevation <= 1000 && measurement.elevation >= 500;
          return (
            <line
              key={index}
              x1={margin + 100 + rightOffset}
              y1={yScale(measurement.TMIN)}
              x2={margin + 100 + 20 + rightOffset}
              y2={yScale(measurement.TMIN)}
              stroke={highlight ? "blue" : "steelblue"}
              strokeOpacity={highlight ? 1 : 0}
            />
          );
        })}


        {dataSmallSample.map((measurement, index) => {

          const highlight = measurement.elevation <= 500;
          return (
            <line
              key={index}
              x1={margin + 100 + rightOffset * 2}
              y1={yScale(measurement.TMIN)}
              x2={margin + 100 + 20 + rightOffset * 2}
              y2={yScale(measurement.TMIN)}
              stroke={highlight ? "red" : "steelblue"}
              strokeOpacity={highlight ? 1 : 0}
            />
          );
        })}

        <text
          x={margin + 330 - 12}
          textAnchor="end"
          y={230}
          style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
        >
          below 500
              </text>


        <text
          x={margin + 230 - 12}
          textAnchor="end"
          y={230}
          style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
        >
          1000-500
              </text>


        <text
          x={margin + 130 - 12}
          textAnchor="end"
          y={230}
          style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
        >
          above 1000
              </text>

              <text
          x={100}
          textAnchor="begin"
          y={30}
          style={{ fontSize: 15, fontFamily: "Gill Sans, sans serif" }}
        >
          FIGURE J - MINIMUM DAILY TEMPERATURE
              </text>
      </svg>

      <p><b>[FIGURE I]</b> Stations below 500ft in elevation extend a broader range of temperatures, including hotter ones as the max temperature </p>
      <p><b>[FIGURE J]</b> Minimum temperature displays how stations below 500 ft in elevation have the same mean temperature, but extend further to the warmer temperatures</p>





    </div>
  );
};


export default App;