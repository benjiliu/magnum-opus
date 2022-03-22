import {Helmet} from "react-helmet";

import Canvas from "./components/Canvas";
import { SocketProvider } from "./context/SocketContext";
import "./styles.css";

export default function App() {
  return (
      <SocketProvider>
        <Helmet title="Magnum Opus" />
        <Canvas />
      </SocketProvider>
  );
}
