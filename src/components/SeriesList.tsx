import React, {Component} from 'react';
import axios from 'axios';
import {Series} from '../SermonType'
import SeriesView from './SeriesView';

type Props = {
    sermonAPIURL: string
}
type State = {
    serieses: Series[]
    loading: boolean
}

class SeriesList extends Component<Props,State> {
    constructor(props: Props) {
        super(props)
        this.state = {serieses: [], loading: false}
    }

    componentDidMount() {
        this.setState({loading:true})
        axios.get(this.props.sermonAPIURL)
          .then(res => {
            const serieses = res.data;
            this.setState({ serieses: serieses, loading: false });
          })
        }

    render() {

        const seriesRender = this.state.serieses.map(series =>
            <SeriesView series={series}/>
            )

        if (this.state.loading) {
            return(<div>LOADING</div>)
        }

        return(
            <div className="SeriesList">
                {seriesRender}
            </div>
        )
    }
}

export default SeriesList