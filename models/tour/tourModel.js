const mongoose = require("mongoose");
const slugify = require("slugify");

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
            values: ["easy", "normal", "difficult"],
            message: "Difficulty is either 'easy, medium or difficult"
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
        // min: [1, "Rating must be above 0.9"],
        // max: [5, "Rating must be below then 5.1"]
    }, 
    rataingsQuantity: {
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
    startDates: [Date] ,
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

// The get is a getter. It return data only while you get the data.
tourSchema.virtual("durationWeeks").get(function() {
    return this.duration / 7;
})

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre("save", function (next) {
    console.log("Will save document...");
    next();
});

// tourSchema.pre("save", function (next) {
//     this.slug = slugify(this.name, { lower: true });
//     next();
// });

// tourSchema.post("save", function (doc, next) {
//     console.log(doc);
//     next();
// })

//QUERY MIDDLEWARE: process the query
tourSchema.pre(/^find/, function(next) {
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
    console.log(docs);
    next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function(next){
    this.pipeline().unshift({
        $match: {
            secretTour: {
                $ne: true
            }
        }
    })
    console.log(this)
    next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;