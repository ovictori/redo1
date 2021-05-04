import React from "react";
//import { csv } from "d3-fetch";
import { useFetch } from "./hooks/useFetch";
import { scaleLinear } from "d3-scale";
import { extent, max, min, bin } from "d3-array";
import { geoNaturalEarth1 } from "d3-geo-projection"
import * as topojson from "topojson-client"
import world from "../land-50m"
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
//  console.log("from hook ", loading, data);
  /* this is from April 15th lecture
  csv("https://raw.githubusercontent.com/ovictori/redo1/main/weather.csv")
  .then((data) => console.log(data))
 */
  const size = 500;
  const margin = 20;
  const axisTextAlignmentFactor = 3;

  console.log("d3", d3.geoNaturalEarth1);


  const land = topojson.feature(world, world.objects.land);
  const projection = d3.geoNaturalEarth1();
  const path = d3.geoPath(projection);
  const mapString = path(land);
 
  https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json
  console.log(mapString);

  const dataSmallSample = data.slice(0, 300);
  dataSmallSample.map((measurement) => {
   // console.log(measurement);
    return +measurement.TMAX;
  })
  const maxofTMAX = max([1, 2, 3]);
 // console.log(dataSmallSample);

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

 // console.log(minValueOfTMAX);
  //here is the way with EXTENT
  /*
      extent(dataSmallSample, (measurement) = {
          return measurement.TMAX;
      }); */

  const elevationExtent = extent(
    dataSmallSample.map((measurement) => {
      return +measurement.elevation;
    }))

  //ok basically, you're storing the d3 function ScaleLinear into something called yScale. This maps entire domain of 
  //your data, to the given range (and you want the range to be your svg window, so it scales to your svg window.)
  //you pass this mapped scale to your x or y parameters. y=yScale(x.TMAX)
  const yScale = scaleLinear()
    .domain([minValueOfTMAX, maxValueOfTMAX]) //mapping min to max
    .range([size, size - 250]); //to this range (the svg window size)



  const yScaleElevation = scaleLinear()
    .domain(elevationExtent)
    .range([size, size - 250]);


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



  const longBins = bin().thresholds(112); //call bin i guess?
  const aLongBins = longBins(
    // bin takes an array: aka map of the csv.
    dataSmallSample.map((d) => {

      return +d.longitude;

    })
    //returns a data structure used for histos
  );



  //here we print out the bins and their indicies
  //console.log(tmaxBins);
  console.log(tmaxBins.map((bin, i) => { console.log(i, bin.x0, bin.x1, bin) }));
  //returns x0, x1 for indicie of first wall of bin and second
  const rightOffset = 100;

  //4.22 lecturea t 59 min he talks about when outliers don't show
















  return (
    <div>
      <h1>Exploratory Data Analysis, Assignment 2, INFO 474 SP 2021</h1>
      <p>{loading && "Loading data!"}</p>















      <h3> How does geo data impact </h3>
      <h3> Working with geo data </h3>
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
      </svg>



      <svg width={400} height={300} style={{ border: "1px solid black" }}>
        <path d={mapString} fill="rgb(200, 200, 200)" />
        {dataSmallSample.map((measurement) => {
          return (
            <circle
              transform={`translate(
                ${projection([measurement.longitude, measurement.latitude])})`}
              r="1.5"
              fill="pink"
            />
          );
        })}
      </svg>














      <h3>are elevations normally distributed?</h3>
            <svg width={size} height={size} style={{ border: "1px solid black" }}>
            {tmaxBins.map((bin, i) => { 
              return(
              <rect 
              y={size - 50 - bin.length} 
              width="15" 
              height={bin.length}
              x={100 + i * 18}
              fill="red"
                />
              );
            })}
            </svg>



            <h3>are longitudes normally distributed?</h3>
            <svg width={size} height={size} style={{ border: "1px solid black" }}>
            {aLongBins.map((bin, i) => { 
              return(
              <rect 
              y={size - 50 - bin.length} 
              width="5" 
              height={bin.length}
              x={100 + i * 6}
              fill="red"
                />
              );
            })}
            </svg>







      <h3>Scatterplot</h3>

      <svg width={size} height={size} style={{ border: "1px solid black" }}>

        {dataSmallSample.map((measurement, index) => {
          const highlight = measurement.station === "KALISPELL GLACIER AP";
          return (
            <circle
              key={index}
              cx={100 - (measurement.longitude) * 8 - 650}
              cy={size - margin - measurement.TMIN * 3}
              r="3"
              fill="none"
              stroke={highlight ? "red" : "green"}
              strokeOpacity=".9"
            />
          );
        })}
      </svg>

      <svg width={size} height={size} style={{ border: "1px solid black" }}>

        {dataSmallSample.map((measurement, index) => {
          const highlight = measurement.station === "KALISPELL GLACIER AP";
          return (
            <circle
              key={index}
              cx={100 - (measurement.longitude) * 8 - 650}
              cy={size - margin - measurement.TMAX * 3}
              r="3"
              fill="none"
              stroke={highlight ? "red" : "green"}
              strokeOpacity=".9"
            />
          );
        })}
      </svg>




















      <h3> How does elevation impact </h3>
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
            x1={margin + 100 + rightOffset*2}
            y1={yScale(measurement.TMAX)}
            x2={margin + 100 + 20 + rightOffset*2}
            y2={yScale(measurement.TMAX)}
            stroke={highlight ? "red" : "steelblue"}
            strokeOpacity={highlight ? 1 : 0}
          />
        );
        })}


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
            x1={margin + 100 + rightOffset*2}
            y1={yScale(measurement.TMIN)}
            x2={margin + 100 + 20 + rightOffset*2}
            y2={yScale(measurement.TMIN)}
            stroke={highlight ? "red" : "steelblue"}
            strokeOpacity={highlight ? 1 : 0}
          />
        );
        })}


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


          const hun = measurement.TMAX === "100.04";
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


          const hun1 = measurement.TMAX === "50";
          return (
            <svg>
              <line
                x1={margin + 100 - 10}
                y1={yScale(measurement.TMAX)}
                x2={margin + 100 - 5}
                y2={yScale(measurement.TMAX)}
                stroke={"black"}
                strokeOpacity={hun1 ? 1 : 0.0}
              />

              <text
                //scale
                x={margin + 100 - 12}
                textAnchor="end"
                y={yScale(measurement.TMAX) - axisTextAlignmentFactor}
                style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
                opacity={hun1 ? 1 : 0.0}
              >
                50
              </text>
            </svg>
          );
        })}


        {data.slice(0, 1000).map((measurement, index) => {


          const highlight = measurement.station === "500";
          return (
            <line
              key={index}
              x1={margin + 100}
              y1={yScale(measurement.TMAX)}
              x2={margin + 100 + 20}
              y2={yScale(measurement.TMAX)}
              stroke={highlight ? "red" : "steelblue"}
              strokeOpacity={highlight ? 1 : 0.1}
            />
          );
        })}
      </svg>

    </div>
  );
};


export default App;