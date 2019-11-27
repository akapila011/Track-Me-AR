import {makeSaveTempUser, makeVerifyUser} from "./userController";
import {userService} from "../usecases"

const {saveTempUser, verifyUserEmail} = userService;

const saveUserController = makeSaveTempUser({ saveTempUser });
const verifyUserController = makeVerifyUser({ verifyUserEmail });

export const userController = Object.freeze({
    saveUserController,
    verifyUserController
});