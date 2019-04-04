import React, { Component } from "react";
import { withRouter, RouteComponentProps } from 'react-router-dom';

type Props = {
}
type State = {
}


class GithubLoginCallBack extends Component<RouteComponentProps<Props>,State> {
    constructor(props:RouteComponentProps<Props>) {
        super(props)
    }



    render() {
        return(
            <div>
            {this.props.location.search}
            </div>
        )
    }

}

export default withRouter(GithubLoginCallBack)