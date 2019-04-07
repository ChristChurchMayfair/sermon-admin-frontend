import React, {Component} from 'react';
import {Sermon, Speaker} from './SermonType';

type Props = {
    sermon: Sermon;
};
type State = {}

class SermonView extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return(
            <div className="sermon">
                <div>{this.props.sermon.name}</div>
                <div>{this.props.sermon.passage}</div>
                <div>{this.props.sermon.speakers[0].name}</div>
                <div>{this.props.sermon.event.name}</div>
                <div>{this.props.sermon.series.name}</div>
                <div><a href={this.props.sermon.url}>⬇️</a></div>
                <div>{this.props.sermon.duration}</div>
                <div>{this.props.sermon.preachedAt}</div>
            </div>
        )
    }
}

export default SermonView;