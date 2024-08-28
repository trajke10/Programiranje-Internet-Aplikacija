import express from 'express'
import { UserController } from '../controllers/user.controller'


const userRouter=express.Router()

userRouter.route("/login").post(
    (req,res)=>new UserController().login(req,res)
)

userRouter.route("/alogin").post(
    (req,res)=>new UserController().alogin(req,res)
)

userRouter.route("/register").post(
    (req,res)=>new UserController().register(req,res)
)

userRouter.route("/changePassword").post(
    (req,res)=>new UserController().changePassword(req,res)
)

userRouter.route("/changePasswordAfterSecurity").post(
    (req,res)=>new UserController().changePasswordAfterSecurityQuestion(req,res)
)

userRouter.route("/getUserByUsername").post(
    (req,res)=>new UserController().getUserByUsername(req,res)
)

userRouter.route("/getAllUsers").get(
    (req,res)=>new UserController().getAllUsers(req,res)
)

userRouter.route("/getAllWaiters").get(
    (req,res)=>new UserController().getAllWaiters(req,res)
)

userRouter.route("/changeInfo").post(
    (req,res)=>new UserController().changeInfo(req,res)
)

userRouter.route("/blockUser").post(
    (req,res)=>new UserController().blockUser(req,res)
)

userRouter.route("/unblockUser").post(
    (req,res)=>new UserController().unblockUser(req,res)
)

userRouter.route("/getAllRequests").get(
    (req,res)=>new UserController().getAllRequests(req,res)
)

userRouter.route("/acceptUser").post(
    (req,res)=>new UserController().acceptUser(req,res)
)

userRouter.route("/declineUser").post(
    (req,res)=>new UserController().declineUser(req,res)
)

userRouter.route("/addWaiter").post(
    (req,res)=>new UserController().addWaiter(req,res)
)

userRouter.route("/getNumberOfGuests").get(
    (req,res)=>new UserController().getNumberOfGuests(req,res)
)

userRouter.route("/changeProfilePicture").post(
    (req,res)=>new UserController().changeProfilePicture(req,res)
)

userRouter.route("/incrementNoAppereance").post(
    (req,res)=>new UserController().incrementNoAppereance(req,res)
)

userRouter.route("/findInBlockedUsers").post(
    (req,res)=>new UserController().findInBlockedUsers(req,res)
)


export default userRouter