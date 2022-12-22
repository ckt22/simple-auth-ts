import { Session } from '../database/entities/session.entity';
import { getUserSessionStatisticsQuery } from '../database/queryBuilder';

interface GetUserSessionStatisticsQueryData {
    UID: string,
    email: string,
    profile: string,
    latestLogin: Date,
    loginTimes: number,
    registerTime: Date
}

export async function getUserSessionStatistics(): Promise<[GetUserSessionStatisticsQueryData]> {
    return await Session.query(getUserSessionStatisticsQuery());
}