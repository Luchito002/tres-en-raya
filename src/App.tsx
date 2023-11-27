import { useState } from "react";

function App() {
  const [arregloCasillas, setArregloCasillas] = useState<(string | null)[]>(
    [null, null, null, null, null, null, null, null, null]
  )

  const [final, setFinal] = useState<boolean>(false)
  const [finalMensaje, setFinalMensaje] = useState<string>("");

  //const [primeraJugada, setPrimeraJugada] = useState<boolean>(true)

  async function obtenerPosicion(tableroActual: (string | null)[]) {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/tree', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ arreglo_tablero: tableroActual }),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const data = await response.json();
      //console.log(data);
      return data.posicion
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleClick = (index: number) => {
    if (arregloCasillas[index] === null) {
      const tableroActual = [...arregloCasillas];
      tableroActual[index] = "O"

      if (tableroActual[4] === null) {
        tableroActual[4] = "X"
        setArregloCasillas(tableroActual)
        return
      }

      if (verificarGanador(tableroActual)) {
        setArregloCasillas(tableroActual)
        setFinal(true)
        setFinalMensaje(`EL GANADOR ES ${verificarGanador(tableroActual)}`)
        return
      }

      if (verificarEmpate(tableroActual)) {
        setArregloCasillas(tableroActual)
        setFinal(true)
        setFinalMensaje("EMPATE")
        return
      }

      computadoraJugada(tableroActual)
    }
  }

  /*
        if (primeraJugada) {
          let indiceAleatorio;
          do {
            indiceAleatorio = Math.floor(Math.random() * tableroActual.length);
          } while (indiceAleatorio === index);
          tableroActual[indiceAleatorio] = "X";
          setPrimeraJugada(false);
          setArregloCasillas(tableroActual)
        } else {
  */

  const computadoraJugada = async (tableroActual: (string | null)[]) => {
    //console.log("Antes de la asignar posicion")
    //console.log(tableroActual)
    const posicion = await obtenerPosicion(tableroActual)
    tableroActual[posicion] = "X"
    setArregloCasillas(tableroActual)

    if (verificarGanador(tableroActual)) {
      setFinalMensaje(`EL GANADOR ES ${verificarGanador(tableroActual)}`)
      setFinal(true)
    }

    if (verificarEmpate(tableroActual)) {
      setFinalMensaje("EMPATE")
      setFinal(true)
    }
    //console.log("Despues de la asignar posicion")
    //console.log(tableroActual)
  }

  const verificarGanador = (tablero: (string | null)[]): string | null => {
    const lineasGanadoras = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
      [0, 4, 8], [2, 4, 6]             // Diagonales
    ];

    for (const linea of lineasGanadoras) {
      const [a, b, c] = linea;
      if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
        return tablero[a];
      }
    }

    return null;
  };

  const verificarEmpate = (tablero: (string | null)[]): boolean => {
    return tablero.every(casilla => casilla !== null);
  };

  const reiniciar = () => {
    setArregloCasillas([null, null, null, null, null, null, null, null, null])
    setFinalMensaje("")
    setFinal(false)
  }

  const renderButton = (index: number) => {
    return (
      <button
        key={index}
        type="button"
        onClick={() => handleClick(index)}
        title={`Casilla ${index + 1}`}
        className="h-20 w-20 bg-cyan-800 hover:bg-[#087a8b] relative text-white"
        disabled={final}
      >
        <p className="text-4xl">
          {arregloCasillas[index]}
        </p>

        <span className="absolute bottom-0 right-2 text-gray-300">
          {index + 1}
        </span>
      </button>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#073238]">
      {
        finalMensaje !== "" && (
          <div className="mb-5 text-white text-4xl">
            {finalMensaje}
          </div>
        )
      }

      <div className="grid grid-cols-3 gap-2">
        {arregloCasillas.map((_, index) => (
          renderButton(index)
        ))}
      </div>
      {
        finalMensaje !== "" && (
          <button 
            type="button"
            className="mb-5 text-white text-2xl mt-8 bg-green-600 p-4 rounded-xl hover:bg-green-800 hover:text-gray-400"
            onClick={reiniciar}
          >
            VOLVER A JUGAR
          </button>
        )
      }
    </div>
  )
}

export default App
