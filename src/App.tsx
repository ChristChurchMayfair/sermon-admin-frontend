import React, { Component } from 'react';
import './App.css';
import SermonList from './SermonList';
import CreateSermon from './CreateSermon';
import { Link, Route, BrowserRouter as Router } from 'react-router-dom';
import SeriesList from './components/SeriesList';
import GithubLogin from './components/GithubLogin';
import axios from 'axios';
import GithubUserInfo from './components/GithubUserInfo';


var sermon_api_base = "http://localhost:4000"
if (process.env.REACT_APP_SERMON_API_BASE) {
  sermon_api_base = process.env.REACT_APP_SERMON_API_BASE
}

var githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID

const sermonAPIURL = sermon_api_base + "/sermons";
const seriesAPIURL = sermon_api_base + "/series";
const speakersAPIURL = sermon_api_base + "/speakers";
const eventsAPIURL = sermon_api_base + "/events";
const uploadAPIURL = sermon_api_base + "/uploadurl";
const completeGithubLoginURL = sermon_api_base + "/githublogin";

const onClose = () => console.log("closed!");

type Props = {}
type State = {
  githubToken?: string
  badGithubState: boolean
}

type GithubLoginRequest = {
  code: string
  state: string
}

class App extends Component<Props,State> {

  constructor(props:Props) {
    super(props)
    this.getGithubToken = this.getGithubToken.bind(this)
    this.onCode = this.onCode.bind(this)
    this.state = {badGithubState:false}
  }

  onCode(code: string, stateMatched: boolean, state: string) {
    console.log("wooooo a code", code);
    console.log("State was good:", stateMatched);
    if (stateMatched) {

      const login: GithubLoginRequest = {
        code: code,
        state: state
      }

      axios.post(completeGithubLoginURL, login)
      .then(result => {
        this.setState({githubToken: result.data.access_token})
        console.log("Got token:", this.state.githubToken)
      }).catch(error => {
        console.log("Problem getting token:",error)
      })
    } else {
      this.setState({badGithubState: true})
    }
  }

  getGithubToken() {
    return this.state.githubToken
  }

  render() {
    return (
      <Router>
      <div className="App">
        <header className="App-header">
        <img id="ccm-logo" src="/assets/ccm-logo-full.svg"></img>
        <div className="menu">
        <Link to="/">Sermons</Link>
        <Link to="/create">Upload</Link>
        <Link to="/series">Series</Link>
        <Link to="/events">Speakers</Link>
        <Link to="/events">Events</Link>
        </div>
        <div className="github login"><GithubLogin onCode={this.onCode} onClose={onClose} height={500} width={500} client_id={githubClientId} allow_signup={false} scope="user,read:org"></GithubLogin></div>
        </header>
        <div className="github state"><GithubUserInfo githubToken={this.getGithubToken}></GithubUserInfo></div>
        <main>
            <Route path="/" exact={true} component={() => <SermonList sermonAPIURL={sermonAPIURL}></SermonList>}  />
            <Route path="/series" exact={true} component={() => <SeriesList seriesAPIURL={seriesAPIURL}></SeriesList>}  />
            <Route path="/create" exact={true} component={() => <CreateSermon getGithubToken={this.getGithubToken} sermonAPIURL={sermonAPIURL} seriesAPIURI={seriesAPIURL} speakersAPIURI={speakersAPIURL} eventsAPIURL={eventsAPIURL} sermonUploadUrlAPIURL={uploadAPIURL}></CreateSermon>}  />
        </main>
        <footer>
          <div>The code for this app lives in the <a href="https://github.com/ChristChurchMayfair">CCM Github Organisation</a>.</div>
          <div>If you are having problems or want to offer feedback contact <a href="mailto:tom@christchurchmayfair.org">Tom Duckering</a>.</div>
        </footer>
      </div>
      </Router>
    );
  }
}

export default App;
