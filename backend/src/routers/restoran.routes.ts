import express from 'express'
import { RestoranController } from '../controllers/restoran.controller'

const restoranRouter=express.Router()


restoranRouter.route("/addRestaurant").post(
    (req,res)=>new RestoranController().addRestaurant(req,res)
)

restoranRouter.route("/getAllRestaurants").get(
    (req,res)=>new RestoranController().getAllRestaurants(req,res)
)

restoranRouter.route("/getRestaurant/:r").get(
    (req,res)=>new RestoranController().getRestaurant(req,res)
)

restoranRouter.route("/makeOrder").post(
    (req,res)=>new RestoranController().makeOrder(req,res)
)

restoranRouter.route("/getAllOrders/:k").get(
    (req,res)=>new RestoranController().getAllOrdersForUser(req,res)
)

restoranRouter.route("/getAllOrdersForRestaurant/:r").get(
    (req,res)=>new RestoranController().getAllOrdersFromRestaurnt(req,res)
)

restoranRouter.route("/updateOrder").post(
    (req,res)=>new RestoranController().updateOrder(req,res)
)

restoranRouter.route("/makeReservation").post(
    (req,res)=>new RestoranController().makeReservation(req,res)
)

restoranRouter.route("/getAllReservationsForUser/:k").get(
    (req,res)=>new RestoranController().getAllReservationsForUser(req,res)
)

restoranRouter.route("/getAllReservations").get(
    (req,res)=>new RestoranController().getAllReservations(req,res)
)

restoranRouter.route("/acceptReservation").post(
    (req,res)=>new RestoranController().acceptReservation(req,res)
)

restoranRouter.route("/declineReservation").post(
    (req,res)=>new RestoranController().declineReservation(req,res)
)

restoranRouter.route("/submitAppereance").post(
    (req,res)=>new RestoranController().submitAppeareance(req,res)
)

restoranRouter.route("/addMealToRestaurant").post(
    (req,res)=>new RestoranController().addMealToRestaurant(req,res)
)

restoranRouter.route("/deleteReservation").post(
    (req,res)=>new RestoranController().deleteReservation(req,res)
)

restoranRouter.route("/commentAndRating").post(
    (req,res)=>new RestoranController().commentAndRating(req,res)
)
export default restoranRouter