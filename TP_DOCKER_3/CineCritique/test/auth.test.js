
// Mock des dépendances
jest.mock('../db.config', () => ({
  User: {
    findOne: jest.fn(),
    checkPassword: jest.fn(),
  },
  sequelize: jest.fn()
}));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn() }));

// Importation du contrôleur auth
const { login } = require('../controllers/auth'); 

describe('Auth Controller Tests', () => {
  beforeEach(() => {
    // Réinitialisation des mocks avant chaque test
    jest.clearAllMocks();
  });

  it('doit gérer les connexions en cas d\'absence d\'email ou de mot de passe', async () => {
    // Mock des fonctions et du comportement attendu
    const mockReq = { body: { email: '', password: '' } };
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    
    await login(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Wrong email or password' });
  });

  it('doit gérer les connexions avec un utilisateur qui n\'existe pas', async () => {
    // Mock du modèle User pour retourner null
    const User = require('../db.config').User;
    User.findOne.mockResolvedValue(null);

    const mockReq = { body: { email: 'test@test.com', password: 'password123' } };
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'This account does not exists !' });
  });


});

