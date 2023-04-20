const Tour = require("../../models/tour/tourModel");
const APIFeatures = require("../../utils/apiFeatures");
const catchAsync = require("../../utils/catchAsync");
const appError = require("../../utils/appError");

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";
    next();
}

exports.getAllTours = catchAsync(async (req, res, next) => {

    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFIleds().pagination();
    const trousList = await features.query;

    res.status(200).json({
        status: "Success",
        results: trousList.length,
        data: {
            trousList
        }
    });
})

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id); //Tour.FindOne({ _id: req.params.id }) is the same thing

    if (!tour) {
        return next(new appError("No tour found with that ID", 404))
    }

    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        data: {
            tour
        }
    });
})

exports.postTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            tour: newTour
        }
    });
})

exports.patchTour = catchAsync(async (req, res, next) => {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        returnValidators: true
    })

    if (!tour) {
        return next(new appError("No tour found with that ID", 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
        return next(new appError("No tour found with that ID", 404))
    }

    return res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getTourStats = catchAsync(async (req, res, next) => {

    const stats = await Tour.aggregate([
        {
            $match: {
                ratingsAverage: { $gte: 4.5 }
            }
        },
        {
            $group: {
                _id: { $toUpper: "$difficulty" },
                numTours: { $sum: 1 },
                numbRatings: { $sum: "$ratingsAverage" },
                avgRating: { $avg: "$ratingsAverage" },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" }
            }
        },
        {
            $sort: {
                avgPrice: 1
            }
        }
        // {
        //     $match: {
        //         _id: { $ne: "EASY" }
        //     }
        // }
    ]);

    res.status(200).json({
        status: "success",
        data: {
            stats
        }
    })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {

    const year = parseInt(req.params.year);
    const plan = await Tour.aggregate([
        {
            $unwind: "$startDates"
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: "$startDates" },
                numTourStarts: { $sum: 1 },
                tours: { $push: "$name" }
            }
        },
        {
            $addFields: {
                month: "$_id"
            }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: {
                numTourStarts: -1
            }
        }
        // {
        //     $limit: 12
        // }
    ]);

    res.status(200).json({
        status: "success",
        data: {
            plan
        }
    })
})