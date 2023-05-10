import './App.css';
import Home from "../pages/Home";
import { Route, Routes, Navigate} from "react-router-dom";
import About from '../pages/About';
import Contact from '../pages/Contact';
import MainLayout from '../layouts/MainLayout';
import UserList from "../pages/UserList"
import UserDelete from 'pages/UserDelete';
import UserCreate from 'pages/UserCreate';
import AddNewOrder from 'pages/NewOrder';
import GetAll from 'pages/GetAll';
import GetOne from 'pages/GetOrder';
import OrderDelete from 'pages/DeleteOrder';
import UpdateOrderPage from 'pages/UpdateOrder';
import Orders from 'pages/Orders';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path ="/" element ={<MainLayout/>}>
          <Route index element = {<Home />}/>
          <Route path="about" element = {<About />}/>
          <Route path="contact" element = {<Contact />}/>
          <Route path="userlist" element = {<UserList />}/>
          <Route path="userdelete" element ={<UserDelete />}/>
          <Route path="usercreate" element ={<UserCreate />}/>
          <Route path='/orders' element={<Orders/>}/>
          <Route path='/add' element={<AddNewOrder/>}/> 
          <Route path='/getone'element={<GetOne/>}/> 
          <Route path='/getall' element={<GetAll/>}/> 
          <Route path='/update' element={<UpdateOrderPage/>}/> 
          <Route path='/delete' element={<OrderDelete/>}/>
        </Route>
        <Route path ="*" element = {<Navigate to="/" />}/>
        </Routes>
    </div>
  );
}

export default App;
