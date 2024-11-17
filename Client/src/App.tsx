import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./Pages/home";
import { Login, Signup } from "./Pages/Auth";
import { Dashboard } from "./Pages/dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route index element={<TODO />} /> */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
