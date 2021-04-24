import React from "react";

const viewHeight = 500;
const viewWidth = 500;

//1. push csv to github
//2. use fetch api to use it in your app
//3. make sure data is in your root, push it to your repository, select it raw, copy githubcontent link.

const App = () => {
    fetch("https://raw.githubusercontent.com/ovictori/redo1/main/weather.csv")
    .then(response => response.json())
    .then((data) => console.log(data))
    return (
        <div>
            <h1>Exploratory data analysis Assignment 2, 474</h1>
>        </div>
    );
    
};

export default App;