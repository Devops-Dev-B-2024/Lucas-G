// Mock des dépendances
jest.mock('../db.config', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn(),
  },
  sequelize: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn() }));

// Importation du contrôleur User
const { getAllUsers, updateUser, addUser, deleteUser } = require('../controllers/user');
const db = require('../db.config');
const mockUsers = [
  {
    id: 1,
    username: 'user1',
    email: 'user1@example.com',
    password: 'hashed_password_1',
    isAdmin: false,
  },
  {
    id: 2,
    username: 'user2',
    email: 'user2@example.com',
    password: 'hashed_password_2',
    isAdmin: true,
  },

];

describe('User Controller Tests', () => {
  beforeEach(() => {
    // Réinitialisation des mocks avant chaque test
    jest.clearAllMocks();
  });

  it('should get all users', async () => {
    // Définir mockReq pour simuler la requête
    const mockReq = {};
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };

    // Définir manuellement la fonction findAll pour db.User
    db.User.findAll.mockResolvedValue(mockUsers);

    await getAllUsers(mockReq, mockRes);

    // Les attentes sont mises à jour en fonction de la logique de votre code
    expect(mockRes.status).toHaveBeenCalledWith(200); // Attend un statut 200 (OK)
    expect(mockRes.json).toHaveBeenCalledWith({ data: mockUsers });
  });

  it('should update a user', async () => {
    // Définir les données de l'utilisateur à mettre à jour
    const userDataToUpdate = { id: 1, username: 'updated_user', email: 'updated_user@example.com', password: 'updated_password', isAdmin: true };
    const mockReq = { params: { id: 1 }, body: userDataToUpdate }; 
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
  
    // Définir manuellement la fonction update pour db.User
    db.User.update.mockResolvedValue([1]); // Supposons que la mise à jour a réussi
  
    await updateUser(mockReq, mockRes);
  
    expect(mockRes.status).toHaveBeenCalledWith(200); // Attend un statut 200 (OK)
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'User Updated' });
  });

  it('should add a user', async () => {
    const mockReq = { body: { username: 'new_user', email: 'new_user@example.com', password: 'new_password', isAdmin: false } }; // Données de l'utilisateur à ajouter
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };

    // Définir manuellement la fonction create pour db.User
    db.User.create.mockResolvedValue({ message: 'User Created' });

    await addUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'User Created' });
  });

  it('should delete a user', async () => {
    const mockReq = { params: { id: 1 } };
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() }; // Créez un mock pour la fonction json

    // Définir manuellement la fonction destroy pour db.User
    db.User.destroy.mockResolvedValue({});

    await deleteUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(204); // Utilisez 204 ou le statut approprié en cas de réussite
    expect(mockRes.json).toHaveBeenCalledWith({});
  });
});
