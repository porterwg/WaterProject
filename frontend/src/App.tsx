import ProjectList from './ProjectList';
import './App.css';
import CookieConsent from 'react-cookie-consent';
import Fingerprint from './Fingerprint';

function App() {
  return (
    <>
      <ProjectList />
      <CookieConsent>
        This website uses cookies to enhance the user experience.
      </CookieConsent>
      <Fingerprint />
    </>
  );
}

export default App;
