import React from 'react';

interface Termino {
  id: number;
  concepto: string;
  definicionCorta: string;
  definicionLarga: string;
  ejemplos: string[];
  imagen: string;
  categorias: string[];
}

interface TerminoCardProps {
  termino: Termino;
  onVerMas: (termino: Termino) => void;
  onEliminar: (id: number) => void;
  onToggleFavorito: (id: number) => void;
  esFavorito: boolean;
  estaLogueado: boolean;
  esAdmin?: boolean; // <-- AÑADIR
}

const TerminoCard: React.FC<TerminoCardProps> = ({ 
  termino, 
  onVerMas, 
  onEliminar,
  onToggleFavorito,
  esFavorito,
  estaLogueado,
  esAdmin = false // <-- VALOR POR DEFECTO
}) => {
  // ...

  return (
    <article className="card">
      <img src={termino.imagen} alt={termino.concepto} loading="lazy" />
      <h3>{termino.concepto}</h3>
      <p>{termino.definicionCorta}</p>
      
      <button className="ver-mas-btn" onClick={() => onVerMas(termino)}>
        Ver más
      </button>
      
      <button 
        className={`fav-btn ${esFavorito ? 'favorito' : ''}`}
        onClick={() => estaLogueado ? onToggleFavorito(termino.id) : alert('Debes iniciar sesión')}
        title={estaLogueado ? 'Marcar como favorito' : 'Inicia sesión para guardar'}
      >
        {esFavorito ? '★' : '☆'}
      </button>

      {/* BOTÓN DE ELIMINAR: Solo se muestra si esAdmin es true */}
      {esAdmin && (
        <button 
          className="eliminar-btn"
          onClick={() => onEliminar(termino.id)}
          title="Eliminar término (Solo Admin)"
          aria-label={`Eliminar ${termino.concepto}`}
        >
          🗑️
        </button>
      )}
    </article>
  );
};

export default TerminoCard;