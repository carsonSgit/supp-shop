import { AddUser } from "./AddUser";
import { AllUsers } from "./AllUsers";
import { SingleUser} from "./SingleUser";
import { UpdateUser } from "./UpdateUser";
import { DeleteUser } from "./DeleteUser";
import styles from './Main.css';
import "./Card.css";

/** Main component for our main page */
function Main(){
    return(
        <div className={styles.container}>
            <SingleUser />
        </div>
    );
}

export default Main;