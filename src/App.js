import './App.css';
import React from 'react';
//import gapi from ''

// Client ID and API key from the Developer Console
var CLIENT_ID = '480305113859-vnq89kvr7gc6dpjnu7tlooi78p3uqn1h.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCPdVPm6hpofGUXPwruA2XtuRnit1XOSb8';
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
 // included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
//TODO:
//https://www.npmjs.com/package/react-google-calendar-api


function initClient(signinButton, signoutButton, onGetCalendars) {
  window.gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    window.gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedin) => updateSigninStatus(isSignedin, signinButton, signoutButton, onGetCalendars));

    // Handle the initial sign-in state.
    updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get(), signinButton, signoutButton, onGetCalendars);
    signinButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    console.log(`Error : ${error}`)
  });
}

function handleSignoutClick(event) {
  window.gapi.auth2.getAuthInstance().signOut();
}


function handleAuthClick(event) {
  window.gapi.auth2.getAuthInstance().signIn();
}

function updateSigninStatus(isSignedIn, signinButton, signoutButton,onGetCalendars) {
  if (isSignedIn) {
    signinButton.style.display = 'none';
    signoutButton.style.display = 'block';
    console.log('updateSigninStatus: isSignedIn');
    window.gapi.client.calendar.calendarList.list({}).then(onGetCalendars, (err)=>{ console.log(`Error occured when retrieving calendar list :\n ${err}`)});
  } else {
    signinButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}


function GCalendarList({calendars}){
  console.log('component GCalendarList rendered');
  console.log(calendars);
  return (<div>
    {calendars ? 
      calendars.map((item) => {
            return <div key={item.id}>{item.summaryOverride ? item.summaryOverride : item.summary}</div>
          }) : 
      <div>Loading the calendars...</div>
    }
  </div>);
}



function App() {

  console.log('App rerendered');
  
  const [calendars, setCalendars] = React.useState();

  var googleSigningButton = React.useRef();
  var googleSignoutButton = React.useRef();

  React.useEffect(()=>{
    console.log('App - useEffect is called');
    const googleApiScript = document.createElement('script');
    googleApiScript.src='https://apis.google.com/js/api.js';
    googleApiScript.async = true;
    googleApiScript.defer = true;
    window.document.body.appendChild(googleApiScript);
    googleApiScript.addEventListener('load', () => {
      window.gapi.load('client:auth2', () => initClient(googleSigningButton.current, googleSignoutButton.current,(response)=>{
        console.log(response.result);
        setCalendars(response.result.items);
      }));
    });
  },[]);



  return (
    <div className="App">
        <button id="signin" ref={googleSigningButton} > signin</button>
        <button id="signout" ref={googleSignoutButton} > signout</button>
        <GCalendarList calendars={calendars}></GCalendarList>
    </div>
  );
}

export default App;
