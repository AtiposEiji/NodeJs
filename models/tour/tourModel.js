const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require("../user/userModel")

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        trim: true
        // maxLength: [40, "A tour must have less or equal than 40 characters"],
        // minlength: [10, "A tour must have more or equal than 10 characters"]
    },
    duration: {
        type: Number,
        required: [true, "A tour must have a duration"]
    },
    slug: String,
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a maximum group size"]
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have a difficulty"],
        enum: {
            values: ["easy", "medium", "difficult"],
            message: "Difficulty is either 'easy, medium or difficult"
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be between 1 and 5"],
        max: [5, "Rating must be between 1 and 5"],
        set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                // This only points to current doc on NEW document creation
                return val < this.price;
            },
            message: "Discount price  should be below the regular price"
        }
    },
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: [true, "A tour must have a description"]
    },
    imageCover: {
        type: String,
        required: [true, "A tour must have a cover image"]
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        //GeoJSON
        type: {
            type: String,
            default: "Point",
            enum: ["Point"]
        },
        coordinates: [Number],
        address: {
            type: String
        },
        description: {
            type: String
        }
    },
    locations: [{
        type: {
            type: String,
            default: "Point",
            enum: ["Point"]
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
    }],
    // EMBEDDING
    // guides: Array
    // CHILD REFERENCING
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ]
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

// tourSchema.index({price: 1});
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

// The get is a getter. It return data only while you get the data.
tourSchema.virtual("durationWeeks").get(function () {
    return this.duration / 7;
})

// Virtual populate
tourSchema.virtual("reviews", {
    ref: "Review",
    foreignField: "tour",
    localField: "_id"
})

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre("save", function (next) {
    console.log("Will save document...");
    next();
});

// EMBEDDING 
// tourSchema.pre("save", async function (next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guideesPromises);
//     next();
// })

// tourSchema.pre("save", function (next) {
//     this.slug = slugify(this.name, { lower: true });
//     next();
// });

// tourSchema.post("save", function (doc, next) {
//     console.log(doc);
//     next();
// })

//QUERY MIDDLEWARE: process the query
tourSchema.pre(/^find/, function (next) {
    this.find({
        secretTourId: {
            $ne: true
        }
    });
    this.start = Date.now();
    next();
})

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start}ms`)
    next();
});

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: "guides", 
        select: "-__v -passwordChangedAt"
    }); 

    next();
})

//AGGREGATION MIDDLEWARE
// tourSchema.pre("aggregate", function (next) {
//     this.pipeline().unshift({
//         $match: {
//             secretTour: {
//                 $ne: true
//             }
//         }
//     })
//     next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;