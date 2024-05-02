const bcryptjs = require('bcryptjs')
const { authorizeUserOwnProfile } = require('../jsonwebtoken/check')
const DB = require('../db.config')
const User = DB.User

/**********************************/
/*** Routage de la ressource User */

exports.getAllUsers = async (req, res) => {
    try {
        // Vérifie si l'utilisateur authentifié est un administrateur
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Vous n\'avez pas la permission d\'accéder à la liste des utilisateurs !' });
        }

        // Si l'utilisateur est un administrateur, récupère tous les utilisateurs
        const users = await User.findAll();
        return res.json({ data: users });
    } catch (err) {
        return res.status(500).json({ message: 'Database Error', error: err });
    }
};

exports.getUserById = async (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.json(400).json({ message: 'Missing Parameter' })
    }

    try{
        // Récupération de l'utilisateur et vérification
        let user = await User.findOne({ where: { id: userId}, attributes: ['id','username','email','isAdmin']})
        if (user === null) {
            return res.status(404).json({ message: 'This user does not exist !' })
        }

   // Vérification de l'autorisation pour accéder au profil
        authorizeUserOwnProfile(req, res, () => {
            return res.json({ data: user });
        });
    }catch(err){
        console.error(err)
        return res.status(500).json({ message: 'Database Error', error: err })
    }    
}

exports.addUser = async (req, res) => {
    const { username, email, password } = req.body

    // Validation des données reçues
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing Data' })
    }

    try{
        // Vérification si l'utilisateur existe déjà
        const user = await User.findOne({ where: { email: email }, raw: true })
        if (user !== null) {
            return res.status(409).json({ message: `The user ${username} already exists !` })
        }


        // Création de l'utilisateur
        let userc = await User.create({...req.body, isAdmin: false})
        return res.json({ message: 'User Created', data: userc })

    }catch(err){
        if(err.name == 'SequelizeDatabaseError'){
            res.status(500).json({ message: 'Database Error', error: err })
        }
        res.status(500).json({ message: 'Hash Process Error', error: err})        
    }
}

exports.updateUser = async (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    try{
        // Recherche de l'utilisateur et vérification
        let user = await User.findOne({ where: {id: userId}, raw: true})
        if(user === null){
            return res.status(404).json({ message: 'This user does not exist !'})
        }

        // Mise à jour de l'utilisateur
        await User.update(req.body, { where: {id: userId}})
        return res.json({ message: 'User Updated'})
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}


exports.deleteUser = async (req, res) => {
    try {
        let userId = parseInt(req.params.id);

        // Vérification si le champ id est présent et cohérent
        if (!userId) {
            return res.status(400).json({ message: 'Missing parameter' });
        }

        // Suppression de l'utilisateur
        await User.destroy({ where: { id: userId }, force: true });
        
        // Succès de la suppression
        return res.status(204).json({});
    } catch (err) {
        // Gestion des erreurs
        return res.status(500).json({ message: 'Database Error', error: err.message });
    }
};
