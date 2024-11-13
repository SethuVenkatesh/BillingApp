import { BrowserRouter as Router,Routes, Route, Redirect } from 'react-router-dom'; 


import LoginPage from './pages/authentication/LoginPage';
import SignUpPage from './pages/authentication/SignUpPage';
import NotFound from './pages/NotFound';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectiveRoute from './context/ProtectiveRoute';

function App() {
  return (
      <div className=''>
        <Router>
          <Routes>
            <Route 
              path='/dashboard/*' 
              element={
              <ProtectiveRoute>
                <Dashboard/>
              </ProtectiveRoute>
            }  
            />
            <Route exact path='/' element={<LoginPage/>}></Route>
            <Route exact path='/signup' element={<SignUpPage/>}></Route>
            <Route exact path='/login' element={<LoginPage/>}></Route>
            <Route path='*' element={<NotFound/>}/>
          </Routes>
        </Router>
      </div>
  );
}




export default App;
