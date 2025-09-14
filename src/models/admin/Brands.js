import mongoose from 'mongoose'


const { Schema } = mongoose;

const brandsSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    logo: { type: String, },
    logoPublicId: { type: String },
    description: {
        type: String,
        trim: true,
        maxlength: [300, 'description should be under 100 characters']
    },
    fromTheBrand: {
        type: String,
        maxlength: [500, 'Content should be under 200 characters']
    }
}, {
    timestamps: true,
});

const Brands = mongoose.model('Brands', brandsSchema)
export default Brands;