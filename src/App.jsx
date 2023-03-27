import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Este archivo contiene un componente React que muestra varios cronómetros
// y permite a los usuarios iniciar, detener y restablecer cada cronómetro.
// Está pensado para hacer time tracking, por lo que al iniciar un cronómetro,
// los demás se detienen.
// Los usuarios también pueden cambiar el nombre de cada cronómetro.
// Los usuarios pueden elegir la cantidad de cronómetros.

function App() {
  // Estado que almacena cuántos cronómetros se mostrarán.

  const [numStopWs, setNumStopWs] = useState(3);

  // Estado para almacenar el tiempo en que la pestaña se volvió inactiva
  const [inactiveTime, setInactiveTime] = useState(null);

  // Estado que almacena la información de cada cronómetro: su ID, tiempo y si está activo.
  const [stopW, setStopW] = useState([
    { id: 1, time: new Date(2023, 0, 1, 0, 0, 0, 0), isActive: false },
    { id: 2, time: new Date(2023, 0, 1, 0, 0, 0, 0), isActive: false },
    { id: 3, time: new Date(2023, 0, 1, 0, 0, 0, 0), isActive: false },
  ]);

  // Estado que almacena el nombre de cada cronómetro.
  const [stopWNames, setStopWNames] = useState([
    "Cronómetro 1",
    "Cronómetro 2",
    "Cronómetro 3",
  ]);

  // Maneja el cambio de nombre de un cronómetro.
  const handleNameChange = (stopWId, newName) => {
    setStopWNames((prevStopWNames) =>
      prevStopWNames.map((name, index) =>
        index === stopWId - 1 ? newName : name
      )
    );
  };

  // Maneja el cambio de la cantidad de cronómetros.
  const handleNumStopWChange = (event) => {
    let newNumStopW;
    if (!isNaN(parseInt(event.target.value))) {
      newNumStopW = parseInt(event.target.value);
    } else {
      setNumStopWs(newNumStopW);
      return;
    }
    setStopW((prevStopW) => {
      if (newNumStopW > prevStopW.length) {
        const newStopW = [];
        for (let i = prevStopW.length; i < newNumStopW; i++) {
          newStopW.push({
            id: i + 1,
            time: new Date(2023, 0, 1, 0, 0, 0, 0),
            isActive: false,
          });
        }
        return [...prevStopW, ...newStopW];
      } else {
        return prevStopW.slice(0, newNumStopW);
      }
    });
    setStopWNames((prevStopWNames) => {
      if (newNumStopW > prevStopWNames.length) {
        const newStopWNames = [];
        for (let i = prevStopWNames.length; i < newNumStopW; i++) {
          newStopWNames.push(`Cronómetro ${i + 1}`);
        }
        return [...prevStopWNames, ...newStopWNames];
      } else {
        return prevStopWNames.slice(0, newNumStopW);
      }
    });
  };

  // Inicia un cronómetro con el ID dado y detiene todos los demás cronómetros.
  const startStopW = (stopWId) => {
    setStopW((stopWs) =>
      stopWs.map((stopW) =>
        stopW.id === stopWId
          ? { ...stopW, isActive: true }
          : { ...stopW, isActive: false }
      )
    );
  };

  // Detiene un cronómetro con el ID dado.
  const stopStopW = (stopWId) => {
    setStopW((prevStopWs) =>
      prevStopWs.map((stopW) =>
        stopW.id === stopWId ? { ...stopW, isActive: false } : stopW
      )
    );
  };

  // Restablece un cronómetro con el ID dado a su estado original.
  const clearStopW = (stopWId) => {
    setStopW((prevStopWs) =>
      prevStopWs.map((stopW) =>
        stopW.id === stopWId
          ? {
              ...stopW,
              time: new Date(2023, 0, 1, 0, 0, 0, 0),
              isActive: false,
            }
          : stopW
      )
    );
  };

  // Actualiza el estado del cronómetro para reflejar el tiempo transcurrido.
  useEffect(() => {
    // El cronómetro se actualiza cada 10 milisegundos.
    const intervalId = setInterval(() => {
      setStopW((prevStopWs) =>
        prevStopWs.map((stopW) =>
          stopW.isActive
            ? {
                ...stopW,
                time: new Date(
                  2023,
                  0,
                  0,
                  stopW.time.getHours(),
                  stopW.time.getMinutes(),
                  stopW.time.getSeconds(),
                  stopW.time.getMilliseconds() + 10
                ),
              }
            : { ...stopW, isActive: false }
        )
      );
    }, 10);

    // Escucha el evento 'visibilitychange' para detectar cambios en la visibilidad de la pestaña
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Si la pestaña está inactiva, guarda el tiempo actual en 'inactiveTime'
        setInactiveTime(new Date());
      } else {
        // Si la pestaña está activa, calcula el tiempo transcurrido desde que la pestaña estaba inactiva
        const currentTime = new Date();
        const elapsedTime = currentTime - inactiveTime;

        // Actualiza los cronómetros activos con el tiempo transcurrido
        setStopW((prevStopWs) =>
          prevStopWs.map((stopW) =>
            stopW.isActive
              ? {
                  ...stopW,
                  time: new Date(stopW.time.getTime() + elapsedTime),
                }
              : stopW
          )
        );

        // Restablece el tiempo inactivo
        setInactiveTime(null);
      }
    };

    // Agrega el controlador del evento 'visibilitychange' al objeto 'document'
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      // Elimina el controlador del evento 'visibilitychange' al desmontar el componente
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [inactiveTime]);

  return (
    <div className="container mt-5">
      <h2 className="mb-2 text-center">Multi Cron</h2>
      <h6 className="mb-5 text-center">Time Tracker</h6>
      <div className="d-flex flex-wrap justify-content-evenly">
        {stopW.map((stopW, index) => (
          <div
            key={stopW.id}
            className="card m-4 d-inline-block"
            style={{ width: 18 + "rem" }}
          >
            <div className="card-body">
              <input
                className="form-control mb-3 text-center"
                type="text"
                value={stopWNames[index]}
                onChange={(event) =>
                  handleNameChange(stopW.id, event.target.value)
                }
              />
              <div className="my-4 d-flex justify-content-center">
                <h3
                  className="card-title d-inline-block text-left"
                  style={{ minWidth: 9.1 + "rem" }}
                >
                  {` ${stopW.time.toTimeString().substring(0, 8)},${
                    Number(
                      stopW.time.getMilliseconds().toString().substring(0, 2)
                    ) < 10
                      ? "0" +
                        stopW.time.getMilliseconds().toString().substring(0, 2)
                      : stopW.time.getMilliseconds().toString().substring(0, 2)
                  }`}
                </h3>
              </div>

              <div className="d-flex justify-content-evenly px-3">
                <button
                  className="btn btn-primary me-2"
                  onClick={() => startStopW(stopW.id)}
                >
                  Start
                </button>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => stopStopW(stopW.id)}
                >
                  Stop
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => clearStopW(stopW.id)}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="my-4 mx-auto mt-5" style={{ width: 18 + "rem" }}>
        <label
          className="form-label text-center 
 d-block px-5"
        >
          Cronómetros:
          <input
            className="numberOfCrhons form-control text-center"
            type="text"
            inputMode="numeric"
            value={numStopWs}
            onChange={handleNumStopWChange}
          />
        </label>
      </div>
    </div>
  );
}

export default App;
