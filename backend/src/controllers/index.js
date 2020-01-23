import {makeSaveTempUser, makeSigninUser, makeVerifyUser} from "./userController";
import {userService} from "../usecases"

const {saveTempUser, verifyUser, signinUser} = userService;

const saveUserController = makeSaveTempUser({ saveTempUserUsecase: saveTempUser });
const verifyUserController = makeVerifyUser({ verifyUserUsecase: verifyUser });
const signinUserController = makeSigninUser({ signinUserUsecase: signinUser });

export const userController = Object.freeze({
    saveUserController,
    verifyUserController,
    signinUserController
});