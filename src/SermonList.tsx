import React, {Component} from 'react';
import axios from 'axios';
import SermonView from './Sermon';
import {Sermon} from './SermonType';
import './SermonList.css';

type Props = {
    sermonAPIURL: string
};
type State = {
    sermons: Sermon[]
    loading: boolean
}

class SermonList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {sermons: [], loading: true}
    }

    componentDidMount() {
    axios.get(this.props.sermonAPIURL)
      .then(res => {
        const sermons = res.data;
        this.setState({ sermons: sermons, loading: false });
      })
    }

    render() {

        const sermonRender = this.state.sermons.map(sermon =>
            <SermonView sermon={sermon}/>
            )

        if (this.state.loading) {
            return(<div>LOADING</div>)
        }

        return(
            <div className="SermonList">
                {sermonRender}
            </div>
        )
    }
}

export default SermonList;