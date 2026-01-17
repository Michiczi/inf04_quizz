function authMiddleware(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send("Dostęp zabroniony. Zaloguj się.");
    }
}

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.session.user || !req.session.user.role) {
            return res.status(403).send("Brak uprawnień. Rola użytkownika nie jest zdefiniowana.");
        }
        if (!allowedRoles.includes(req.session.user.role)) {
            return res.status(403).send("Brak uprawnień do wykonania tej operacji.");
        }
        next();
    };
}

export {authMiddleware, authorizeRoles};