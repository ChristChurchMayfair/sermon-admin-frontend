import React, { Component } from "react";
import {parse} from 'query-string';

type Props = {
    height: number
    width: number
    onCode: (code: string, stateMatched: boolean, state: string) => any
    onClose: () => any
    client_id?: string
    allow_signup: false
    scope: string
}
type State = {
    popup?: Window
    codeCheck?: any
    url?: string
    randomState: string
}

class GithubLogin extends Component<Props,State> {
    constructor(props:Props) {
        super(props)
        this.openPopup = this.openPopup.bind(this)
        const random_thing = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        this.state = {randomState: random_thing, url: `https://github.com/login/oauth/authorize?client_id=${this.props.client_id}&scope=${this.props.scope}&state=${random_thing}&allow_signup=${this.props.allow_signup}`}
    }

    openPopup() {
        const {width, height} = this.props
        console.log("Clicked Login")
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2.5;
        const popup: Window = window.open(this.state.url, 'SomeAuthentication', `width=${width},height=${height},left=${left},top=${top},modal=yes,alwaysRaised=yes`)!
        

        const codeCheck = setInterval(() => {
            try {
            
              const params = popup.location.search
              const parsedQuery = parse(params)
              const code = parsedQuery['code']
              var codeValue: string | null = null
              if (typeof code === "string") {
                codeValue = code
              }
              if (!codeValue) {
                return;
              }

              const state = parsedQuery['state']
              var stateValue: string | null = null
              if (typeof state === "string") {
                stateValue = state
              }

              clearInterval(codeCheck);
              this.props.onCode(codeValue, stateValue === this.state.randomState, this.state.randomState);
              popup.close();
            } catch (e) { }
          }, 20);


    }

    render() {
        return(
            <div>
            <a href="#" onClick={this.openPopup}>
            Login
            </a>
            </div>
        )
    }

}

export default GithubLogin;