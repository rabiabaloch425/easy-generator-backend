import * as mongoose from 'mongoose';

const rolesEnum = ['ADMIN', 'USER']; 

export const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  // Corrected the typo here
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    roles: {
        type: [String], 
        enum: rolesEnum, 
        default: ['USER']
    },
    passwordHash: {
        type: String,
        required: true
    }
});
