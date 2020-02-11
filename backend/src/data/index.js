import {makeUsersDb} from "./users-db";
import {makeUsersTempDb} from "./users-temp-db";
import {makeCredentialsDb} from './credentials-db';

import {CredentialModel} from '../models/CredentialModel';
import {UserModel} from '../models/UserModel';
import {TempUserModel} from '../models/TempUserModel';
import {LocationModel} from "../models/LocationModel";
import {makeLocationDb} from "./location-db";
import {makeTrackingSessionsDb} from "./tracking-session-db";
import {TrackingSessionModel} from "../models/TrackingSessionModel";

export const usersDb = makeUsersDb({UserModel});
export const usersTempDb = makeUsersTempDb({TempUserModel});
export const credentialsDb = makeCredentialsDb({CredentialModel});
export const locationsDb = makeLocationDb({LocationModel});
export const trackingSessionsDb = makeTrackingSessionsDb({TrackingSessionModel});

