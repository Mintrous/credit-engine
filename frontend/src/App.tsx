import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CreditProvider } from './context/CreditContext';
import { Home } from './pages/Home/Home';
import { PersonForm } from './pages/PersonForm/PersonForm';
import { CompanyForm } from './pages/CompanyForm/CompanyForm';
import { Result } from './pages/Result/Result';
import { History } from './pages/History/History';
import './styles.css';

export default function App() {
  return (
    <BrowserRouter>
      <CreditProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/person" element={<PersonForm />} />
          <Route path="/company" element={<CompanyForm />} />
          <Route path="/result" element={<Result />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </CreditProvider>
    </BrowserRouter>
  );
}
