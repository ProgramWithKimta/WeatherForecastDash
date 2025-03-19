import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // TODO: GET weather data from city name
  const { name, id } = req.body;
  if (req.body) {
    await WeatherService.getWeatherForCity(name);
    res.json('City Added');
  } else {
    res.send('Error finding city');
  }
  // TODO: save city to search history
  await HistoryService.addCity(name, id);
});

// // TODO: GET search history
// router.get('/history', async (req, res) => {});

// // * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req, res) => {});

export default router;
