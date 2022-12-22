import 'dotenv/config';

const db = process.env.MYSQL_DATABASE;

export function getUserSessionStatisticsQuery(): string {
    return `
        SELECT
        usr.id AS UID,
        usr.email,
        usr.profile,
        MAX(JSON_EXTRACT(sess.json, "$.loggedInAt")) AS latestLogin,
        COUNT(JSON_EXTRACT(sess.json, "$.userId")) AS loginTimes,
        usr.createdAt as registerTime
        FROM ${db}.session sess
        RIGHT JOIN ${db}.users usr ON JSON_EXTRACT(sess.json, "$.userId") = usr.id
        GROUP BY UID, createdAt
        ORDER BY UID;
    `
}