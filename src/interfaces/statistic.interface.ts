interface IStatistic {
    date: string,
    reservations: number,
    approvedHours: number,
    blockedHours: number,
    freeHours: number | string
}

export default IStatistic;