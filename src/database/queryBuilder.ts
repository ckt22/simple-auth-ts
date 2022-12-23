import 'dotenv/config';

const db = process.env.MYSQL_DATABASE;

export function getUserSessionStatisticsQuery(): string {
    return `
        SELECT
        usr.id AS UID,
        usr.email,
        usr.profile,
        MAX( CAST(JSON_UNQUOTE(JSON_EXTRACT(sess.json, '$.loggedInAt')) as DATETIME(6)) ) AS latestLogin,
        COUNT(JSON_EXTRACT(sess.json, "$.userId")) AS loginTimes,
        usr.createdAt as registerTime
        FROM ${db}.session sess
        RIGHT JOIN ${db}.users usr ON JSON_EXTRACT(sess.json, "$.userId") = usr.id
        GROUP BY UID, createdAt
        ORDER BY UID;
    `;
}

export function getUsersWithActiveSessionsTodayQuery(): string {
    return `
        SELECT
        usr.id AS UID
        FROM ${db}.session sess
        RIGHT JOIN ${db}.users usr ON JSON_EXTRACT(sess.json, "$.userId") = usr.id
        WHERE DATE(CAST(JSON_UNQUOTE(JSON_EXTRACT(sess.json, '$.loggedInAt')) as DATETIME(6))) = CURDATE()
        GROUP BY UID, createdAt
        ORDER BY UID;
    `;
}

export function getSessionsInSevenDaysQuery(): string {
    return `
        SELECT
        DATE(CAST(JSON_UNQUOTE(JSON_EXTRACT(sess.json, '$.loggedInAt')) as DATETIME(6))) AS loginDate,
        COUNT(*) AS sessionCount
        FROM ${db}.session sess
        WHERE JSON_EXTRACT(sess.json, '$.userId') IS NOT NULL
        AND DATE(CAST(JSON_UNQUOTE(JSON_EXTRACT(sess.json, '$.loggedInAt')) as DATETIME(6))) >= NOW() + INTERVAL -7 DAY
        AND DATE(CAST(JSON_UNQUOTE(JSON_EXTRACT(sess.json, '$.loggedInAt')) as DATETIME(6))) <  NOW() + INTERVAL 0 DAY
        GROUP BY loginDate
        ORDER BY loginDate DESC;
    `;
}