
const { getAllReviews, getReviewById, getReviewsByMovie, getReviewsByUser, updateReview, deleteReview, addReview } = require('../controllers/review');
const DB = require('../db.config');
jest.mock('../db.config');

describe('getAllReviews', () => {
    it('should return all reviews', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = {};
        DB.Review.findAll.mockResolvedValue([{ id: 1, author: 'Author1', content: 'Content1' }, { id: 2, author: 'Author2', content: 'Content2' }]);

        await getAllReviews(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith({ data: [{ id: 1, author: 'Author1', content: 'Content1' }, { id: 2, author: 'Author2', content: 'Content2' }] });
    });

    it('should handle database errors', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = {};
        DB.Review.findAll.mockRejectedValue(new Error('Database Error'));

        await getAllReviews(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error', error: expect.any(Error) });
    });
});


describe('getReviewById', () => {
    it('should return a review by ID', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = { params: { id: '1' } };
        DB.Review.findByPk.mockResolvedValue({ id: 1, author: 'Author1', content: 'Content1' });

        await getReviewById(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith({ data: { id: 1, author: 'Author1', content: 'Content1' } });
    });

    it('should handle non-existing review', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = { params: { id: '99' } };
        DB.Review.findByPk.mockResolvedValue(null);

        await getReviewById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Review not found' });
    });

    it('should handle database errors', async () => {
        const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const mockReq = { params: { id: '1' } };
        DB.Review.findByPk.mockRejectedValue(new Error('Database Error'));

        await getReviewById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error', error: expect.any(Error) });
    });
});



describe('addReview', () => {
    it('should add a new review', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { body: { author: 'New Author', content: 'New content', movieId: 1, userId: 1 } };
        DB.Review.create.mockResolvedValue({ id: 3, author: 'New Author', content: 'New content', movieId: 1, userId: 1 });

        await addReview(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Review added successfully', data: { id: 3, author: 'New Author', content: 'New content', movieId: 1, userId: 1 } });
    });

    it('should handle database errors', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { body: { author: 'New Author', content: 'New content', movieId: 1, userId: 1 } };
        DB.Review.create.mockRejectedValue(new Error('Database Error'));

        await addReview(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error' });
    });
});


describe('updateReview', () => {
    it('should update a review', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { params: { id: '1' }, body: { author: 'Updated Author', content: 'Updated content' } };
        DB.Review.update.mockResolvedValue([1]);

        await updateReview(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Review updated successfully' });
    });

    it('should handle non-existing review', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { params: { id: '99' }, body: { author: 'Updated Author', content: 'Updated content' } };
        DB.Review.update.mockResolvedValue([0]);

        await updateReview(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Review not found' });
    });

    it('should handle database errors', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { params: { id: '1' }, body: { author: 'Updated Author', content: 'Updated content' } };
        DB.Review.update.mockRejectedValue(new Error('Database Error'));

        await updateReview(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error' });
    });
});


describe('deleteReview', () => {
    it('should delete a review', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { params: { id: '1' } };
        DB.Review.destroy.mockResolvedValue(1);

        await deleteReview(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Review deleted successfully' });
    });

    it('should handle non-existing review', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { params: { id: '99' } };
        DB.Review.destroy.mockResolvedValue(0);

        await deleteReview(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Review not found' });
    });

    it('should handle database errors', async () => {
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockReq = { params: { id: '1' } };
        DB.Review.destroy.mockRejectedValue(new Error('Database Error'));

        await deleteReview(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error' });
    });
});


describe('Review Controller Tests', () => {
    // Tests for getReviewsByMovie
    describe('getReviewsByMovie', () => {
        it('should return reviews for a specific movie', async () => {
            const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            const mockReq = { params: { movieId: '1' } };
            DB.Review.findAll.mockResolvedValue([{ id: 1, content: 'Review 1', movieId: '1', userId: '1' }]);

            await getReviewsByMovie(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({ data: [{ id: 1, content: 'Review 1', movieId: '1', userId: '1' }] });
        });

        it('should handle database errors', async () => {
            const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            const mockReq = { params: { movieId: '1' } };
            DB.Review.findAll.mockRejectedValue(new Error('Database Error'));

            await getReviewsByMovie(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error', error: expect.any(Error) });
        });
    });

    // Tests for getReviewsByUser
    describe('getReviewsByUser', () => {
        it('should return reviews for a specific user', async () => {
            const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            const mockReq = { params: { userId: '1' } };
            DB.Review.findAll.mockResolvedValue([{ id: 2, content: 'Review 2', movieId: '2', userId: '1' }]);

            await getReviewsByUser(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({ data: [{ id: 2, content: 'Review 2', movieId: '2', userId: '1' }] });
        });

        it('should handle database errors', async () => {
            const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            const mockReq = { params: { userId: '1' } };
            DB.Review.findAll.mockRejectedValue(new Error('Database Error'));

            await getReviewsByUser(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database Error', error: expect.any(Error) });
        });
    });
});