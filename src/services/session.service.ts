import { Session } from "../database/entities/session.entity";

export async function getUserSessionStatistics(): Promise<[]> {
    return await Session.query(
        `
        SELECT
        usr.id AS UID,
        usr.email,
        usr.profile,
        MAX(JSON_EXTRACT(sess.json, "$.loggedInAt")) AS latestLogin,
        COUNT(JSON_EXTRACT(sess.json, "$.userId")) AS loginTimes,
        usr.createdAt as registerTime
        FROM mydb.session sess
        RIGHT JOIN mydb.users usr ON JSON_EXTRACT(sess.json, "$.userId") = usr.id
        GROUP BY UID, createdAt
        ORDER BY UID;
        `
    );
}