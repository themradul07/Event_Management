const EventModel = require('../models/Event');
const UserModel = require('../models/User');
const Upload = require('../helpers/upload');
const { EventAlert } = require('../utils/email');
const logger = require('../utils/logger');

const getEvents = async (req, res) => {
    try {
        const allEvents = await EventModel.find({});
        return res.status(200).json(allEvents);
    } catch (error) {
        logger.error("Error getting events: %o", error);
        return res.status(500).json({ success: false, error: "Failed to retrieve events" });
    }
};

const checkParticipation = async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.user.id });
        const eventTitle = req.params.event;

        if (!user) {
            return res.status(404).json({ value: false, error: "User not found" });
        }

        const value = user.participated.findIndex(e => e.title === eventTitle);
        return res.status(200).json({ participated: value !== -1 });
    } catch (error) {
        logger.error(`Error checking participation for user ${req.user?.id} on event ${req.params.event}: %o`, error);
        return res.status(500).json({ error: "Server error checking participation" });
    }
};

const getEventByTitle = async (req, res) => {
    try {
        const events = await EventModel.find({ title: req.params.title });
        return res.status(200).json(events);
    } catch (error) {
        logger.error(`Error getting event details for title ${req.params.title}: %o`, error);
        return res.status(500).json({ error: "Server error getting event details" });
    }
};

const registerForEvent = async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.user.id });
        const event = await EventModel.findOne({ title: req.params.title });

        if (!user || !event) {
            return res.status(404).json({ error: "User or Event not found" });
        }

        // Validate membership for exclusive events
        if (event.isExclusive) {
            const hasActiveMembership = user.isMember && user.membershipExpiresAt && new Date(user.membershipExpiresAt) > new Date();
            if (!hasActiveMembership) {
                return res.status(403).json({ error: "Access denied. This event is exclusive to BIETHUB Premium members." });
            }
        }

        user.participated.push({ title: event.title });
        await user.save();

        event.participants.push({ name: user.name, id: user.id });
        await event.save();

        return res.status(200).json({ task: true });
    } catch (error) {
        logger.error(`Error registering user ${req.user?.id} for event ${req.params.title}: %o`, error);
        return res.status(500).json({ error: "Server error registering for event" });
    }
};

const createEvent = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ succes: false, msg: "No image file provided" });
        }
        
        const uploadResult = await Upload.uploadFile(req.file.path);
        req.body.img = uploadResult.secure_url;

        // Make sure amounts and numeric fields are handled correctly
        if (req.body.amount) {
            req.body.amount = Number(req.body.amount);
        }
        if (req.body.isPaid) {
            req.body.isPaid = req.body.isPaid === "true" || req.body.isPaid === true;
        }

        if (req.body.isExclusive) {
            req.body.isExclusive = req.body.isExclusive === "true" || req.body.isExclusive === true || req.body.isExclusive === "on";
        } else {
            req.body.isExclusive = false;
        }

        const newEvent = await EventModel.create(req.body);
        const emails = await UserModel.find({}, "email");

        // Send alert emails
        emails.forEach(async (e) => {
            if (e.email) {
                await EventAlert(e.email, newEvent.title, newEvent.date, newEvent.venue);
            }
        });

        return res.status(201).json({ success: true, message: "Event created successfully", event: newEvent });
    } catch (error) {
        logger.error("Error creating event: %o", error);
        return res.status(500).json({ succes: false, msg: error.message });
    }
};

module.exports = {
    getEvents,
    checkParticipation,
    getEventByTitle,
    registerForEvent,
    createEvent,
};
