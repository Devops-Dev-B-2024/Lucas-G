
const { getAllRatings, getRatingById, getRatingsByMovie, getRatingsByUser, addRating, deleteRating, updateRating } = require('../controllers/rating');
const DB = require('../db.config');
jest.mock('../db.config');

describe('getAllRatings', () => {
    it('should return all ratings', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = {};
        DB.Rating.findAll.mockResolvedValue([{ id: 1, movieId: 1, userId: 1, rating: 5 }, { id: 2, movieId: 2, userId: 1, rating: 4 }]);

        await getAllRatings(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith({ data: [{ id: 1, movieId: 1, userId: 1, rating: 5 }, { id: 2, movieId: 2, userId: 1, rating: 4 }] });
    });

    it('should handle database errors', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = {};
        DB.Rating.findAll.mockRejectedValue(new Error('Database Error'));

        await getAllRatings(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error', error: expect.any(Error) });
    });
});


describe('getRatingById', () => {
    it('should return a rating by ID', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = { params: { id: '1' } };
        DB.Rating.findByPk.mockResolvedValue({ id: 1, movieId: 1, userId: 1, rating: 5 });

        await getRatingById(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith({ data: { id: 1, movieId: 1, userId: 1, rating: 5 } });
    });

    it('should handle non-existing rating', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = { params: { id: '99' } };
        DB.Rating.findByPk.mockResolvedValue(null);

        await getRatingById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Rating not found' });
    });

    it('should handle database errors', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = { params: { id: '1' } };
        DB.Rating.findByPk.mockRejectedValue(new Error('Database Error'));

        await getRatingById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error', error: expect.any(Error) });
    });
});


describe('addRating', () => {
    it('should add a new rating', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { body: { movieId: 1, userId: 1, rating: 5 } };
        DB.Rating.create.mockResolvedValue({ id: 3, movieId: 1, userId: 1, rating: 5 });

        await addRating(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Rating added successfully', data: { id: 3, movieId: 1, userId: 1, rating: 5 } });
    });

    it('should handle database errors', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { body: { movieId: 1, userId: 1, rating: 5 } };
        DB.Rating.create.mockRejectedValue(new Error('Database Error'));

        await addRating(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error' });
    });
});


describe('updateRating', () => {
    it('should update a rating', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { params: { id: '1' }, body: { rating: 4 } };
        DB.Rating.update.mockResolvedValue([1]);

        await updateRating(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Rating updated successfully' });
    });

    it('should handle non-existing rating', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { params: { id: '99' }, body: { rating: 4 } };
        DB.Rating.update.mockResolvedValue([0]);

        await updateRating(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Rating not found' });
    });

    it('should handle database errors', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { params: { id: '1' }, body: { rating: 4 } };
        DB.Rating.update.mockRejectedValue(new Error('Database Error'));

        await updateRating(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error' });
    });
});


describe('deleteRating', () => {
    it('should delete a rating', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { params: { id: '1' } };
        DB.Rating.destroy.mockResolvedValue(1);

        await deleteRating(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Rating deleted successfully' });
    });

    it('should handle non-existing rating', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { params: { id: '99' } };
        DB.Rating.destroy.mockResolvedValue(0);

        await deleteRating(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Rating not found' });
    });

    it('should handle database errors', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { params: { id: '1' } };
        DB.Rating.destroy.mockRejectedValue(new Error('Database Error'));

        await deleteRating(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error' });
    });
});


describe('getRatingsByMovie', () => {
    it('should return ratings for a specific movie', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = { params: { movieId: '1' } };
        DB.Rating.findAll.mockResolvedValue([{ id: 1, movieId: 1, userId: 1, rating: 5 }, { id: 2, movieId: 1, userId: 2, rating: 4 }]);

        await getRatingsByMovie(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith({ data: [{ id: 1, movieId: 1, userId: 1, rating: 5 }, { id: 2, movieId: 1, userId: 2, rating: 4 }] });
    });

    it('should handle database errors', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = { params: { movieId: '1' } };
        DB.Rating.findAll.mockRejectedValue(new Error('Database Error'));

        await getRatingsByMovie(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error', error: expect.any(Error) });
    });
});


describe('getRatingsByUser', () => {
    it('should return ratings for a specific user', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = { params: { userId: '1' } };
        DB.Rating.findAll.mockResolvedValue([{ id: 1, movieId: 2, userId: 1, rating: 5 }, { id: 3, movieId: 3, userId: 1, rating: 4 }]);

        await getRatingsByUser(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith({ data: [{ id: 1, movieId: 2, userId: 1, rating: 5 }, { id: 3, movieId: 3, userId: 1, rating: 4 }] });
    });

    it('should handle database errors', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = { params: { userId: '1' } };
        DB.Rating.findAll.mockRejectedValue(new Error('Database Error'));

        await getRatingByUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error', error: expect.any(Error) });
    });
});