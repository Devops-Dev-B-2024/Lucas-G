
const { getAllMovies, getMovieById, getMoviesByGenre, addMovie, updateMovie, deleteMovie } = require('../controllers/movie');
const DB = require('../db.config');
jest.mock('../db.config');

describe('getAllMovies', () => {
    it('should return all movies', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = {};
        DB.Movie.findAll.mockResolvedValue([{ id: 1, title: 'Movie1' }, { id: 2, title: 'Movie2' }]);

        await getAllMovies(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith({ data: [{ id: 1, title: 'Movie1' }, { id: 2, title: 'Movie2' }] });
    });

    it('should handle database errors', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = {};
        DB.Movie.findAll.mockRejectedValue(new Error('Database Error'));

        await getAllMovies(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error', error: expect.any(Error) });
    });
});


describe('getMovieById', () => {
    it('should return a movie by ID', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = { params: { id: '1' } };
        DB.Movie.findByPk.mockResolvedValue({ id: 1, title: 'Movie1' });

        await getMovieById(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith({ data: { id: 1, title: 'Movie1' } });
    });

    it('should handle non-existing movie', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = { params: { id: '99' } };
        DB.Movie.findByPk.mockResolvedValue(null);

        await getMovieById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Movie not found' });
    });

    it('should handle database errors', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = { params: { id: '1' } };
        DB.Movie.findByPk.mockRejectedValue(new Error('Database Error'));

        await getMovieById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error', error: expect.any(Error) });
    });
});


describe('addMovie', () => {
    it('should add a new movie', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { body: { title: 'New Movie', genre_id: 1 } };
        DB.Movie.create.mockResolvedValue({ id: 3, title: 'New Movie', genre_id: 1 });

        await addMovie(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Movie added successfully', data: { id: 3, title: 'New Movie', genre_id: 1 } });
    });

    it('should handle database errors', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { body: { title: 'New Movie', genre_id: 1 } };
        DB.Movie.create.mockRejectedValue(new Error('Database Error'));

        await addMovie(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error' });
    });
});


describe('updateMovie', () => {
    it('should update a movie', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { params: { id: '1' }, body: { title: 'Updated Movie', genre_id: 2 } };
        DB.Movie.update.mockResolvedValue([1]);

        await updateMovie(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Movie updated successfully' });
    });

    it('should handle non-existing movie', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { params: { id: '99' }, body: { title: 'Updated Movie', genre_id: 2 } };
        DB.Movie.update.mockResolvedValue([0]);

        await updateMovie(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Movie not found' });
    });

    it('should handle database errors', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { params: { id: '1' }, body: { title: 'Updated Movie', genre_id: 2 } };
        DB.Movie.update.mockRejectedValue(new Error('Database Error'));

        await updateMovie(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error' });
    });
});



describe('deleteMovie', () => {
    it('should delete a movie', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { params: { id: '1' } };
        DB.Movie.destroy.mockResolvedValue(1);

        await deleteMovie(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Movie deleted successfully' });
    });

    it('should handle non-existing movie', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { params: { id: '99' } };
        DB.Movie.destroy.mockResolvedValue(0);

        await deleteMovie(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Movie not found' });
    });

    it('should handle database errors', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { params: { id: '1' } };
        DB.Movie.destroy.mockRejectedValue(new Error('Database Error'));

        await deleteMovie(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error' });
    });
});


describe('getMoviesByGenre', () => {
    it('should return movies for a specific genre', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = { params: { genreId: '1' } };
        DB.Movie.findAll.mockResolvedValue([{ id: 1, title: 'Movie1', genre_id: 1 }, { id: 2, title: 'Movie2', genre_id: 1 }]);

        await getMoviesByGenre(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith({ data: [{ id: 1, title: 'Movie1', genre_id: 1 }, { id: 2, title: 'Movie2', genre_id: 1 }] });
    });

    it('should handle database errors', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = { params: { genreId: '1' } };
        DB.Movie.findAll.mockRejectedValue(new Error('Database Error'));

        await getMoviesByGenre(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error', error: expect.any(Error) });
    });
});


