import './App.css';
import Home from "../pages/Home";
import { Route, Routes, Navigate} from "react-router-dom";
import About from '../pages/About';
import Contact from '../pages/Contact';
import MainLayout from '../layouts/MainLayout';
import UserList from "../pages/UserList"
import UserDelete from 'pages/UserDelete';
import UserCreate from 'pages/UserCreate';

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
        </Route>
        <Route path ="*" element = {<Navigate to="/" />}/>
        </Routes>
    </div>
  );
}

export default App;
