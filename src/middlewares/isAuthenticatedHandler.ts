/**
 * Login Required middleware.
 */
export default function isAuthenticatedMiddleware(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/signin');
};