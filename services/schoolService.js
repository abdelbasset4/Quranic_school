const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs');

const factory = require('./handelersFactory');
const apiError = require('../utils/apiError')

const School = require('../models/schoolModel')

// module.exports.createSchool = factory.createOne(School)
module.exports.createSchool =  asyncHandler(async (req, res,next) => {
    await School.create(req.body)
    req.flash("added", 'the school has been created');
    res.redirect('/dashboard/addschool')
})

module.exports.getSchools = factory.getAll(School)

module.exports.getSpecificSchool = factory.getOne(School)

module.exports.deleteSchool = factory.deleteOne(School)

module.exports.updateSchool = asyncHandler(async (req, res,next) => {
    const document = await School.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        slug: req.body.slug,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address
    }, { new: true })
    if (!document) {
        // eslint-disable-next-line new-cap
        return next(new apiError('لا يوجد حساب على هذا الرقم',404))
    }
    res.status(200).json({data:document})
})

exports.changePassword = asyncHandler(async (req, res,next) => {
    const document = await School.findByIdAndUpdate(req.params.id,{
        password : await bcrypt.hash(req.body.password,12),
        passwordChangedAt:Date.now()
    }, { new: true })
    if (!document) {
        return next(new apiError('there is not document found',404))
    }
    res.status(200).json({data:document})
})
