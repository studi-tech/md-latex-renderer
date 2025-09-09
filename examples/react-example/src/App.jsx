import React, { useState } from "react";
import { MarkdownRenderer } from "@md-latex-renderer/react";

const md = String.raw`¿Cuál es el menor número entero de dos cifras que al dividirlo por $3$, al dividirlo por $4$ y al dividirlo por $5$, su resto es $2$?`;
const md2 = String.raw`Para determinar cuál de las funciones cuadráticas es la correcta, consideremos las características de la parábola descrita en la imagen:

1. Vértice de la parábola: $(1, 2)$
2. Intersección con el eje $y$: $(0, 3)$

La forma general de una función cuadrática es $y = ax^2 + bx + c$. Para encontrar cuál de las funciones dadas tiene el vértice en $(1, 2)$, podemos usar la fórmula del vértice para una parábola: $x = -\frac{b}{2a}$.

Calculamos esto para cada opción:

- $y = x^2 + 2x - 3$: 
  - Vértice en $x = -\frac{2}{2} = -1$ (incorrecto)
    - Vértice en $x = -\frac{2}{2} = -1$ (incorrecto)
      - Vértice en $x = -\frac{2}{2} = -1$ (incorrecto)

- $y = x^2 - 2x + 3$: 
  - Vértice en $x = \frac{2}{2} = 1$ (correcto)

- $y = x^2 + 2x + 3$: 
  - Vértice en $x = -\frac{2}{2} = -1$ (incorrecto)

- $y = x^2 - 2x - 3$: 
  - Vértice en $x = \frac{2}{2} = 1$ (correcto), pero la parábola interseca el eje $y$ en $-3$, no en $3$.

Ahora, verifiquemos qué ecuación pasa por la coordenada $(0, 3)$:

La función $y = x^2 - 2x + 3$ 

Si $x = 0$, entonces $y = 0^2 - 2(0) + 3 = 3$, que coincide con la intersección dada.

Por lo tanto, la función cuadrática correcta es $y = x^2 - 2x + 3$. 🎉`;

export default function App() {
  const [selection, setSelection] = useState(null);
  return (
    <div
      style={{
        // width: "430px",
        // height: "932px",
        backgroundColor: "lightgray",
        // opacity: "70%",
        padding: "20px",
        overflow: "scroll",
      }}
    >
      <MarkdownRenderer latex={md2} fontSize={20} />
    </div>
  );
}
