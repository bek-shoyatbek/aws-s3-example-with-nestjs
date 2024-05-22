import { memoryStorage } from 'multer';

export const STORAGE = memoryStorage(); // ! We are using memory storage due to having buffer property in request file object
