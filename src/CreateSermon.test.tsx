import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { SermonForm, isFormComplete } from './CreateSermon';

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });

it('empty form is invalid', () => {
    const form: SermonForm = {}
    const isComplete = isFormComplete(form)
    expect(isComplete).toBe(false)
});

it('partial form is invalid', () => {
    const form: SermonForm = {
        name: "basdsasd"
    }
    const isComplete = isFormComplete(form)
    expect(isComplete).toBe(false)
});

it('full form is valid', () => {
    const form: SermonForm = {
        name: "name",
        speakerId: "speakerid",
        passage: "passage",
        eventId: "eventid",
        seriesId: "seriesid",
        file: new File(["contents"],"filename"),
        date: "2/1/2019",
        time: "18:00"
    }
    // TODO - this is missing file!

    const isComplete = isFormComplete(form)
    expect(isComplete).toBe(true)
});

it('full form is invalid with bad date', () => {
    const form: SermonForm = {
        name: "name",
        speakerId: "speakerid",
        passage: "passage",
        eventId: "eventid",
        seriesId: "seriesid",
        file: new File(["contents"],"filename"),
        date: "333320/12/2019111",
        time: "18:00"
    }
    // TODO - this is missing file!

    const isComplete = isFormComplete(form)
    expect(isComplete).toBe(false)
});

it('full form is invalid with bad time', () => {
    const form: SermonForm = {
        name: "name",
        speakerId: "speakerid",
        passage: "passage",
        eventId: "eventid",
        seriesId: "seriesid",
        file: new File(["contents"],"filename"),
        date: "23/12/2019",
        time: "18:000"
    }
    // TODO - this is missing file!

    const isComplete = isFormComplete(form)
    expect(isComplete).toBe(false)
});