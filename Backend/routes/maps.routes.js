
import express from "express";
import { query } from "express-validator";
import { authUser } from "../middleware/auth.middleware.js";
import { getCoordinates, getDistTime, getSuggestions } from "../controllers/map.controller.js";


const Maprouter = express.Router()

Maprouter.get('/get-coordinates', authUser, getCoordinates)

Maprouter.get("/get-distance-time",authUser, getDistTime)

Maprouter.get('/get-suggestions',query('input'),authUser,getSuggestions)


export default Maprouter


