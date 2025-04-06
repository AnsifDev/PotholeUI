export type Complaint = {
    id?: string,
    name: string,
    complaint: string,
    latitude: number,
    longitude: number,
    status: 'pending' | 'completed',
    reported_at?: number,
    resolved_by?: string,
    resolved_at?: number
}

// export type Coordinates = {
//     location: string,
//     name: string
// }

export type User = {
    password: string
}