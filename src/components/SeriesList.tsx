import React, {Component} from 'react';
import axios from 'axios';
import {Series} from '../SermonType'
import SeriesView from './SeriesView';
import './SeriesList.css'

type Props = {
    seriesAPIURL: string
}
type State = {
    serieses: Series[]
    loading: boolean
    error: boolean
}

class SeriesList extends Component<Props,State> {
    constructor(props: Props) {
        super(props)
        this.state = {serieses: [], loading: false, error: false}
    }

    componentDidMount() {
        this.setState({loading:true})
        axios.get(this.props.seriesAPIURL)
          .then(res => {
            const serieses = res.data;
            this.setState({ serieses: serieses, loading: false });
          }).catch(error => {
            this.setState({error: true})
          })
        }

    render() {

        const seriesRender = this.state.serieses.map(series =>
            <SeriesView key={series.id} series={series}/>
            )

        if (this.state.error) {
            return(<div>Error Loading Serieses</div>)
        }

        if (this.state.loading) {
            return(<div>Loading Serieses</div>)
        }

        return(
            <div className="SeriesList">
                {seriesRender}
            </div>
        )
    }
}

export default SeriesList