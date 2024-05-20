import { Collection, Db, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/Users.schemas'

dotenv.config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.8xnoujx.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error', error)
      throw error
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_COLLECTION_USERS as string)
  }
}

// Xuất khẩu instance của DatabaseService.
const databaseService = new DatabaseService()
export default databaseService

// Cách sử dụng:
// databaseService.connect().catch(console.dir);
