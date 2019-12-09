import {passwordValidator} from "../../util/validators";
import {hashing} from "../../util";
import {buildCreateCredential} from "./Credential";

const createCredential = buildCreateCredential({ passwordValidator, hashing});

export default createCredential;