import React, {Component, FormEvent, ChangeEvent} from 'react';
import {Sermon, Speaker, Event, Series} from './SermonType';
import axios from 'axios';
import { isUndefined } from 'util';
import './CreateSermon.css';

enum UploadState {
    ErrorLoadingFormData,
    FormNotComplete,
    FormComplete,
    FetchingPresignedUrl,
    UploadingFile,
    CreatingSermon,
    Done
}

type Props = {
    sermonAPIURL: string
    seriesAPIURI: string
    speakersAPIURI: string
    eventsAPIURL: string
    sermonUploadUrlAPIURL: string
    getGithubToken: () => string | undefined
};
type State = {
    serieses: Series[]
    speakers: Speaker[]
    events: Event[]
    loadingSeries: boolean
    loadingSpeakers: boolean
    loadingEvents: boolean

    state: UploadState

    name?: string
    speakerId?: string
    passage?: string
    eventId?: string
    seriesId?: string
    file?: File

    signedUploadURL?: string
}

const options = ["AM", "6PM"]

const fileReader = new FileReader()

const events: Event[] = [{id: "1", name: "Morning Service"},{id: "2", name: "Evening Service"}, {id: "3", name: "Weekend Away"}]

class CreateSermon extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            serieses: [], 
            speakers: [], 
            events: [],
            loadingSeries: false, 
            loadingSpeakers: false,
            loadingEvents: false,
            state: UploadState.FormNotComplete,

            // name: "None",
            // speakerId: "None",
            // passage: "None",
            // eventId: "None"
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.uploadSermon = this.uploadSermon.bind(this);
        this.createSermon = this.createSermon.bind(this);
        this.isFormComplete = this.isFormComplete.bind(this);
        this.loadFileData = this.loadFileData.bind(this);
    }

    componentDidMount() {
        this.setState({loadingSeries:true})
        axios.get(this.props.seriesAPIURI)
        .then(res => {
            const serieses = res.data;
            this.setState({ serieses: serieses, loadingSeries: false });
        }).catch(error => {
            this.setState({state: UploadState.ErrorLoadingFormData})
        })

        this.setState({loadingSpeakers:true})
        axios.get(this.props.speakersAPIURI)
        .then(res => {
            const speakers = res.data;
            this.setState({ speakers: speakers, loadingSpeakers: false });
        }).catch(error => {
            this.setState({state: UploadState.ErrorLoadingFormData})
        })

        this.setState({loadingEvents:true})
        axios.get(this.props.eventsAPIURL)
        .then(res => {
            const events = res.data;
            this.setState({ events: events, loadingEvents: false });
        }).catch(error => {
            this.setState({state: UploadState.ErrorLoadingFormData})
        })
    }

    isFormComplete(): boolean {
        const isFormIncomplete = isUndefined(this.state.name) || 
            isUndefined(this.state.eventId) || 
            isUndefined(this.state.passage) || 
            isUndefined(this.state.speakerId) ||
            isUndefined(this.state.seriesId) ||
            isUndefined(this.state.eventId) ||
            isUndefined(this.state.file);
        if (isFormIncomplete) this.setState({state: UploadState.FormNotComplete})
        else this.setState({state: UploadState.FormComplete})

        return !isFormIncomplete;
    }
    

    handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log(event.target);

         if (this.isFormComplete) {

            let config = {
                headers: {
                  "Content-Type": "text/plain",
                  "Authorization": "github " + this.props.getGithubToken()
                }
            }

            
            axios.post(this.props.sermonUploadUrlAPIURL, this.state.name, config)
            .then(res => {
                console.log(res);
                this.setState({ signedUploadURL: res.data.signedUploadUrl });
            }).catch(err => {
                console.log(err);
            }).then(re => {
                this.loadFileData();
            }).then(re => {
                this.createSermon();
            });
        }
    }

    loadFileData() {
        fileReader.onloadend = this.uploadSermon
        if (this.state.file) {
            fileReader.readAsBinaryString(this.state.file)
        }
    }

    uploadSermon(ev: ProgressEvent): any {
        if (this.state.signedUploadURL) {
            let config = {
                headers: {
                  "Content-Type": "text/plain",
                  "Authorization": "github " + this.props.getGithubToken()
                }
            }

            axios.put(this.state.signedUploadURL, fileReader.result, config)
            .then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
        }
    }

    createSermon() {
        if (this.isFormComplete && this.state.signedUploadURL) {
            var newSermon: Sermon = {
                name: this.state.name!,
                passage: this.state.passage!,
                event: {id: this.state.eventId!},
                series: {id: this.state.seriesId!},
                speakers: [{id: this.state.speakerId!}],
                url: this.state.signedUploadURL.split('?')[0],
                duration: 0,
                preachedAt: new Date()
            }

            this.setState({state: UploadState.CreatingSermon});

            axios.post(this.props.sermonAPIURL, newSermon)
            .then(res => {
                this.setState({state: UploadState.Done})
            })
        }
    }

    render() {

        const eventOptionElements = this.state.events.map(event => <option key={event.id} value={event.id}>{event.name}</option>)
        const speakerOptionsElements = this.state.speakers.map(speaker => <option key={speaker.id}  value={speaker.id}>{speaker.name}</option>)
        const seriesOptionsElements = this.state.serieses.map(series => <option key={series.id} value={series.id}>{series.name}</option>)

        if (this.state.state == UploadState.ErrorLoadingFormData) {
            return(<div>Error Creating Form</div>)
        }

        if (this.state.loadingSeries || 
            this.state.loadingSpeakers || 
            this.state.loadingEvents) {
            return(<div>Creating Form</div>)
        }

        if (this.state.state === UploadState.UploadingFile) {
            return(<div>Uploading Sermon File</div>)
        }
        
        if (this.state.state === UploadState.CreatingSermon) {
            return(<div>Creating Sermon</div>)
        }

        if (this.state.state === UploadState.Done) {
            return(<div>Done</div>)
        }

        return(
            <div className="createsermon">
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input name="name" id="name" type="text" onChange={e => this.setState({...this.state, [e.currentTarget.name]: e.currentTarget.value})}/>
                    </div>
                    <div>
                    <label>Series:</label>
                    <select name="seriesId" id="series" onChange={e => this.setState({...this.state, [e.currentTarget.name]: e.currentTarget.value})}>
                        {seriesOptionsElements}
                    </select>
                    </div>
                    <div>
                    <label>Passage:</label>
                    <input name="passage" id="passage" type="text" onChange={e => this.setState({...this.state, [e.currentTarget.name]: e.currentTarget.value})}/>
                    </div>
                    <div>
                    <label>Speaker:</label>
                    <select name="speakerId" id="speaker" onChange={e => this.setState({...this.state, [e.currentTarget.name]: e.currentTarget.value})}>
                        {speakerOptionsElements}
                    </select>
                    </div>
                    <div>
                    <label>Service/Event</label>
                    <select name="eventId" id="event" onChange={e => this.setState({...this.state, [e.currentTarget.name]: e.currentTarget.value})}>
                        {eventOptionElements}
                    </select>
                    </div>
                    <div>
                    <label>MP3 File</label>
                    <input type="file"
                        id="file" name="file"
                        accept="audio/mpeg"
                        onChange={e => {
                            console.log(e.currentTarget.files)
                            if (e.currentTarget != null && e.currentTarget.files != null && e.currentTarget.files[0] != null) {
                                this.setState({...this.state, [e.currentTarget.name]: e.currentTarget.files[0]})
                            }
                            }
                        }
                        >
                    </input>
                    </div>
                    <div>
                    <input type="submit" disabled={this.state.state === UploadState.FormComplete}/>
                    </div>
                </form>
            </div>
        )
    }
}

export default CreateSermon;