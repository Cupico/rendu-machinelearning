import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [board, setBoard] = useState([]);

  const [humainCoup, setHumainCoup] = useState([]);
  const [iaCoup, setIaCoup] = useState([]);

  const [turn, setTurn] = useState(0);

  const rows = 6;
  const columns = 7;

  const humain = "yellow";
  const ia = "red";

  // const turn = "humain";

  useEffect(() => {
    let plateau = [];

    for (let i = 0; i < rows; i++) {
      plateau[i] = [];
      for (let j = 0; j < columns; j++) {
        plateau[i][j] = 0;
      }
    }
    setBoard(plateau);
  }, []);

  const handleClick = (e) => {
    let player;

    if (turn % 2 === 0) {
      console.log("PAIR ?");
      player = 1;
    } else {
      player = 2;
    }

    let row = parseFloat(e.row);
    let column = parseFloat(e.column);

    // const buttonCheck = document.getElementById(`button${row}-${column}`);

    // if (buttonCheck && (buttonCheck.style.backgroundColor === "red" || buttonCheck.style.backgroundColor === "yellow")) {
    //   setTurn(prevState => prevState + 1)
    // }

    let getBoard = [...board];

    getBoard[row][column] = player;

    setBoard(getBoard);

    setTurn((prevState) => prevState + 1);

    const button = document.getElementById(`button${row}-${column}`);

    if (button) {
      if ((turn - 1) % 2 === 0) {
        //pair
        button.style.backgroundColor = "yellow";
      } else {
        // let rowIA = 3;
        // let columnIA = 5;
        // handleClick({row: rowIA, column: columnIA})
        button.style.backgroundColor = "red";
      }
    }
  };

  useEffect(() => {
    if ((turn - 1) % 2 !== 0) {
      console.log("A MOI");
    } else {
      let getBoard = [...board];

      const getAllIndexes = (arr, val) => {
        var indexes = [],
          i;
        for (i = 0; i < arr.length; i++) if (arr[i] === val) indexes.push(i);
        return indexes;
      };

      let nextMove = { row: null, column: null };

      // --------------------------------- Find NEXT MOVE --------------------------------- \\

      for (let x = 0; x < getBoard.length; x++) {
        if (getBoard[x].includes(2)) {
          let foundIndex = getAllIndexes(getBoard[x], 2);

          for (let i = 0; i < foundIndex.length; i++) {
            //LEFT
            if (getBoard[x][foundIndex[i] - 1] === 0) {
              nextMove.column = foundIndex[i] - 1;
              nextMove.row = x;
            }
            //Right
            if (getBoard[x][foundIndex[i] + 1] === 0) {
              nextMove.column = foundIndex[i] + 1;
              nextMove.row = x;
            }
            // UP 2
            if (getBoard[x - 2][foundIndex[i]] === 0) {
              nextMove.column = foundIndex[i];
              nextMove.row = x - 2;
            }
            // UP
            if (getBoard[x - 1][foundIndex[i]] === 0) {
              nextMove.column = foundIndex[i];
              nextMove.row = x - 1;
            }
          }
        }
      }

      // --------------------------------- DONT LOOSE BRO --------------------------------- \\

      const dontLoose = () => {
        let playerWin;
        for (let x = 0; x < getBoard.length; x++) {
          playerWin = getAllIndexes(getBoard[x], 1);
          for (let y = 0; y < playerWin.length; y++) {
            // Check Horizontal si 2 jetons d'affilés
            if (getBoard[x][playerWin[y]] === getBoard[x][playerWin[y] + 1]) {
              if (getBoard[x][playerWin[y] - 1] === 0) {
                nextMove.column = playerWin[y] - 1;
                nextMove.row = x;
              }
              if (getBoard[x][playerWin[y] + 2] === 0) {
                nextMove.column = playerWin[y] + 2;
                nextMove.row = x;
              }
            }

            // check vertical up
            if (getBoard[x][playerWin[y]] === getBoard[x - 1][playerWin[y]]) {
              if (getBoard[x - 2][playerWin[y]] === 0) {
                nextMove.column = playerWin[y];
                nextMove.row = x - 2;
              }
            }
          }
        }
      };

      dontLoose();

      // ----------------------------------------------------------------------------------- \\

      if (nextMove.column !== null && nextMove.row !== null) {
        console.log("next", nextMove);
        handleClick(nextMove);
      } else {
        if (getBoard[5][3] === 0) {
          handleClick({ row: 5, column: 3 });
        } else {
          handleClick({ row: 4, column: 3 });
        }
      }
    }
  }, [turn, board]);

  return (
    <div className="App">
      <h2>Tour : {turn}</h2>
      <br />
      {board.length > 0 &&
        board.map((e, i) => (
          <div key={i} style={{ display: "flex", flexDirectio: "column" }}>
            {e.map((f, j) => (
              <button
                id={`button${i}-${j}`}
                style={{
                  width: "70px",
                  height: "70px",
                }}
                key={j}
                value={i}
                name={j}
                onClick={(e) =>
                  handleClick({ row: e.target.value, column: e.target.name })
                }
              ></button>
            ))}
          </div>
        ))}
    </div>
  );
}

export default App;
