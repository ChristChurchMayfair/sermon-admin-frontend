import React, {Component} from 'react';
import {Series} from '../SermonType';

type Props = {
    series: Series;
};
type State = {}

class SeriesView extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return(
            <div className="series">
                <div>{this.props.series.name}</div>
                <div>{this.props.series.subtitle}</div>
                <div>{this.props.series.image3x2url}</div>
            </div>
        )
    }
}

export default SeriesView;