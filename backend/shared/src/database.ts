import mongoose from "mongoose";

export class Database {
    private static instance: Database;
    private isConnected: boolean = false;

    private constructor() {}

    public static getInstance() : Database {
        if(!Database.instance){
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connect(mongoUrl: string): Promise<void> {
    if (this.isConnected) {
      console.log('Already connected to database');
      return;
    }

    try {
      await mongoose.connect(mongoUrl);
      this.isConnected = true;
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    await mongoose.disconnect();
    this.isConnected = false;
    console.log('🔌 Disconnected from MongoDB');
  }
  
}