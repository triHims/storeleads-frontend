import 'bootstrap/dist/css/bootstrap.min.css';
import { MainScreen } from './components/MainScreen/MainScreen';

const bodyContainer = {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    height: "100vh",
    backgroundColor: "black",
}

function App() {

    return (
        <>
            <div className="App" style={bodyContainer}>
                <MainScreen />
            </div>
        </>
    );
}

export default App;
