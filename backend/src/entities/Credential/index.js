import {passwordValidator} from "../../util/validators";
import {hashing} from "../../util/util";
import {buildCreateCredential} from "./Credential";

const createCredential = buildCreateCredential({ passwordValidator, hashing});

export default createCredential;