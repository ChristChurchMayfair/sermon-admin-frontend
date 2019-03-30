import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SermonList from './SermonList';
import CreateSermon from './CreateSermon';
import { Link, Route, BrowserRouter as Router } from 'react-router-dom';
import SeriesList from './components/SeriesList';

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
          
            <Route path="/" exact={true} component={() => <SermonList sermonAPIURL="http://localhost:4000/sermons"></SermonList>}  />
            <Route path="/series" exact={true} component={() => <SeriesList sermonAPIURL="http://localhost:4000/series"></SeriesList>}  />
            <Route path="/create" exact={true} component={() => <CreateSermon sermonAPIURL="http://localhost:4000/sermons" seriesAPIURI="http://localhost:4000/series" speakersAPIURI="http://localhost:4000/speakers" eventsAPIURL="http://localhost:4000/events" sermonUploadUrlAPIURL="http://localhost:4000/uploadurl"></CreateSermon>}  />
          
        </main>
      </div>
      </Router>
    );
  }
}

export default App;
