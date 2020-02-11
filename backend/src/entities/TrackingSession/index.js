import {idValidator} from "../../util/validators";
import {buildCreateTrackingSession} from "./TrackingSession";

const createTrackingSession = buildCreateTrackingSession({uuidValidator: idValidator});

export default createTrackingSession;