import Airtable from 'airtable';

class AirtableService {
  private base: any;

  constructor() {
    Airtable.configure({
      apiKey: process.env.AIRTABLE_API_KEY
    });
    this.base = Airtable.base(process.env.AIRTABLE_BASE_ID!);
  }

  async createEpisodeRecord(data: any) {
    return new Promise((resolve, reject) => {
      this.base('Episodes').create(data, (err, record) => {
        if (err) reject(err);
        resolve(record);
      });
    });
  }
}

export default new AirtableService();
