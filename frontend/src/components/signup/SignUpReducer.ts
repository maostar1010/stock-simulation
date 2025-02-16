import {
  CREATE_USER_ERROR,
  CREATE_USER_SUBMITTED,
  CREATE_USER_SUCCESS,
} from "./SignUpTypes";

// Define the shape of the signup state
interface SignupState {
  usernameError: string;
  passwordError: string;
  isSubmitted: boolean;
}

// Define action types
interface CreateUserSubmittedAction {
  type: typeof CREATE_USER_SUBMITTED;
}

interface CreateUserErrorAction {
  type: typeof CREATE_USER_ERROR;
  errorData: {
    username?: string;
    password?: string;
  };
}

interface CreateUserSuccessAction {
  type: typeof CREATE_USER_SUCCESS;
}

// Combine all possible action types
type SignupAction =
  | CreateUserSubmittedAction
  | CreateUserErrorAction
  | CreateUserSuccessAction;

// Define the initial state of the signup store
const initialState: SignupState = {
  usernameError: "",
  passwordError: "",
  isSubmitted: false,
};

// Define how action will change the state of the store
export const signupReducer = (
  state = initialState,
  action: SignupAction
): SignupState => {
  switch (action.type) {
    case CREATE_USER_SUBMITTED:
      return {
        ...state,
        usernameError: "",
        passwordError: "",
        isSubmitted: true,
      };
    case CREATE_USER_ERROR:
      return {
        ...state,
        usernameError: action.errorData.username || "",
        passwordError: action.errorData.password || "",
        isSubmitted: false,
      };
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        usernameError: "",
        passwordError: "",
        isSubmitted: false,
      };
    default:
      return state;
  }
};
