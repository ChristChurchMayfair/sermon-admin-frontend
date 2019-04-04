import React, { Component } from 'react';
import './App.css';
import SermonList from './SermonList';
import CreateSermon from './CreateSermon';
import { Link, Route, BrowserRouter as Router } from 'react-router-dom';
import SeriesList from './components/SeriesList';
import GithubLogin from './components/GithubLogin';
import GithubLoginCallBack from './components/GithubLoginCallBack';
import { checkPropTypes } from 'prop-types';
import axios from 'axios';
import { timingSafeEqual } from 'crypto';
import GithubUserInfo from './components/GithubUserInfo';


var sermon_api_base = "http://localhost:4000"
if (process.env.REACT_APP_SERMON_API_BASE) {
  sermon_api_base = process.env.REACT_APP_SERMON_API_BASE
}

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
        <GithubUserInfo githubToken={this.getGithubToken}></GithubUserInfo>
        <Link to="/">Home</Link>
        <Link to="/create">Upload a Sermon</Link>
        <Link to="/series">Show Series List</Link>
        <GithubLogin onCode={this.onCode} onClose={onClose} height={500} width={500} client_id="13781417cd1a751db388" allow_signup={false} scope="user,read:org"></GithubLogin>
        </header>
        <main>
          
            <Route path="/" exact={true} component={() => <SermonList sermonAPIURL={sermonAPIURL}></SermonList>}  />
            <Route path="/series" exact={true} component={() => <SeriesList sermonAPIURL={sermonAPIURL}></SeriesList>}  />
            <Route path="/create" exact={true} component={() => <CreateSermon getGithubToken={this.getGithubToken} sermonAPIURL={sermonAPIURL} seriesAPIURI={seriesAPIURL} speakersAPIURI={speakersAPIURL} eventsAPIURL={eventsAPIURL} sermonUploadUrlAPIURL={uploadAPIURL}></CreateSermon>}  />
        </main>
      </div>
      </Router>
    );
  }
}

export default App;
