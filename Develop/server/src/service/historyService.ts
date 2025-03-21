import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id?: string) {
    this.id = id || Date.now().toString();
    this.name = name
  }
};

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFile('db/searchHistory.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile('db/searchHistory.json', JSON.stringify(cities, null, '\t'));
   }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCity: City[];
      try {
        parsedCity = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCity =[];
      }
      return parsedCity;
    });
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(
    name: string,
    id: string
  ) {
    if (!name) {
      throw new Error('City name can not be blank');
    }

    const newCity: City = { name: name, id: uuidv4() };

    return await this.getCities()
    .then((cities) => {
      return [...cities, newCity];
    })
    .then((updatedCities) => this.write(updatedCities)).then(() => newCity);
  }
}

export default new HistoryService();