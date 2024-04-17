
const { getAllGenres, getGenreById } = require('../controllers/genre');
const DB = require('../db.config');
jest.mock('../db.config');

describe('Genre Controller Tests', () => {
  // Tests for getAllGenres
  describe('getAllGenres', () => {
    it('should return all genres', async () => {
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const mockReq = {};
      DB.Genre.findAll.mockResolvedValue([{ id: 1, name: 'Action' }, { id: 2, name: 'Drama' }]);

      await getAllGenres(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ data: [{ id: 1, name: 'Action' }, { id: 2, name: 'Drama' }] });
    });

    it('should handle database errors', async () => {
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const mockReq = {};
      DB.Genre.findAll.mockRejectedValue(new Error('Database Error'));

      await getAllGenres(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error', error: expect.any(Error) });
    });
  });

  // Tests for getGenreById
  describe('getGenreById', () => {
    it('should return a genre by ID', async () => {
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const mockReq = { params: { id: '1' } };
      DB.Genre.findByPk.mockResolvedValue({ id: 1, name: 'Action' });

      await getGenreById(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ data: { id: 1, name: 'Action' } });
    });

    it('should handle non-existing genre', async () => {
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const mockReq = { params: { id: '99' } };
      DB.Genre.findByPk.mockResolvedValue(null);

      await getGenreById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Genre not found' });
    });

    it('should handle database errors', async () => {
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const mockReq = { params: { id: '1' } };
      DB.Genre.findByPk.mockRejectedValue(new Error('Database Error'));

      await getGenreById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error', error: expect.any(Error) });
    });
  });


});


  // Tests for addGenre
  describe('addGenre', () => {
    it('should add a new genre', async () => {
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockReq = { body: { name: 'New Genre' } };
      DB.Genre.create.mockResolvedValue({ id: 3, name: 'New Genre' });

      await addGenre(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Genre added successfully', data: { id: 3, name: 'New Genre' } });
    });

    it('should handle database errors', async () => {
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockReq = { body: { name: 'New Genre' } };
      DB.Genre.create.mockRejectedValue(new Error('Database Error'));

      await addGenre(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error' });
    });
  });

  // Tests for updateGenre
  describe('updateGenre', () => {
    it('should update an existing genre', async () => {
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockReq = { params: { id: '1' }, body: { name: 'Updated Genre' } };
      DB.Genre.update.mockResolvedValue([1]);

      await updateGenre(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Genre updated successfully' });
    });

  });

  // Tests for deleteGenre
  describe('deleteGenre', () => {
    it('should delete a genre', async () => {
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockReq = { params: { id: '1' } };
      DB.Genre.destroy.mockResolvedValue(1);

      await deleteGenre(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Genre deleted successfully' });
    });


  });
