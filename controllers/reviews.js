const Recepie = require('../models/recepie');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const recepie = await Recepie.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    recepie.reviews.push(review);
    await review.save();
    await recepie.save();
    req.flash('success', 'Thanks for providing your valuable review!');
    res.redirect(`/recepies/${recepie._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Recepie.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/recepies/${id}`);
}
