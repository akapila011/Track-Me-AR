// import {makeSaveUser} from "./save-user";
import {usersDb, usersTempDb, credentialsDb, locationsDb, trackingSessionsDb} from "../data";
import {makeVerifyUser} from "./verify-user";
import {makeSaveTempUser} from "./save-temp-user";
import {codeGenerator, hashing} from "../util/util";
import createCredential from "../entities/Credential";
import {makeCreateCredential} from "./create-credential";
import createTempUser from "../entities/TempUser";
import {makeSignInUserUsecase} from "./sign-in-user";
const jwt = require('jsonwebtoken');
import {getJwtSecretKey} from "../util/config";
import {makeTrackLocationUsecase} from "./track-location";
import createLocation from "../entities/Location";
import {makeStartTrackingUsecase} from "./start-tracking";
import createTrackingSession from "../entities/TrackingSession";
import {durationValidation} from "../util/validators";
import {makeStopTrackingUsecase} from "./stop-tracking";
import {makeFindTrackingSessionUsecase} from "./find-tracking-session";
import {makeValidateTrackSession} from "./validate-track-session";
import {producer} from "../broker/LocationBroker";
import {makeFindSessionsByDateUser} from "./find-sessions-by-date-user";


// const saveUser = makeSaveUser({usersTempDb});
const saveTempUser = makeSaveTempUser({usersTempDb, codeGenerator, usersDb});
const saveCredential = makeCreateCredential({credentialsDb, createCredential, usersDb});
const verifyUser = makeVerifyUser({usersTempDb, usersDb, createTempUser, createCredential, saveCredential});
const signinUser = makeSignInUserUsecase({usersDb, credentialsDb, hashing, jwtSign: jwt, jwtSecretKey: getJwtSecretKey()});

const trackLocation = makeTrackLocationUsecase({locationsDb, createLocation, trackingSessionsDb, publisher: producer});
const startTracking = makeStartTrackingUsecase({trackingSessionsDb, createTrackingSession , locationsDb, createLocation,
    trackLocationUsecase: trackLocation, durationValidation, codeGenerator});
const stopTracking = makeStopTrackingUsecase({trackingSessionsDb});
const findTrackingSession = makeFindTrackingSessionUsecase({trackingSessionsDb});
const validateTrackSession = makeValidateTrackSession({trackingSessionsDb, locationsDb});

const findSessionsByDateUser = makeFindSessionsByDateUser({trackingSessionsDb, locationsDb});

export const userService = Object.freeze({
  saveTempUser: saveTempUser,
    verifyUser: verifyUser,
    signinUser: signinUser
});

export const locationService = Object.freeze({
    trackLocationUsecase: trackLocation,
    startTrackingUsecase: startTracking,
    stopTrackingUsecase: stopTracking,
    findTrackingSessionUsecase: findTrackingSession,
    validateTrackSessionUsecase: validateTrackSession
});

export const historyService = Object.freeze({
    findSessionsByDateUserUsecase: findSessionsByDateUser,
});