const Tour = require("../../models/tour/tourModel");
const APIFeatures = require("../../utils/apiFeatures");

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";
    next();
}

exports.getAllTours = async (req, res) => {

    try {
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
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }

}

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id); //Tour.FindOne({ _id: req.params.id }) is the same thing

        res.status(200).json({
            status: "success",
            requestedAt: req.requestTime,
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
}

exports.postTour = async (req, res) => {

    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Invalid data sent!"
        })
    }
}

exports.patchTour = async (req, res) => {

    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            returnValidators: true
        })

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
}

exports.deleteTour = async (req, res) => {

    try {
        await Tour.findByIdAndDelete(req.params.id);
        return res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
}

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: "$difficulty",
                    numTours: { $sum: 1 },
                    numbRatings: { $sum: "$ratingsAverage" },
                    avgRating: { $avg: "$ratingsAverage" },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" }
                }
            }
        ]);

        res.status(200).json({
            status: "success",
            data: {
                stats
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
}