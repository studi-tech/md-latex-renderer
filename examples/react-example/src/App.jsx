import React, { useState } from "react";
import { MarkdownRenderer } from "@md-latex-renderer/react";

const md = String.raw`En la figura adjunta $ABCD$, $EFGH$ y $JKLM$, $ABCD$ son tres cuadrados cuyos lados miden $4 \mathrm{~cm}$, $2 \mathrm{~cm}$ y $1 \mathrm{~cm}$, respectivamente, con $H$ y $E$ en el segmento $C B$, y $J$ y $M$ en el segmento $FG$. Si los rectángulos achurados tienen el mismo ancho, ¿cuál es el área de la región achurada?`;
const md2 = String.raw`¡Hola, comunidad Studi!

Antes que todo: **¡GRACIAS!**
En estos cuatro meses de piloto, más de **1.000 estudiantes** usaron Studi para entrenar la PAES. Su progreso confirma nuestra meta: democratizar la preparación preuniversitaria en Chile.

Este 7 de julio nuestro periodo de piloto termina y Studi _“se gradúa”_. Con esa graduación llega la siguiente etapa: Studi Pro, una suscripción que nos permitirá mantener los servidores encendidos, retribuir a nuestro equipo académico y, sobre todo, lanzar mejoras cada semana.

# ¿Qué seguirá siendo gratis?
- 3 corazones recargables cada 5 h (1 corazón = 1 ensayo).
- Ensayos de Competencia Matemática M1 de 15 preguntas / 30 min, con todos los ejes.
- Si aciertas 12 o más preguntas, ganas un corazón extra: ¡el esfuerzo se premia!
- Historial de todos tus ensayos.
- Profe IA para dudas generales (con energía limitada).
Así, quien lo necesite podrá seguir estudiando sin costo.

# ¿Qué desbloquea la suscripción Studi Pro?
- Acceso a todo el material académico de la asignatura comprada
- Ensayos (de la materia comprada) ilimitados y 100% personalizables (ejes, tiempo y duración).
- Soluciones paso a paso + Profe IA disponible para cada ejercicio (con 200 veces más energía diaria)
- Imprime y escanea tu hoja de respuestas.
- Acceso completo a las lecciones interactivas (de la materia comprada) una vez estén implementadas

# Próximas novedades
- Prueba completa de Comprensión Lectora.
- PAES de Competencia Matemática 2 (M2).
- Lecciones cortas e interactivas para aprender justo lo que necesitas.
- Estadísticas avanzadas para llevar tu preparación al siguiente nivel.


Sabemos que el presupuesto estudiantil es ajustado; por eso la versión gratuita se queda y seguirá creciendo. Si puedes sumarte a Studi Pro, estarás ayudando a que todos tengan una herramienta de estudio potente y justa.

Para más noticias y ser el primero en saber lo que se viene, [¡síguenos en Instagram!](https://www.instagram.com/studi_paes/)

Gracias por confiar en Studi. Si tienes preguntas, ideas locas o solo quieres saludar, ¡escríbenos cuando quieras!

Con cariño y compromiso,
El equipo Studi`;

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
