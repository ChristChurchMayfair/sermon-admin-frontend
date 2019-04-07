import React, { Component } from "react";
import axios, {AxiosRequestConfig} from 'axios';

type Props = {
    githubToken: () => string | undefined
}
type State = {
    user?: any
    canUpload?: boolean
}

class GithubUserInfo extends Component<Props,State> {

    constructor(props:Props) {
        super(props)
        this.state = {}
    }


    componentWillUpdate() {
        const token = this.props.githubToken()

        if (token && !this.state.user) {

            const config: AxiosRequestConfig = {
                headers : {
                    "Authorization": `token ${token}`
                }
            }
            axios.get("https://api.github.com/user", config)
            .then(response => {
                this.setState({user: response.data})
            }).catch(error => {
                console.log(error)
            })
        }

        if (token && this.state.user && this.state.canUpload == null) {
            const organisation = "ChristChurchMayfair"
            const config: AxiosRequestConfig = {
                headers : {
                    "Authorization": `token ${token}`
                }
            }
            axios.get(`https://api.github.com/orgs/${organisation}/members/${this.state.user.login}`, config)
            .then(response => {
                console.log(response.status)
                this.setState({canUpload: (response.status === 204)})
            }).catch(error => {
                console.log("in failed")
                console.log(error)
                this.setState({canUpload: false})
            })
        }
    }


    render(){

        var canUpload = "unknown"
        if (this.state.canUpload == false) {
            canUpload = "No"
        } else if (this.state.canUpload == true) {
            canUpload = "Yes"
        }

        if (this.state.user) {
            return(
                <div>
                    <div>{this.state.user && this.state.user.login || "not logged in"}</div>
                    <div>Can Upload? {canUpload}</div>
                </div>
            )
        } else {
            return(<div></div>);
        }
    }

}

export default GithubUserInfo