
export type Speaker = {
    id: string
    name?: string
}

export type Event = {
    id: string
    name?: string
}

export type Series = {
    id: string
    name?: string
    subtitle?: string,
    image3x2Url?: string
}

export type Sermon = {
    id?: string
    name: string
    passage: string
    speakers: Speaker[]
    series: Series
    event: Event,
    url: string,
    duration: number
    preachedAt: Date
}