import { CSSProperties } from "react";

// export const ModalStyles:CSSProperties = {
//     position:'fixed',
//     width:'50vw',
//     margin:'10vh auto',
//     left:0,
//     right:0,
//     boxShadow:'var(--shadow-1)'
// }
/* ModalStyles.css (puedes ajustar estos estilos según tus necesidades) */
export const ModalStyles:CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo opaco
    zIndex: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white', // Puedes cambiar el color del texto según tus necesidades
  };
  