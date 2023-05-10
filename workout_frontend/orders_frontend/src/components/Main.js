import { GetSingleOrder } from "./SingleOrder";
import {AllOrders} from "./AllOrders";
import { AddOrder } from "./AddOrder";
import { UpdateOrder } from "./UpdateOrder";
import Menu from "./Menu";
function Main() {
  


    return( <div>
        <p>Hello welcome to Home</p>
        <ErrorBoundary fallback={<h1>Something went wrong</h1>}>
            <Menu/>
        </ErrorBoundary>
    </div>);
}


export default Main;