import './App.css';
import Header from './components/Header';
import Home from './screens/Home';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="content">
        <div className="container">
          <Home />
        </div>
      </div>
    </div>
  );
}

export default App;
