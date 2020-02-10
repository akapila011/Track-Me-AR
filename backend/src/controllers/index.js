import {makeSaveTempUser, makeSigninUser, makeVerifyUser} from "./userController";
import {locationService, userService} from "../usecases"
import {makeTrackLocation} from "./locationController";

const {saveTempUser, verifyUser, signinUser} = userService;
const {trackLocationUsecase} = locationService;

const saveUserController = makeSaveTempUser({ saveTempUserUsecase: saveTempUser });
const verifyUserController = makeVerifyUser({ verifyUserUsecase: verifyUser });
const signinUserController = makeSigninUser({ signinUserUsecase: signinUser });

const trackLocationController = makeTrackLocation({trackLocationUsecase});

export const userController = Object.freeze({
    saveUserController,
    verifyUserController,
    signinUserController
});

export const locationController = Object.freeze({
    trackLocationController
});