import {makeSaveTempUser, makeSigninUser, makeVerifyUser} from "./userController";
import {historyService, locationService, userService} from "../usecases"
import {makeFindTrackingSession, makeStartTracking, makeStopTracking, makeTrackLocation} from "./locationController";
import {makeFindSessionsByDateUser} from "./historyController";

const {saveTempUser, verifyUser, signinUser} = userService;
const {startTrackingUsecase, trackLocationUsecase, stopTrackingUsecase, findTrackingSessionUsecase} = locationService;
const {findSessionsByDateUserUsecase} = historyService;

const saveUserController = makeSaveTempUser({ saveTempUserUsecase: saveTempUser });
const verifyUserController = makeVerifyUser({ verifyUserUsecase: verifyUser });
const signinUserController = makeSigninUser({ signinUserUsecase: signinUser });

const trackLocationController = makeTrackLocation({trackLocationUsecase});
const startTrackingController = makeStartTracking({startTrackingUsecase});
const stopTrackingController = makeStopTracking({stopTrackingUsecase});
const findTrackingSessionController = makeFindTrackingSession({findTrackingSessionUsecase});

const findSessionsByDateUserController = makeFindSessionsByDateUser({findSessionsByDateUserUsecase});

export const userController = Object.freeze({
    saveUserController,
    verifyUserController,
    signinUserController
});

export const locationController = Object.freeze({
    trackLocationController,
    startTrackingController,
    stopTrackingController,
    findTrackingSessionController
});

export const historyController = Object.freeze({
    findSessionsByDateUserController
});