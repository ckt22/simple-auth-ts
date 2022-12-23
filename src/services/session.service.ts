import { Session } from '../database/entities/session.entity';
import { getUserSessionStatisticsQuery, getUsersWithActiveSessionsTodayQuery, getSessionsInSevenDaysQuery } from '../database/queryBuilder';
import { sub, format } from 'date-fns' 

interface GetUserSessionStatisticsQueryData {
    UID: number,
    email: string,
    profile: string,
    latestLogin: Date,
    loginTimes: number,
    registerTime: Date
}

interface GetUsersWithActiveSessionTodayResp {
    usersWithActiveSessionToday: [],
    numberOfActiveUsersToday: number
}
interface GetUserSessionInSevenDaysQueryData {
    loginDate: Date,
    sessionCount: number
}

interface GetUserSessionInSevenDaysQueryResp {
    averageSessionsInSevenDays: number;
    weeklySessionsByDate: {
        [date: string]: number,
    }
}

export async function getUserSessionStatistics(): Promise<[GetUserSessionStatisticsQueryData]> {
    return await Session.query(getUserSessionStatisticsQuery());
}

export async function getUsersWithActiveSessionToday(): Promise<GetUsersWithActiveSessionTodayResp> {
    const usersWithActiveSessionToday = await Session.query(getUsersWithActiveSessionsTodayQuery());
    return {
        usersWithActiveSessionToday,
        numberOfActiveUsersToday: usersWithActiveSessionToday.length
    };
}

export async function getUserSessionsInSevenDays(): Promise<GetUserSessionInSevenDaysQueryResp> {
    const activeSessionsInSevenDays: [GetUserSessionInSevenDaysQueryData] = await Session.query(getSessionsInSevenDaysQuery());
    const weeklySessionsByDate = {};
    let totalNumberOfSessionsThisWeek = 0;
    for (let day = 0; day < 7; day++) {
        const formattedDate = format(sub(new Date(), { days: day }), 'YYY-MM-dd');
        let sess = activeSessionsInSevenDays.find(sess => format(sess.loginDate, 'YYY-MM-dd') === formattedDate);
        if (sess) {
            weeklySessionsByDate[formattedDate] = Number(sess.sessionCount);
            totalNumberOfSessionsThisWeek += Number(sess.sessionCount);
        } else {
            weeklySessionsByDate[formattedDate] = 0;
        }
    }
    return {
        averageSessionsInSevenDays: Math.round(totalNumberOfSessionsThisWeek/7),
        weeklySessionsByDate
    }
}