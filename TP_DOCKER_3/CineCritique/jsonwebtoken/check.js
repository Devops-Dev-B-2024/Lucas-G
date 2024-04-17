const jwt = require('jsonwebtoken')
const DB = require('../db.config')
const Rating = DB.Rating
const Review = DB.Review

const extractBearer = authorization => {

    if(typeof authorization !== 'string'){
        return false
    }

    const matches = authorization.match(/(bearer)\s+(\S+)/i)

    return matches && matches[2]

}



const checkToken = (req, res, next) => {

    const token = req.headers.authorization && extractBearer(req.headers.authorization)

    if(!token){
        return res.status(401).json({ message: 'Accès non autorisé, pas de token'})
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if(err){
            return res.status(401).json({message: 'Token invalide, accès refusé'})
        }
        req.user = decodedToken;
        next()
    })
}


const authorizeUserOwnProfile = (req, res, next) => {
    // Assurez-vous que req.user est défini et qu'il a une propriété 'id'
    if (req.user && req.user.id) {
        const userId = parseInt(req.params.id)

        // Vérifie si l'utilisateur authentifié correspond à l'utilisateur de la ressource ou est administrateur
        if (req.user.id !== userId && !req.user.isAdmin) {
            console.log(req.user.id)
            console.log(userId)
            return res.status(403).json({ message: 'Vous n\'avez pas la permission d\'accéder à ce profil utilisateur !' })
        }
        next()
    } else {
        return res.status(401).json({ message: 'L\'utilisateur n\'est pas authentifié ou manque d\'informations d\'identification.' })
    }
}

const authorizeUserOwnRating = async (req, res, next) => {
    // Je m'assure que req.user est défini et qu'il a une propriété 'id'
    if (req.user && req.user.id) {
        const userId = parseInt(req.params.id)

        // Récupérez le rating par son ID en base de données
        const userIdInBody = await Rating.findOne({
            attributes: ['user_id'],
            where: { id: userId },
        })

        // Je vérifie si le rating existe et si l'utilisateur authentifié est administrateur
        // ou si l'id de l'utilisateur correspond à l'id de l'utilisateur associé à la ressource
        if (!userIdInBody || (req.user.id !== userIdInBody.user_id && !req.user.isAdmin)) {
            return res.status(403).json({ message: 'Vous n\'avez pas la permission d\'accéder à ce profil utilisateur !' })
        }
        next()
    } else { 
        return res.status(401).json({ message: 'L\'utilisateur n\'est pas authentifié ou manque d\'informations d\'identification.' })
    }
}

const authorizeUserOwnReview = async (req, res, next) => {
    // Je m'assure que req.user est défini et qu'il a une propriété 'id'
    if (req.user && req.user.id) {
        const reviewId = parseInt(req.params.id);

        // Récupérez la review par son ID en base de données
        const review = await Review.findOne({
            attributes: ['user_id'],
            where: { id: reviewId },
        });

        // Je vérifie si la review existe et si l'utilisateur authentifié est administrateur
        // ou si l'id de l'utilisateur correspond à l'id de l'utilisateur associé à la ressource
        if (!review || (req.user.id !== review.user_id && !req.user.isAdmin)) {
            return res.status(403).json({ message: 'Vous n\'avez pas la permission d\'accéder à cette ressource !' });
        }
        next();
    } else { 
        return res.status(401).json({ message: 'L\'utilisateur n\'est pas authentifié ou manque d\'informations d\'identification.' });
    }
}

const authorizeAdmin = (req, res, next) => {
    // Vérifie si l'utilisateur authentifié est un administrateur
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Vous n\'avez pas la permission d\'effectuer cette action !' })
    }
    next();
};

  module.exports = {
    checkToken,
    authorizeUserOwnProfile,
    authorizeAdmin,
    authorizeUserOwnRating,
    authorizeUserOwnReview
}