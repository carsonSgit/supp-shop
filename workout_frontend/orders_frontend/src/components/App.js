import './App.css';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Orders from 'pages/Orders';
import AddOrderPage from 'pages/AddOrderPage';
import GetOrderPage from 'pages/GetOrder';
import UpdateOrderPage from 'pages/UpdateOrderPage';
import GetAllOrders from  'pages/GetAllOrders';
import DeleteOrderPage from 'pages/DeleteOrderPage';
import { Router } from 'express';

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element ={<Home />}/>
            <Route path="about/:employee" element={<About />}/>
            <Route path="contact" element={<Contact />}/>
            <Route path='orders' element={<Orders/>}/>
             <Route path='addorder' element={<AddOrderPage/>}/> 
             <Route path='getorder'element={<GetOrderPage/>}/> 
             <Route path='allorders' element={<GetAllOrders/>}/> 
             <Route path='update' element={<UpdateOrderPage/>}/> 
             <Route path='delete' element={<DeleteOrderPage/>}/> 
          </Route>
          <Route path="*" element={<p>Invalid URL</p>} />
      </Routes>
      
    </div>
  );
}

export default App;
