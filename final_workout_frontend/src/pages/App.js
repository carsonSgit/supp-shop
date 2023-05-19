import './App.css';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import AddNewOrder from 'pages/NewOrder';
import GetAll from 'pages/GetAll';
import GetOne from 'pages/GetOrder';
import OrderDelete from 'pages/DeleteOrder';
import UpdateOrderPage from 'pages/UpdateOrder';
import Orders from 'pages/Orders';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../components/Login';

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element ={<Home />}/>
            <Route path="/about/:employee" element={<About />}/>
            <Route path="/contact" element={<Contact />}/>
            <Route path='/orders' element={<Orders/>}/>
             <Route path='/add' element={<AddNewOrder/>}/> 
             <Route path='/getone' element={<GetOne/>}/> 
             <Route path='/getall' element={<GetAll/>}/> 
             <Route path='/update' element={<UpdateOrderPage/>}/> 
             <Route path='/delete' element={<OrderDelete/>}/>
             <Route path='/session/login' element={<Login/>}/>
          </Route>
          <Route path="*" element={<p>Invalid URL</p>} />
      </Routes>
      
    </div>
  );
}

export default App;
