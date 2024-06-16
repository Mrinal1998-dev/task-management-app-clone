import * as SecureStore from "expo-secure-store";
import {restoreToken} from "../../actions/authActions"
import { extractFirstName, fetchLoggedInUserTasks } from "../utils";

async function bootstrapAsync(dispatch, setLoggedInName, setLoggedInEmail, setLoggedInUserTasks,
                              setLoggedInFirstName, setTodayTasksList, setUpcomingTasksList){

    let database, k = 0;
    let userToken;

    try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        database = await SecureStore.getItemAsync('candy_user_database');
    } catch (e) {
        // Restoring token failed
        console.log(e)
    }
    // After restoring token, we may need to validate it in production apps
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if (database == null) {
        console.log('Database does not exist');
        userToken = null;
    } else {
        console.log('Database exists');
        database = JSON.parse(database);
        let loggedInName, loggedInEmail;
        for (let i = 0; i < database.length; i++) {
            if (database[i].usertoken === 'dummy-auth-token') {
                setLoggedInName(database[i].fullName);
                loggedInName = database[i].fullName;
                setLoggedInEmail(database[i].email);
                loggedInEmail = database[i].email;
                k++;
            }
        }
        if (k === 0) {
            console.log('No one is logged in');
            userToken = null;
        } else if (k === 1) {
            console.log(loggedInName + ' is logged in');
            setLoggedInFirstName(extractFirstName(loggedInName));
            userToken = 'dummy-auth-token';
            fetchLoggedInUserTasks(loggedInEmail, setLoggedInUserTasks, setTodayTasksList, setUpcomingTasksList);
        } else {
            console.log('ERROR: More than one person is logged in');
            userToken = null;
        }
    }
    dispatch(restoreToken(userToken));
}

export default bootstrapAsync;