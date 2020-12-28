import './App.css';
import React from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import M from "materialize-css";


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
  }, function (error) {
    console.log(`Error : ${error}`)
  });
}

function handleSignoutClick(event) {
  window.gapi.auth2.getAuthInstance().signOut();
}


function handleAuthClick(event) {
  window.gapi.auth2.getAuthInstance().signIn();
}

function updateSigninStatus(isSignedIn, signinButton, signoutButton, onGetCalendars) {
  console.log(`isSignedIn : ${isSignedIn}`);

  if (isSignedIn) {
    signinButton.style.display = 'none';
    signoutButton.style.display = 'inline-block';
    console.log('updateSigninStatus: isSignedIn');
    window.gapi.client.calendar.calendarList.list({}).then(onGetCalendars, (err) => { console.log(`Error occured when retrieving calendar list :\n ${err}`) });
  } else {
    signinButton.style.display = 'inline-block';
    signoutButton.style.display = 'none';
    onGetCalendars({result: {list: null}})
  }
}

const Events = ({eventId}) => {
  return (<div>Showing events for {eventId}</div>);
}


function GCalendarList({ calendars }) {
  console.log('component GCalendarList rendered');
  console.log(calendars);
  return (<div>
    <div>
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">Calendars</span>
          {(calendars && calendars.length > 0) ?
              <ul class="collapsible">
              {
              calendars.map((item) => {
                      return <li key={item.id}>
                          <div class="collapsible-header black-text">{item.summaryOverride ? item.summaryOverride : item.summary}</div>
                          <div class="collapsible-body">
                            <Events eventId={item.id}></Events>
                          </div>
                        </li>
                    })
                    }
              </ul>
       :
      <div>Please signin to display calendars</div>
    }
        </div>
      </div>
    </div>
    
  </div>);
}

function EventList() {
  //get the calender id saved in local store.
  //load the re

  return (<div>

  </div>);
}

const Navigation = ({ signinButton, signoutButton }) => {
  return (
    <nav>
      <div class="nav-wrapper orange darken-4">
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li>
            {/* eslint-disable-next-line*/}
            <a id="signin" ref={signinButton} className="waves-effect waves-light btn">Sign in</a>
          </li>
          <li>
            {/* eslint-disable-next-line*/}
            <a id="signout" ref={signoutButton} className="waves-effect waves-light btn">Sign out</a>

          </li>
        </ul>
      </div>
    </nav>
  );
}

function App() {

  console.log('App rerendered');

  const [calendars, setCalendars] = React.useState();

  var googleSigningButton = React.useRef();
  var googleSignoutButton = React.useRef();

  React.useEffect(() => {
    M.AutoInit();
    console.log('App - useEffect is called');
    const googleApiScript = document.createElement('script');
    googleApiScript.src = 'https://apis.google.com/js/api.js';
    googleApiScript.async = true;
    googleApiScript.defer = true;
    window.document.body.appendChild(googleApiScript);
    googleApiScript.addEventListener('load', () => {
      window.gapi.load('client:auth2', () => initClient(googleSigningButton.current, googleSignoutButton.current, (response) => {
        console.log(response.result);
        setCalendars(response.result.items || []);
      }));
    });
  }, []);

  //eslint-disable-next-line
  return (
    <div>
      <Navigation signinButton={googleSigningButton} signoutButton={googleSignoutButton}></Navigation>
      <div className="container">
        <div class="row">
          <div class="col s12 m6">
            <GCalendarList calendars={calendars}></GCalendarList>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
