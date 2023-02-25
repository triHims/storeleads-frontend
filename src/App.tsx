import "bootstrap/dist/css/bootstrap.min.css";
import { MainScreen } from "./components/MainScreen/MainScreen";
import { RouterScreen } from "./components/MainScreen/RouterScreen";

const bodyContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "stretch",
  height: "100vh",
  width: "100vw",
  backgroundColor: "#202123",
};

/* App Calls Router screen that sets everthing up including the main screen */
/* greetings and other app logic  */

function App() {
  return (
      <div className="App" style={bodyContainer}>
        <RouterScreen />
      </div>
  );
}

export default App;
