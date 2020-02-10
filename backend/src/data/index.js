import {makeUsersDb} from "./users-db";
import {makeUsersTempDb} from "./users-temp-db";
import {makeCredentialsDb} from './credentials-db';

import {CredentialModel} from '../models/CredentialModel';
import {UserModel} from '../models/UserModel';
import {TempUserModel} from '../models/TempUserModel';
import {LocationModel} from "../models/LocationModel";
import {makeLocationDb} from "./location-db";

export const usersDb = makeUsersDb({UserModel});
export const usersTempDb = makeUsersTempDb({TempUserModel});
export const credentialsDb = makeCredentialsDb({CredentialModel});
export const locationsDb = makeLocationDb({LocationModel});

