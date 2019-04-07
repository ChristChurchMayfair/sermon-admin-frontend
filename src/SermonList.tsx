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
    error: boolean
}

class SermonList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {sermons: [], loading: true, error: false}
    }

    componentDidMount() {
    axios.get(this.props.sermonAPIURL)
      .then(res => {
        const sermons = res.data;
        this.setState({ sermons: sermons, loading: false });
      }).catch(error => {
        this.setState({error: true})
      })
    }

    render() {

        const sermonRender = this.state.sermons.map(sermon =>
            <SermonView key={sermon.id} sermon={sermon}/>
            )
        
        if (this.state.error) {
            return(<div>Error Loading Sermons</div>)
        }
        
        if (this.state.loading) {
            return(<div>Loading Sermons</div>)
        }

        return(
            <div className="SermonList">
                {sermonRender}
            </div>
        )
    }
}

export default SermonList;