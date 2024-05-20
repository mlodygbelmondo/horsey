"use client";
import { Solution } from "@/core/kt-backtracking";
import findElementIn2DArray from "@/utils/find-element-in-2d-array";
import * as React from "react";
import { Knight } from "./Knight";

const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 800;

interface Line {
  x1: number;
  y1: number;
  angle: number;
  width: number;
}

interface BacktrackingAlgorithmWorkerMessage {
  solution: Solution;
  calculationTime: number;
}

const Home = () => {
  const [knightPosition, setKnightPosition] = React.useState({
    x: 0,
    y: 0,
  });
  const [N, setN] = React.useState(5);
  const [lines, setLines] = React.useState<Line[]>([]);
  const [hasSolution, setHasSolution] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);
  const [calculating, setCalculating] = React.useState(false);
  const [calculationTime, setCalculationTime] = React.useState(0);
  const [startingPosition, setStartingPosition] = React.useState({
    x: 0,
    y: 0,
  });

  const backtrackingAlgorithmWorker = React.useRef<Worker>();

  const cellWidth = BOARD_WIDTH / N;

  const startKnightsTour = async () => {
    if (backtrackingAlgorithmWorker.current) {
      setCompleted(false);
      setCalculating(true);
      setLines([]);
      setStartingPosition(knightPosition);

      backtrackingAlgorithmWorker.current.postMessage({
        startingX: knightPosition.x,
        startingY: knightPosition.y,
        N,
      });
    }
  };

  React.useEffect(() => {
    backtrackingAlgorithmWorker.current = new Worker(
      new URL("../workers/backtracking-algorithm-worker.ts", import.meta.url),
    );

    const animateSolution = (solution: Solution) => {
      return new Promise<void>((resolve) => {
        if (solution.length === 0) return;
        let i = 1;
        let currentX = knightPosition.x;
        let currentY = knightPosition.y;
        const interval = setInterval(() => {
          if (i >= N * N) {
            clearInterval(interval);
            resolve();
          }
          const element = findElementIn2DArray(solution, i);
          if (element) {
            setKnightPosition({ x: element[0], y: element[1] });

            const width = Math.sqrt(
              Math.pow(element[0] - currentX, 2) +
                Math.pow(element[1] - currentY, 2),
            );

            const angle =
              Math.atan2(element[1] - currentY, element[0] - currentX) *
              (180 / Math.PI);

            const newLine = {
              x1: currentX,
              y1: currentY,
              angle: angle,
              width,
            };

            setLines((prev) => [...prev, newLine]);

            currentX = element[0];
            currentY = element[1];
          }
          i++;
        }, 300);
      });
    };

    if (backtrackingAlgorithmWorker.current) {
      backtrackingAlgorithmWorker.current.onmessage = async (
        e: MessageEvent<BacktrackingAlgorithmWorkerMessage>,
      ) => {
        const { calculationTime, solution } = e.data;

        setCompleted(true);
        setHasSolution(!!solution);
        setCalculationTime(calculationTime);
        if (solution) {
          await animateSolution(solution);
        } else {
          console.log("Solution does not exist");
          alert("Rozwiązanie nie istnieje");
        }
        setCalculating(false);
      };
    }
  }, [N, backtrackingAlgorithmWorker, knightPosition.x, knightPosition.y]);

  const renderSquare = (row: number, col: number) => {
    const isDark = (row + col) % 2 === 1;
    return (
      <div
        key={`${row}-${col}`}
        className={isDark ? "bg-[#AE8A68]" : "bg-[#ECDAB9]"}
        style={{
          width: BOARD_WIDTH / N,
          height: BOARD_HEIGHT / N,
        }}
      />
    );
  };

  const renderBoard = () => {
    let board = [];
    for (let row = 0; row < N; row++) {
      for (let col = 0; col < N; col++) {
        board.push(renderSquare(row, col));
      }
    }
    return board;
  };

  const terminateBacktrackingAlgorithmWorker = () => {
    backtrackingAlgorithmWorker.current?.terminate();
    setCalculating(false);
    setCompleted(false);
    setHasSolution(false);
  };

  return (
    <div className="grid items-center justify-center">
      <div className="flex items-center justify-center gap-3 mt-5">
        <label htmlFor="N">Rozmiar planszy</label>
        <input
          type="number"
          disabled={calculating}
          defaultValue={N}
          onChange={(e) => {
            const n = parseInt(e.target.value);
            setLines([]);

            if (n && n < 100) {
              setN(parseInt(e.target.value));
              setKnightPosition({ x: 0, y: 0 });
            }
          }}
          className="border border-gray-300 rounded h-10 w-36 text-black"
        />
        <label htmlFor="N">Pozycja konia (x,y)</label>
        <input
          defaultValue={`${knightPosition.x},${knightPosition.y}`}
          type="text"
          disabled={calculating}
          onChange={(e) => {
            const [x, y] = e.target.value.split(",");
            const xInt = parseInt(x);
            const yInt = parseInt(y);
            setLines([]);
            if (xInt >= 0 && xInt < N && yInt >= 0 && yInt < N) {
              setKnightPosition({ x: xInt, y: yInt });
            }
          }}
          className="border border-gray-300 rounded h-10 w-36 text-black"
        />
      </div>
      <div className="flex items-center justify-center gap-3">
        <button
          disabled={calculating}
          className="bg-blue-500 text-white px-4 py-2 rounded my-4 disabled:bg-blue-300 disabled:text-gray-500"
          onClick={() => startKnightsTour()}
        >
          Oblicz trasę skoczka
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded my-4"
          onClick={() => terminateBacktrackingAlgorithmWorker()}
        >
          Przerwij obliczenia
        </button>
      </div>
      {completed ? (
        <div className="flex items-center p-2 justify-center">
          {hasSolution ? "Rozwiązanie istnieje" : "Rozwiązanie nie istnieje"}.
          Czas wykonania algorytmu: {calculationTime.toFixed(2)} ms
        </div>
      ) : calculating ? (
        <div className="flex items-center p-2 justify-center">
          Obliczanie...
        </div>
      ) : null}
      <div
        className="grid grid-cols-5 grid-rows-5 w-80 h-80 relative"
        style={{
          width: BOARD_WIDTH,
          height: BOARD_HEIGHT,
          gridTemplateColumns: `repeat(${N}, 1fr)`,
          gridTemplateRows: `repeat(${N}, 1fr)`,
        }}
      >
        <div
          style={{
            width: BOARD_WIDTH / N,
            height: BOARD_HEIGHT / N,
            top: knightPosition.y * (BOARD_HEIGHT / N),
            left: knightPosition.x * (BOARD_WIDTH / N),
          }}
          className="absolute transition-all duration-200 ease-out"
        >
          <Knight />
        </div>
        {renderBoard()}
        {lines.map((line, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              width: line.width * cellWidth,
              height: 2,
              top: line.y1 * cellWidth + cellWidth / 2,
              left: line.x1 * cellWidth + cellWidth / 2,
              transform: `rotate(${line.angle}deg)`,
              backgroundColor: "#ff0000",
              transformOrigin: "0 0",
            }}
          />
        ))}
        <div
          className="bg-[#ff0000] w-3 h-3 rounded-full absolute"
          style={{
            top: startingPosition.y * cellWidth + cellWidth / 2 - 6,
            left: startingPosition.x * cellWidth + cellWidth / 2 - 6,
          }}
        />
      </div>
    </div>
  );
};

export default Home;
