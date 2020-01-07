import {makeSaveTempUser, makeVerifyUser} from "./userController";
import {userService} from "../usecases"

const {saveTempUser, verifyUser} = userService;

const saveUserController = makeSaveTempUser({ saveTempUserUsecase: saveTempUser });
const verifyUserController = makeVerifyUser({ verifyUser });

export const userController = Object.freeze({
    saveUserController,
    verifyUserController
});