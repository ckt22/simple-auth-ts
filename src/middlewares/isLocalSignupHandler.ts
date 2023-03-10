/**
 * Login Required middleware.
 */
export default function isLocalSignup(req, res, next) {
    if (req.session?.isOAuth) {
        res.status(403).render('error', {
            message: 'This page can only be accessed by local signup users.',
            error: {}
        });
        return;
    }
    next();
};