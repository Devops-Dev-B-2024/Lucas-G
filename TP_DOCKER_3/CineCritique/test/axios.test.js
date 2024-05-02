
const axios = require('axios');
const DB = require('../db.config');
const { getMovieNames, getGenresForMovie, getGenreIdByName, processMovies } = require('../controllers/axios'); 
jest.mock('axios');
jest.mock('../db.config');

describe('Axios Controller Tests', () => {
  // Test for getMovieNames()
  describe('getMovieNames', () => {
    it('should return movie names on successful axios call', async () => {
      axios.get.mockResolvedValue({ data: { Search: [{ Title: 'Movie1' }, { Title: 'Movie2' }] } });
      const movies = await getMovieNames();
      expect(movies).toEqual(['Movie1', 'Movie2']);
    });

    it('should handle errors', async () => {
      axios.get.mockRejectedValue(new Error('Error fetching data'));
      await expect(getMovieNames()).rejects.toThrow('Error fetching data');
    });
  });

  // Test for getGenresForMovie()
  describe('getGenresForMovie', () => {
    it('should return the first genre for a given movie name', async () => {
      axios.get.mockResolvedValue({ data: { Genre: 'Action, Drama' } });
      const genre = await getGenresForMovie('Movie1');
      expect(genre).toEqual('Action');
    });

    it('should handle errors', async () => {
      axios.get.mockRejectedValue(new Error('Error fetching genre'));
      await expect(getGenresForMovie('InvalidMovie')).rejects.toThrow('Error fetching genre');
    });
  });

  // Test for getGenreIdByName()
  describe('getGenreIdByName', () => {
    it('should return the genre ID for a given genre name', async () => {
      DB.Genre.findOne.mockResolvedValue({ id: 1 });
      const genreId = await getGenreIdByName('Action');
      expect(genreId).toEqual(1);
    });

    it('should handle errors', async () => {
      DB.Genre.findOne.mockRejectedValue(new Error('Error finding genre'));
      await expect(getGenreIdByName('InvalidGenre')).rejects.toThrow('Error finding genre');
    });
  });

  // Test for processMovies()
  describe('processMovies', () => {
    it('should process movies correctly', async () => {
      axios.get.mockResolvedValueOnce({ data: { Search: [{ Title: 'Movie1' }] } }) 
          .mockResolvedValueOnce({ data: { Genre: 'Action' } }); 
      DB.Genre.findOne.mockResolvedValue({ id: 1 }); 
      DB.Movie.findOrCreate.mockResolvedValue([{}, true]); 

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await processMovies(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Traitement terminé avec succès');
    });

    it('should handle errors', async () => {
      axios.get.mockRejectedValue(new Error('Error processing movies'));
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await processMovies(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Erreur interne du serveur');
    });
  });
});
