import {
  ASYNC_ACTION_START,
  ASYNC_ACTION_FINISH,
  ASYNC_ACTION_ERROR
} from "./asyncConstants";
import { createReducer } from "../../app/common/utill/reducerUtils.js";

const initialState = {
  loading: false,
  elementName: null
};
const asyncActionStart = (state, payload) => {
  return {
    ...state,
    loading: true,
    elementName: payload
  };
};
const asyncActionFinish = state => {
  return {
    ...state,
    loading: false,
    elementName: null
  };
};
const asyncActionError = state => {
  return {
    ...state,
    loading: false,
    elementName: null
  };
};

export default createReducer(initialState, {
  [ASYNC_ACTION_START]: asyncActionStart,
  [ASYNC_ACTION_FINISH]: asyncActionFinish,
  [ASYNC_ACTION_ERROR]: asyncActionError
});
