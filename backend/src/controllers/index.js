import {makeSaveTempUser, makeSigninUser, makeVerifyUser} from "./userController";
import {locationService, userService} from "../usecases"
import {makeStartTracking, makeStopTracking, makeTrackLocation} from "./locationController";

const {saveTempUser, verifyUser, signinUser} = userService;
const {startTrackingUsecase, trackLocationUsecase, stopTrackingUsecase} = locationService;

const saveUserController = makeSaveTempUser({ saveTempUserUsecase: saveTempUser });
const verifyUserController = makeVerifyUser({ verifyUserUsecase: verifyUser });
const signinUserController = makeSigninUser({ signinUserUsecase: signinUser });

const trackLocationController = makeTrackLocation({trackLocationUsecase});
const startTrackingController = makeStartTracking({startTrackingUsecase});
const stopTrackingController = makeStopTracking({stopTrackingUsecase});

export const userController = Object.freeze({
    saveUserController,
    verifyUserController,
    signinUserController
});

export const locationController = Object.freeze({
    trackLocationController,
    startTrackingController,
    stopTrackingController
});