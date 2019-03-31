import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SermonList from './SermonList';
import CreateSermon from './CreateSermon';
import { Link, Route, BrowserRouter as Router } from 'react-router-dom';
import SeriesList from './components/SeriesList';

var sermon_api_base = "http://localhost:4000"
if (process.env.REACT_APP_SERMON_API_BASE) {
  sermon_api_base = process.env.REACT_APP_SERMON_API_BASE
}

const sermonAPIURL = sermon_api_base + "/sermons";
const seriesAPIURL = sermon_api_base + "/series";
const speakersAPIURL = sermon_api_base + "/speakers";
const eventsAPIURL = sermon_api_base + "/events";
const uploadAPIURL = sermon_api_base + "/uploadurl";

class App extends Component {
  render() {
    return (
      <Router>
      <div className="App">
        <header className="App-header">
        <Link to="/">Home</Link>
        <Link to="/create">Upload a Sermon</Link>
        <Link to="/series">Show Series List</Link>
        </header>
        <main>
          
            <Route path="/" exact={true} component={() => <SermonList sermonAPIURL={sermonAPIURL}></SermonList>}  />
            <Route path="/series" exact={true} component={() => <SeriesList sermonAPIURL={sermonAPIURL}></SeriesList>}  />
            <Route path="/create" exact={true} component={() => <CreateSermon sermonAPIURL={sermonAPIURL} seriesAPIURI={seriesAPIURL} speakersAPIURI={speakersAPIURL} eventsAPIURL={eventsAPIURL} sermonUploadUrlAPIURL={uploadAPIURL}></CreateSermon>}  />
          
        </main>
      </div>
      </Router>
    );
  }
}

export default App;
