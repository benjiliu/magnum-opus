import classNames from "classnames";
import { ChangeEvent, MouseEvent, useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import Circle from "../Circle";
import { LINE_WIDTH } from "./sizes";
import { SocketContext } from "../../context/SocketContext";

const CircleWrapper = styled.button`
  align-items: center;
  background-color: white;
  border: 1px solid #cecece;
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin: 0 4px;
  min-width: 40px;
  padding: 8px;

  &.active {
    background-color: #cecece;
  }
`;

const StrokeColourInput = styled.input`
  margin-right: 4px;
`;

const ToolbarWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TopRow = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const Canvas = () => {
  const { socket } = useContext(SocketContext)
  const canvasRef = useRef<any>(null);
  const contextRef = useRef<any>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [strokeColour, setStrokeColour] = useState("black");

  const changeStrokeColour = (event: ChangeEvent<HTMLInputElement>) => {
    setStrokeColour(event.target.value);
  };

  const clearCanvas = () => {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    const base64ImageData = canvasRef.current.toDataURL("image/png");
    socket?.emit("clear-canvas", base64ImageData)
  };

  const draw = ({ clientX, clientY }: MouseEvent) => {
    if (!isDrawing) return;

    const base64ImageData = canvasRef.current.toDataURL("image/png");
    socket?.emit("start-drawing", base64ImageData)
    
    contextRef.current.lineTo(clientX, clientY);
    contextRef.current.stroke();
  };

  const finishDrawing = () => {
    contextRef.current.closePath();

    setIsDrawing(false);
  };

  const enterCanvas = () => {
    contextRef.current.beginPath();
  };

  const startDrawing = ({ clientX, clientY }: any) => {
    contextRef.current.beginPath();
    contextRef.current.lineTo(clientX, clientY);
    contextRef.current.stroke();

    setIsDrawing(true);

    setTimeout(() => {
      const base64ImageData = canvasRef.current.toDataURL("image/png");
      socket?.emit("start-drawing", base64ImageData)
    }, 500);
  };

  const updateLineWidth = (event: number) => {
    setLineWidth(event);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight * 2 - 200;
    canvas.width = window.innerWidth * 2;
    canvas.style.height = `${window.innerHeight - 100}px`;
    canvas.style.width = `${window.innerWidth}px`;

    const context: CanvasRenderingContext2D = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    contextRef.current = context;
  }, []);

  useEffect(() => {
    if (!socket) return;

    console.log('socket', socket)

    const updateBoard = (data: any) => {
      const image = new Image();
      image.onload = () => {
        contextRef.current.drawImage(image, 0, 0, window.innerWidth, window.innerHeight - 100);
      }
      image.src = data;
    }

    const clearBoard = (data: any) => {
      const image = new Image();
      image.onload = () => {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      }
      image.src = data;
    }

    socket.on("receive-drawing", updateBoard);
    socket.on("receive-clear-canvas", clearBoard);

    return () => {
      socket.off('receive-drawing', updateBoard);
      socket.off("receive-clear-canvas", clearBoard);
    }
  }, [socket])

  useEffect(() => {
    window.addEventListener("mousedown", (event) => startDrawing(event));
    window.addEventListener("mouseup", finishDrawing);

    return () => {
      window.removeEventListener("mousedown", () => startDrawing);
      window.removeEventListener("mouseup", finishDrawing);
    };
  });

  useEffect(() => {
    contextRef.current.lineWidth = lineWidth;
    contextRef.current.strokeStyle = strokeColour;
  }, [lineWidth, strokeColour]);

  return (
    <>
      <canvas onMouseMove={draw} onMouseOver={enterCanvas} ref={canvasRef} />
      <ToolbarWrapper>
        <TopRow>
          <StrokeColourInput onChange={changeStrokeColour} type="color" />
          <CircleWrapper
            className={classNames({ active: lineWidth === LINE_WIDTH.FIVE })}
            onClick={() => updateLineWidth(LINE_WIDTH.FIVE)}
          >
            <Circle size={LINE_WIDTH.FIVE} />
          </CircleWrapper>
          <CircleWrapper
            className={classNames({ active: lineWidth === LINE_WIDTH.TEN })}
            onClick={() => updateLineWidth(LINE_WIDTH.TEN)}
          >
            <Circle size={LINE_WIDTH.TEN} />
          </CircleWrapper>
          <CircleWrapper
            className={classNames({ active: lineWidth === LINE_WIDTH.TWENTY })}
            onClick={() => updateLineWidth(LINE_WIDTH.TWENTY)}
          >
            <Circle size={LINE_WIDTH.TWENTY} />
          </CircleWrapper>
        </TopRow>
        <div>
          <button onClick={clearCanvas}>Clear Board</button>
        </div>
      </ToolbarWrapper>
    </>
  );
};

export default Canvas;
